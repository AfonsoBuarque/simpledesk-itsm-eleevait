
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
import { useSLAs } from '@/hooks/useSLAs';
import { SLAFormData } from '@/types/sla';
import SLAFormFields from './SLAFormFields';

const slaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  tipo_aplicacao: z.enum(['categoria', 'grupo', 'urgencia', 'cliente', 'global']),
  grupo_id: z.string().optional(),
  cliente_id: z.string().optional(),
  prioridade: z.string().optional(),
  tempo_resposta_min: z.number().min(1, 'Tempo de resposta deve ser maior que 0'),
  tempo_resolucao_min: z.number().min(1, 'Tempo de resolução deve ser maior que 0'),
  ativo: z.boolean(),
  observacoes: z.string().optional(),
});

interface NewSLADialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSLADialog = ({ isOpen, onClose }: NewSLADialogProps) => {
  const { createSLA } = useSLAs();

  const form = useForm<SLAFormData>({
    resolver: zodResolver(slaSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      tipo_aplicacao: 'global',
      prioridade: '',
      tempo_resposta_min: 15,
      tempo_resolucao_min: 240,
      ativo: true,
      observacoes: '',
    },
  });

  const onSubmit = async (data: SLAFormData) => {
    try {
      await createSLA.mutateAsync(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao criar SLA:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo SLA</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SLAFormFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createSLA.isPending}>
                {createSLA.isPending ? 'Criando...' : 'Criar SLA'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
