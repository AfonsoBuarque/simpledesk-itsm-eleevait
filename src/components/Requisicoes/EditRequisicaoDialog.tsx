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
  cliente_id: z.string().optional(),
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

export const EditRequisicaoDialog = ({ requisicao, isOpen, onClose }: EditRequisicaoDialogProps) => {
  const { updateRequisicao } = useRequisicoes();
  const [anexos, setAnexos] = useState<string[]>([]);

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
      const anexosUrls = requisicao.anexos.map(anexo => anexo.url || anexo).filter(Boolean);
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Requisição - {requisicao.numero}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EditRequisicaoReadOnlyFields form={form} />
            
            <SolicitacaoFormFields 
              form={form} 
              excludeFields={['titulo', 'descricao', 'data_limite_resposta', 'data_limite_resolucao', 'status']}
            />

            <EditRequisicaoDateFields form={form} />
            
            <FileUpload
              onFilesChange={setAnexos}
              maxFiles={5}
              acceptedFileTypes="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
              maxFileSize={10}
            />

            {/* Campo Status (editável) */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={updateRequisicao.isPending}
                    >
                      <SelectTrigger>
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateRequisicao.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateRequisicao.isPending}
              >
                {updateRequisicao.isPending ? 'Atualizando...' : 'Atualizar Requisição'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
