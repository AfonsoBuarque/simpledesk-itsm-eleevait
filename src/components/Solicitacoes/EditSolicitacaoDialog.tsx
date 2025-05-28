
import React, { useEffect } from 'react';
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
import { Form } from '@/components/ui/form';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useSolicitacoes } from '@/hooks/useSolicitacoes';
import SolicitacaoFormFields from './SolicitacaoFormFields';

const solicitacaoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.enum(['incidente', 'solicitacao', 'problema', 'requisicao', 'mudanca']),
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

interface EditSolicitacaoDialogProps {
  solicitacao: Solicitacao;
  isOpen: boolean;
  onClose: () => void;
}

export const EditSolicitacaoDialog = ({ solicitacao, isOpen, onClose }: EditSolicitacaoDialogProps) => {
  const { updateSolicitacao } = useSolicitacoes();

  const form = useForm<SolicitacaoFormData>({
    resolver: zodResolver(solicitacaoSchema),
    defaultValues: {
      titulo: '',
      tipo: 'solicitacao',
      urgencia: 'media',
      impacto: 'medio',
      prioridade: 'media',
      status: 'aberta',
      canal_origem: 'portal',
    },
  });

  useEffect(() => {
    if (solicitacao) {
      form.reset({
        titulo: solicitacao.titulo,
        descricao: solicitacao.descricao || '',
        tipo: solicitacao.tipo,
        categoria_id: solicitacao.categoria_id || '',
        sla_id: solicitacao.sla_id || '',
        urgencia: solicitacao.urgencia,
        impacto: solicitacao.impacto,
        prioridade: solicitacao.prioridade,
        status: solicitacao.status,
        solicitante_id: solicitacao.solicitante_id || '',
        cliente_id: solicitacao.cliente_id || '',
        grupo_responsavel_id: solicitacao.grupo_responsavel_id || '',
        atendente_id: solicitacao.atendente_id || '',
        canal_origem: solicitacao.canal_origem,
        notas_internas: solicitacao.notas_internas || '',
      });
    }
  }, [solicitacao, form]);

  const onSubmit = async (data: SolicitacaoFormData) => {
    try {
      await updateSolicitacao.mutateAsync({
        id: solicitacao.id,
        data,
      });
      onClose();
    } catch (error) {
      console.error('Error updating solicitação:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Solicitação - {solicitacao.numero}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SolicitacaoFormFields form={form} />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateSolicitacao.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateSolicitacao.isPending}
              >
                {updateSolicitacao.isPending ? 'Atualizando...' : 'Atualizar Solicitação'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
