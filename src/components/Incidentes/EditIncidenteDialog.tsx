import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SolicitacaoFormData, Solicitacao } from '@/types/solicitacao';
import { useIncidentes } from '@/hooks/useIncidentes';
import { Form } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SolicitacaoFormFields from '../Solicitacoes/SolicitacaoFormFields';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { IncidenteChat } from './IncidenteChat';
import { IncidenteLogs } from './IncidenteLogs';
import { useCategorias } from '@/hooks/useCategorias';
import { useSLACalculation } from '@/hooks/useSLACalculation';
import { EditRequisicaoDateFields } from '../Requisicoes/EditRequisicaoDateFields';
import { format } from 'date-fns';

const incidenteSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.literal('incidente'),
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

interface EditIncidenteDialogProps {
  incidente: Solicitacao;
  isOpen: boolean;
  onClose: () => void;
}

const EditIncidenteDialog = ({ incidente, isOpen, onClose }: EditIncidenteDialogProps) => {
  const { updateIncidente } = useIncidentes();
  const { categorias } = useCategorias();
  const { calculateAndSetSLADeadlines } = useSLACalculation();
  const [tab, setTab] = useState('form');
  const [anexos, setAnexos] = useState<string[]>([]);

  // Filtrar categorias para mostrar apenas as do tipo 'incidente'
  const categoriasIncidente = categorias.filter(categoria => categoria.tipo === 'incidente');

  const form = useForm<SolicitacaoFormData>({
    resolver: zodResolver(incidenteSchema),
    defaultValues: {
      titulo: '',
      tipo: 'incidente',
      urgencia: 'media',
      impacto: 'medio',
      prioridade: 'media',
      status: 'aberta',
      canal_origem: 'portal',
    },
  });

  React.useEffect(() => {
    if (incidente) {
      // Função para converter a data ISO para o formato yyyy-MM-ddTHH:mm
      const toInputValue = (dateString?: string | null) => {
        if (!dateString) return '';
        try {
          // Remover frações de segundo, se existirem
          // dateString pode vir como: "2025-06-16T15:00:00+00:00"
          const d = new Date(dateString);
          return format(d, "yyyy-MM-dd'T'HH:mm");
        } catch {
          return '';
        }
      };

      form.reset({
        titulo: incidente.titulo,
        descricao: incidente.descricao || '',
        tipo: 'incidente',
        categoria_id: incidente.categoria_id || '',
        sla_id: incidente.sla_id || '',
        urgencia: incidente.urgencia,
        impacto: incidente.impacto,
        prioridade: incidente.prioridade,
        status: incidente.status,
        solicitante_id: incidente.solicitante_id || '',
        client_id: incidente.client_id || '',
        grupo_responsavel_id: incidente.grupo_responsavel_id || '',
        atendente_id: incidente.atendente_id || '',
        canal_origem: incidente.canal_origem,
        data_limite_resposta: toInputValue(incidente.data_limite_resposta),
        data_limite_resolucao: toInputValue(incidente.data_limite_resolucao),
        notas_internas: incidente.notas_internas || '',
      });
      if (incidente.anexos && Array.isArray(incidente.anexos)) {
        const anexosUrls = incidente.anexos.map((anexo) => anexo.url || anexo).filter(Boolean);
        setAnexos(anexosUrls);
      }
    }
  }, [incidente, form]);

  // Calcular SLA quando categoria ou grupo responsável mudarem - usando a mesma lógica do modal de requisição
  React.useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (name === 'categoria_id' || name === 'grupo_responsavel_id') {
        const categoriaId = value.categoria_id;
        const grupoId = value.grupo_responsavel_id;
        
        console.log('SLA calculation triggered for incidente:', { categoriaId, grupoId });
        
        if (categoriaId && grupoId) {
          try {
            const deadlines = await calculateAndSetSLADeadlines(
              categoriaId, 
              grupoId, 
              incidente.data_abertura || new Date().toISOString()
            );
            
            console.log('Incident SLA deadlines received:', deadlines);
            
            if (deadlines.data_limite_resposta) {
              const formattedResposta = deadlines.data_limite_resposta.slice(0, 16);
              form.setValue('data_limite_resposta', formattedResposta);
              console.log('Setting data_limite_resposta:', formattedResposta);
            }
            if (deadlines.data_limite_resolucao) {
              const formattedResolucao = deadlines.data_limite_resolucao.slice(0, 16);
              form.setValue('data_limite_resolucao', formattedResolucao);
              console.log('Setting data_limite_resolucao:', formattedResolucao);
            }
          } catch (error) {
            console.error('Error calculating SLA for incident:', error);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, calculateAndSetSLADeadlines, incidente.data_abertura]);

  const onSubmit = async (data: SolicitacaoFormData) => {
    try {
      // Tratar campos vazios que causam erro de UUID
      const cleanData = {
        ...data,
        categoria_id: data.categoria_id && data.categoria_id !== '' ? data.categoria_id : null,
        sla_id: data.sla_id && data.sla_id !== '' ? data.sla_id : null,
        solicitante_id: data.solicitante_id && data.solicitante_id !== '' ? data.solicitante_id : null,
        client_id: data.client_id && data.client_id !== '' ? data.client_id : null,
        grupo_responsavel_id: data.grupo_responsavel_id && data.grupo_responsavel_id !== '' ? data.grupo_responsavel_id : null,
        atendente_id: data.atendente_id && data.atendente_id !== '' ? data.atendente_id : null,
        origem_id: data.origem_id && data.origem_id !== '' ? data.origem_id : null,
        anexos: anexos.length > 0 ? anexos.map((url) => ({ url, type: 'file' })) : undefined,
      };

      await updateIncidente.mutateAsync({
        id: incidente.id,
        data: cleanData,
      });
      form.reset();
      setAnexos([]);
      onClose();
    } catch (error) {
      // erro já tratado no hook
    }
  };

  const handleClose = () => {
    form.reset();
    setAnexos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex w-full items-center justify-between mb-4 px-4">
              <DialogTitle className="text-center md:text-left flex-1 text-lg font-semibold">
                Editar Incidente - {incidente.numero}
              </DialogTitle>
              <div className="min-w-[180px] flex justify-end">
                <Form {...form}>
                  <Select
                    onValueChange={value => form.setValue('status', value as any)}
                    value={form.watch('status') || 'aberta'}
                    disabled={updateIncidente.isPending}
                  >
                    <SelectTrigger className="w-full min-w-[130px] md:min-w-[180px] max-w-xs">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberta">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="resolvida">Resolvido</SelectItem>
                      <SelectItem value="fechada">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <SolicitacaoFormFields
                      form={form}
                      excludeFields={["status", "data_limite_resposta", "data_limite_resolucao"]}
                      filteredCategorias={categoriasIncidente}
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
                        disabled={updateIncidente.isPending}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={updateIncidente.isPending}>
                        {updateIncidente.isPending
                          ? "Atualizando..."
                          : "Atualizar Incidente"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="chat">
                <IncidenteChat incidente={incidente} />
              </TabsContent>
              <TabsContent value="logs">
                <IncidenteLogs incidente={incidente} />
              </TabsContent>
            </Tabs>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditIncidenteDialog;
