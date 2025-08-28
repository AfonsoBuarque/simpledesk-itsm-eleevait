
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send } from "lucide-react";
import { useRequisicaoChat } from "@/hooks/useRequisicaoChat";
import { useAuth } from "@/hooks/useAuth";
import { useRequisicaoParticipants } from "./useRequisicaoParticipants";
import { useChatFileUpload } from "@/hooks/useChatFileUpload";
import { useWebhookNotification } from "@/hooks/useWebhookNotification";
import { Solicitacao } from "@/types/solicitacao";

interface RequisicaoChatProps {
  requisicao: Solicitacao;
}

export const RequisicaoChat: React.FC<RequisicaoChatProps> = ({ requisicao }) => {
  const { user } = useAuth();
  const { chatMessages, isLoading, error, sendMessage, sendMessageWithFile } = useRequisicaoChat(
    requisicao.id
  );
  const { uploadFile, uploading } = useChatFileUpload();
  const { notifyRequisicaoUpdated } = useWebhookNotification();
  const [mensagem, setMensagem] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    if (!pertenceAoChamado) {
      alert("Você não está autorizado a enviar arquivos neste chamado.");
      return;
    }

    try {
      const fileUrl = await uploadFile(file, requisicao.id);
      if (fileUrl) {
        await sendMessageWithFile.mutateAsync({
          requisicao_id: requisicao.id,
          criado_por: user.id,
          autor_tipo: "analista",
          mensagem: `📎 Imagem enviada: ${file.name}`,
          arquivo_url: fileUrl,
          tipo_arquivo: file.type,
        });

        // Webhook notification
        await notifyRequisicaoUpdated(requisicao);
      }
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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

      // Webhook notification
      await notifyRequisicaoUpdated(requisicao);

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
                {msg.arquivo_url && msg.tipo_arquivo?.startsWith('image/') && (
                  <div className="mt-2">
                    <img 
                      src={msg.arquivo_url} 
                      alt="Imagem anexa"
                      className="max-w-full h-auto rounded cursor-pointer"
                      style={{ maxHeight: '200px' }}
                      onClick={() => window.open(msg.arquivo_url, '_blank')}
                    />
                  </div>
                )}
                <span className="block text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.criado_em).toLocaleString()} • {getRemetenteLabel(msg)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <form
        className="flex gap-2 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleEnviarMensagem();
        }}
      >
        <div className="flex gap-2 flex-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sendMessage.isPending}
            className="shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1"
            disabled={sendMessage.isPending || uploading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!mensagem.trim() || sendMessage.isPending || uploading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

