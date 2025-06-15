
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRequisicaoChat } from "@/hooks/useRequisicaoChat";
import { useAuth } from "@/hooks/useAuth";
import { useRequisicaoParticipants } from "./useRequisicaoParticipants";
import { Solicitacao } from "@/types/solicitacao";

interface RequisicaoChatProps {
  requisicao: Solicitacao;
}

export const RequisicaoChat: React.FC<RequisicaoChatProps> = ({ requisicao }) => {
  const { user } = useAuth();
  const { chatMessages, isLoading, error, sendMessage } = useRequisicaoChat(
    requisicao.id
  );
  const [mensagem, setMensagem] = useState("");

  // Utilitário de participantes
  const {
    getSolicitanteId,
    getSolicitanteNome,
    getAnalistaId,
    getAnalistaNome,
    getGrupoNome,
    getGrupoId,
  } = useRequisicaoParticipants(requisicao, user?.id);

  // Confere se o usuário faz parte da requisição para autorizar envio
  const pertenceAoChamado = [
    requisicao.solicitante_id,
    requisicao.atendente_id,
  ]
    .filter(Boolean)
    .includes(user?.id || "");

  const handleEnviarMensagem = async () => {
    if (!mensagem.trim()) return;
    if (!user?.id) {
      alert("É necessário estar autenticado para enviar mensagens.");
      return;
    }

    if (!pertenceAoChamado) {
      alert(
        `Atenção: Seu usuário (${user.id}) NÃO está listado em solicitante_id nem atendente_id deste chamado!\n` +
          "Isso irá bloquear o envio da mensagem pelo Supabase RLS.\n" +
          "Verifique se você realmente está vinculado a esse chamado."
      );
    }

    try {
      await sendMessage.mutateAsync({
        requisicao_id: requisicao.id,
        criado_por: user.id,
        autor_tipo: "analista",
        mensagem: mensagem.trim(),
      });

      // Disparar webhook (reutiliza a lógica anterior)
      try {
        await fetch(
          "https://n8n-n8n-onlychurch.ibnltq.easypanel.host/webhook-test/notificacao-chat-solicitacao",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              solicitante_id: getSolicitanteId(),
              solicitante_nome: getSolicitanteNome(),
              analista_id: getAnalistaId(),
              analista_nome: getAnalistaNome(),
              grupo_nome: getGrupoNome(),
              grupo_id: getGrupoId(),
              mensagem: mensagem.trim(),
            }),
          }
        );
      } catch (wberr) {
        console.error("Falha ao enviar webhook de notificação de chat:", wberr);
      }

      setMensagem("");
    } catch (e: any) {
      console.error("Erro ao enviar mensagem no chat:", e);
      alert(
        "Erro: Não foi possível enviar mensagem. Você não está autorizado para esse chamado (somente participantes podem enviar mensagens)."
      );
    }
  };

  // Função utilitária para label do remetente
  const getRemetenteLabel = (msg: { criado_por: string; autor_tipo: "analista" | "cliente" }) => {
    if (!!requisicao.solicitante_id && msg.criado_por === requisicao.solicitante_id) {
      return "Solicitante";
    }
    if (!!requisicao.atendente_id && msg.criado_por === requisicao.atendente_id) {
      return "Analista";
    }
    if (!!requisicao.grupo_responsavel_id && msg.criado_por === requisicao.grupo_responsavel_id) {
      return "Analista";
    }
    return msg.autor_tipo === "analista" ? "Analista" : "Cliente";
  };

  return (
    <div className="border rounded-lg bg-background p-4 flex flex-col h-[300px] md:h-[350px] w-full">
      <ScrollArea className="flex-1 px-1 overflow-y-auto mb-2">
        <div className="flex flex-col gap-2">
          {isLoading && <div className="text-muted-foreground">Carregando mensagens…</div>}
          {error && <div className="text-destructive">Erro ao carregar chat</div>}
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.autor_tipo === "analista" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  msg.autor_tipo === "analista"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span className="block">{msg.mensagem}</span>
                <span className="block text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.criado_em).toLocaleString()} • {getRemetenteLabel(msg)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form
        className="flex gap-2 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleEnviarMensagem();
        }}
      >
        <Input
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1"
          disabled={sendMessage.isPending}
        />
        <Button type="submit" disabled={!mensagem.trim() || sendMessage.isPending}>
          {sendMessage.isPending ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

