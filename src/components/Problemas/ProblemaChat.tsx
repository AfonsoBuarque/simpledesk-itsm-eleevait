
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useProblemaChat } from '@/hooks/useProblemaChat';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProblemaChatProps {
  problemaId: string;
}

export const ProblemaChat = ({ problemaId }: ProblemaChatProps) => {
  const [novaMensagem, setNovaMensagem] = useState('');
  const { mensagens, isLoading, enviarMensagem } = useProblemaChat(problemaId);

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim()) return;

    try {
      await enviarMensagem.mutateAsync({
        mensagem: novaMensagem,
        autor_tipo: 'analista',
      });
      setNovaMensagem('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (isLoading) {
    return <div>Carregando chat...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Chat do Problema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mensagens.map((mensagem) => (
              <div key={mensagem.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {(mensagem as any).usuario?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {(mensagem as any).usuario?.name || 'Usuário'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(mensagem.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{mensagem.mensagem}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <Button
              onClick={handleEnviarMensagem}
              disabled={!novaMensagem.trim() || enviarMensagem.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
