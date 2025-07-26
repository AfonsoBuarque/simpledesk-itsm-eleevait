
import React from 'react';
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
import { SolicitacaoFormData } from '@/types/solicitacao';
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

interface NewSolicitacaoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSolicitacaoDialog = ({ isOpen, onClose }: NewSolicitacaoDialogProps) => {
  const { createSolicitacao } = useSolicitacoes();

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

  const onSubmit = async (data: SolicitacaoFormData) => {
    try {
      await createSolicitacao.mutateAsync(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating solicitação:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SolicitacaoFormFields form={form} />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createSolicitacao.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createSolicitacao.isPending}
              >
                {createSolicitacao.isPending ? 'Criando...' : 'Criar Solicitação'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
