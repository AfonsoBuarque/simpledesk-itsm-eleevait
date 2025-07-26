import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SolicitacaoFormData, Solicitacao } from '@/types/solicitacao';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import SolicitacaoFormFields from '../Solicitacoes/SolicitacaoFormFields';
import { FileUpload } from '@/components/ui/file-upload';
import { EditRequisicaoReadOnlyFields } from './EditRequisicaoReadOnlyFields';
import { EditRequisicaoDateFields } from './EditRequisicaoDateFields';
import { useEditRequisicaoFormLogic } from './EditRequisicaoFormLogic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useRequisicaoChat } from '@/hooks/useRequisicaoChat';
import { useRequisicaoLogs } from '@/hooks/useRequisicaoLogs';
import { useAuth } from '@/hooks/useAuth';
import { RequisicaoLogs } from "./RequisicaoLogs";
import { RequisicaoChat } from "./RequisicaoChat";
import { useRequisicaoParticipants } from "./useRequisicaoParticipants";

const requisicaoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.literal('requisicao'),
  categoria_id: z.string().optional(),
  sla_id: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta', 'critica']),
  impacto: z.enum(['baixo', 'medio', 'alto']),
  prioridade: z.enum(['baixa', 'media', 'alta', 'critica']),
  status: z.enum(['aberta', 'em_andamento', 'pendente', 'resolvida', 'fechada']),
  solicitante_id: z.string().optional(),
  client_id: z.string().optional(),
  grupo_responsavel_id: z.string().optional(),
  atendente_id: z.string().optional(),
  canal_origem: z.enum(['portal', 'email', 'telefone', 'chat', 'presencial']),
  data_limite_resposta: z.string().optional(),
  data_limite_resolucao: z.string().optional(),
  origem_id: z.string().optional(),
  ativos_envolvidos: z.array(z.any()).optional(),
  notas_internas: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

interface EditRequisicaoDialogProps {
  requisicao: Solicitacao;
  isOpen: boolean;
  onClose: () => void;
}

type ChatMessage = {
  id: string;
  autor: 'analista' | 'cliente';
  texto: string;
  criadoEm: string;
};

export const EditRequisicaoDialog = ({ requisicao, isOpen, onClose }: EditRequisicaoDialogProps) => {
  const { updateRequisicao } = useRequisicoes();
  const [anexos, setAnexos] = useState<string[]>([]);

  // Novo: obter usuário autenticado
  const { user } = useAuth();

  // Estado para Tabs
  const [tab, setTab] = useState("form");

  // Integração com chat e logs do Supabase
  const { chatMessages, isLoading: loadingChat, error: chatError, sendMessage } = useRequisicaoChat(requisicao.id);
  const { logs, isLoading: loadingLogs, error: logsError } = useRequisicaoLogs(requisicao.id);
  const [mensagem, setMensagem] = useState('');

  // Adapta o formato do chatMessage pro esperado pelo componente
  const mappedChatMsgs = chatMessages.map(msg => ({
    id: msg.id,
    autor: msg.autor_tipo,
    texto: msg.mensagem,
    criadoEm: new Date(msg.criado_em).toLocaleString()
  }));

  // Função utilitária para determinar o papel do autor na mensagem de chat
  const getRemetenteLabel = (msg: { criado_por: string; autor_tipo: 'analista' | 'cliente' }) => {
    // Se for o solicitante: Solicitante
    if (!!requisicao.solicitante_id && msg.criado_por === requisicao.solicitante_id) {
      return 'Solicitante';
    }
    // Se for o atendente: Analista
    if (!!requisicao.atendente_id && msg.criado_por === requisicao.atendente_id) {
      return 'Analista';
    }
    // Se for parte do grupo responsável: Analista (ajuste futuro: buscar membros do grupo)
    if (!!requisicao.grupo_responsavel_id && msg.criado_por === requisicao.grupo_responsavel_id) {
      return 'Analista';
    }
    // Caso padrão: manter "Analista" se for o user atual
    return msg.autor_tipo === 'analista' ? 'Analista' : 'Cliente';
  };

  // Novo: Função auxiliar para obter nome do solicitante e analista
  const getSolicitanteNome = () => requisicao.solicitante?.name || requisicao.solicitante_id || 'Solicitante';
  const getAnalistaId = () => requisicao.atendente_id || null;
  const getAnalistaNome = () => requisicao.atendente?.name || requisicao.atendente_id || 'Analista';
  const getGrupoNome = () => requisicao.grupo_responsavel?.name || requisicao.grupo_responsavel_id || '';
  const getGrupoId = () => requisicao.grupo_responsavel_id || '';

  // Envio de mensagem real
  const handleEnviarMensagem = async () => {
    if (!mensagem.trim()) return;
    if (!user?.id) {
      alert('É necessário estar autenticado para enviar mensagens.');
      return;
    }

    // MOSTRAR IDs RELEVANTES PARA DEBUG
    console.log('DEBUG: user.id', user.id);
    console.log('DEBUG: requisicao.solicitante_id', requisicao.solicitante_id);
    console.log('DEBUG: requisicao.client_id', requisicao.client_id);
    console.log('DEBUG: requisicao.grupo_responsavel_id', requisicao.grupo_responsavel_id);
    console.log('DEBUG: requisicao.atendente_id', requisicao.atendente_id);

    // Avisar visualmente se o usuário não é "participante"
    const pertenceAoChamado =
      [requisicao.solicitante_id, requisicao.atendente_id]
        .filter(Boolean)
        .includes(user.id);

    // Grupo do usuário para comparação (não implementado lookup aqui, só log)
    // Você pode buscar via user_groups se necessário e comparar

    if (!pertenceAoChamado) {
      alert(
        `Atenção: Seu usuário (${user.id}) NÃO está listado em solicitante_id nem atendente_id deste chamado!\n` +
        'Isso irá bloquear o envio da mensagem pelo Supabase RLS.\n' +
        'Verifique se você realmente está vinculado a esse chamado.'
      );
    }

    try {
      await sendMessage.mutateAsync({
        requisicao_id: requisicao.id,
        criado_por: user.id,
        autor_tipo: 'analista',
        mensagem: mensagem.trim()
      });
      // Após salvar no banco, disparar webhook:
      try {
        // Determinar solicitante e analista
        const solicitanteId = requisicao.solicitante_id || '';
        const solicitanteNome = getSolicitanteNome();
        const analistaId = getAnalistaId() || user.id;
        const analistaNome = getAnalistaNome();
        const grupoNome = getGrupoNome();
        const grupoId = getGrupoId();

        // Montar payload do webhook conforme solicitado
        await fetch('https://n8n-n8n-onlychurch.ibnltq.easypanel.host/webhook-test/notificacao-chat-solicitacao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            solicitante_id: solicitanteId,
            solicitante_nome: solicitanteNome,
            analista_id: analistaId,
            analista_nome: analistaNome,
            grupo_nome: grupoNome,
            grupo_id: grupoId,
            mensagem: mensagem.trim()
          })
        });
      } catch (wberr) {
        console.error('Falha ao enviar webhook de notificação de chat:', wberr);
      }

      setMensagem('');
    } catch (e: any) {
      console.error('Erro ao enviar mensagem no chat:', e);
      alert(
        'Erro: Não foi possível enviar mensagem. Você não está autorizado para esse chamado (somente participantes podem enviar mensagens).'
      );
    }
  };

  // Logs simulados
  const [logsMock] = useState([
    { id: 'l1', acao: 'Status alterado para "Em andamento"', por: 'Analista João', em: '14/06/2025 09:34' },
    { id: 'l2', acao: 'Grupo responsavel alterado para "N2 Redes"', por: 'Analista João', em: '14/06/2025 09:33' }
  ]);

  const form = useForm<SolicitacaoFormData>({
    resolver: zodResolver(requisicaoSchema),
    defaultValues: {
      titulo: '',
      tipo: 'requisicao',
      urgencia: 'media',
      impacto: 'medio',
      prioridade: 'media',
      status: 'aberta',
      canal_origem: 'portal',
    },
  });

  // Use the form logic hook
  useEditRequisicaoFormLogic({ form, requisicao });

  // Set anexos if they exist
  React.useEffect(() => {
    if (requisicao.anexos && Array.isArray(requisicao.anexos)) {
      const anexosUrls = requisicao.anexos.map((anexo) => anexo.url || anexo).filter(Boolean);
      setAnexos(anexosUrls);
    }
  }, [requisicao]);

  const onSubmit = async (data: SolicitacaoFormData) => {
    try {
      // Adicionar anexos aos dados do formulário
      const dataWithAnexos = {
        ...data,
        anexos: anexos.length > 0 ? anexos.map(url => ({ url, type: 'file' })) : undefined,
      };

      await updateRequisicao.mutateAsync({
        id: requisicao.id,
        data: dataWithAnexos,
      });
      form.reset();
      setAnexos([]);
      onClose();
    } catch (error) {
      console.error('Error updating requisição:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    setAnexos([]);
    onClose();
  };

  // Chat envia mensagem: salva, bloqueia input até novo submit de outro autor
  const enviarMensagem = (autor: 'analista' | 'cliente') => {
    if (!mensagem.trim()) return;
    // setChatMsgs(msgs => [
    //   ...msgs, 
    //   { id: Math.random().toString(36).substring(2), autor, texto: mensagem.trim(), criadoEm: new Date().toLocaleString() }
    // ]);
    setMensagem('');
    // Simular que depois de 2s o outro lado libera para nova mensagem
    // setTimeout(() => setMensagemReadOnly(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex w-full items-center justify-between mb-4 px-4">
              <DialogTitle className="text-center md:text-left flex-1 text-lg font-semibold">
                Editar Requisição - {requisicao.numero}
              </DialogTitle>
              <div className="min-w-[180px] flex justify-end">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="mb-0 w-full">
                        <FormLabel className="sr-only">Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={updateRequisicao.isPending}
                          >
                            <SelectTrigger className="w-full min-w-[130px] md:min-w-[180px] max-w-xs">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aberta">Aberta</SelectItem>
                              <SelectItem value="em_andamento">Em andamento</SelectItem>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="resolvida">Resolvida</SelectItem>
                              <SelectItem value="fechada">Fechada</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </div>
            </div>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="w-full justify-center mb-2">
                <TabsTrigger value="form" className="flex-1">
                  Formulário
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex-1">
                  Logs de Alteração
                </TabsTrigger>
              </TabsList>
              <TabsContent value="form">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <EditRequisicaoReadOnlyFields form={form} />
                    <SolicitacaoFormFields
                      form={form}
                      excludeFields={[
                        "titulo",
                        "descricao",
                        "data_limite_resposta",
                        "data_limite_resolucao",
                        "status",
                      ]}
                    />
                    <EditRequisicaoDateFields form={form} />
                    <FileUpload
                      onFilesChange={setAnexos}
                      maxFiles={5}
                      acceptedFileTypes="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
                      maxFileSize={10}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={updateRequisicao.isPending}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={updateRequisicao.isPending}>
                        {updateRequisicao.isPending
                          ? "Atualizando..."
                          : "Atualizar Requisição"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="chat">
                <RequisicaoChat requisicao={requisicao} />
              </TabsContent>
              <TabsContent value="logs">
                <RequisicaoLogs requisicao={requisicao} />
              </TabsContent>
            </Tabs>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
