
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send } from "lucide-react";
import { useIncidenteChat } from "@/hooks/useIncidenteChat";
import { useAuth } from "@/hooks/useAuth";
import { useIncidenteParticipants } from "./useIncidenteParticipants";
import { useChatFileUpload } from "@/hooks/useChatFileUpload";
import { useWebhookNotification } from "@/hooks/useWebhookNotification";
import { useToast } from "@/hooks/use-toast";
import { Solicitacao } from "@/types/solicitacao";

interface IncidenteChatProps {
  incidente: Solicitacao;
}

export const IncidenteChat: React.FC<IncidenteChatProps> = ({ incidente }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { chatMessages, isLoading, error, sendMessage, sendMessageWithFile } = useIncidenteChat(
    incidente.id
  );
  const { uploadFile, uploading } = useChatFileUpload();
  const { notifyIncidenteUpdated, notifyChatMessage } = useWebhookNotification();
  const [mensagem, setMensagem] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    getSolicitanteId,
    getSolicitanteNome,
    getAnalistaId,
    getAnalistaNome,
    getGrupoNome,
    getGrupoId,
  } = useIncidenteParticipants(incidente, user?.id);

  const pertenceAoChamado = [
    incidente.solicitante_id,
    incidente.atendente_id,
  ]
    .filter(Boolean)
    .includes(user?.id || "");

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    if (!pertenceAoChamado) {
      toast({
        title: "Erro de Permissão",
        description: "Você não tem permissão para enviar arquivos porque não faz parte do grupo responsável pelo caso.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileUrl = await uploadFile(file, incidente.id);
      if (fileUrl) {
        await sendMessageWithFile.mutateAsync({
          incidente_id: incidente.id,
          criado_por: user.id,
          autor_tipo: "analista",
          mensagem: `📎 Imagem enviada: ${file.name}`,
          arquivo_url: fileUrl,
          tipo_arquivo: file.type,
        });

        // Chat message webhook notification
        await notifyChatMessage('incidente', incidente, `📎 Imagem enviada: ${file.name}`);
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
      toast({
        title: "Erro de Autenticação",
        description: "É necessário estar autenticado para enviar mensagens.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendMessage.mutateAsync({
        incidente_id: incidente.id,
        criado_por: user.id,
        autor_tipo: "analista",
        mensagem: mensagem.trim(),
      });

      // Chat message webhook notification
      await notifyChatMessage('incidente', incidente, mensagem.trim());
      setMensagem("");
    } catch (e: any) {
      console.error("Erro ao enviar mensagem no chat:", e);
      
      // Check for different types of permission errors
      const isPermissionError = e?.code === '42501' || 
                               e?.code === 42501 ||
                               e?.message?.includes('row-level security policy') ||
                               e?.message?.includes('Forbidden') ||
                               e?.status === 403 ||
                               (typeof e === 'object' && e !== null && 
                                (String(e).includes('42501') || String(e).includes('row-level security')));
      
      toast({
        title: "Erro de Permissão",
        description: isPermissionError 
          ? "Você não tem permissão para enviar mensagens porque não faz parte do grupo responsável pelo caso."
          : `Erro ao enviar mensagem: ${e?.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  const getRemetenteLabel = (msg: { criado_por: string; autor_tipo: "analista" | "cliente" }) => {
    if (!!incidente.solicitante_id && msg.criado_por === incidente.solicitante_id) {
      return "Solicitante";
    }
    if (!!incidente.atendente_id && msg.criado_por === incidente.atendente_id) {
      return "Analista";
    }
    if (!!incidente.grupo_responsavel_id && msg.criado_por === incidente.grupo_responsavel_id) {
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
