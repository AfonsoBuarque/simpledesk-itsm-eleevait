
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
import { useSLAs } from '@/hooks/useSLAs';
import { SLA, SLAFormData } from '@/types/sla';
import SLAFormFields from './SLAFormFields';

const slaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  tipo_aplicacao: z.enum(['categoria', 'grupo', 'urgencia', 'cliente', 'global']),
  grupo_id: z.string().optional(),
  client_id: z.string().optional(),
  prioridade: z.string().optional(),
  tempo_resposta_min: z.number().min(1, 'Tempo de resposta deve ser maior que 0'),
  tempo_resolucao_min: z.number().min(1, 'Tempo de resolução deve ser maior que 0'),
  ativo: z.boolean(),
  observacoes: z.string().optional(),
});

interface EditSLADialogProps {
  sla: SLA;
  isOpen: boolean;
  onClose: () => void;
}

export const EditSLADialog = ({ sla, isOpen, onClose }: EditSLADialogProps) => {
  const { updateSLA } = useSLAs();

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

  useEffect(() => {
    if (sla) {
      form.reset({
        nome: sla.nome,
        descricao: sla.descricao || '',
        tipo_aplicacao: sla.tipo_aplicacao,
        grupo_id: sla.grupo_id || '',
        client_id: sla.client_id || '',
        prioridade: sla.prioridade || '',
        tempo_resposta_min: sla.tempo_resposta_min,
        tempo_resolucao_min: sla.tempo_resolucao_min,
        ativo: sla.ativo,
        observacoes: sla.observacoes || '',
      });
    }
  }, [sla, form]);

  const onSubmit = async (data: SLAFormData) => {
    try {
      await updateSLA.mutateAsync({ id: sla.id, data });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar SLA:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar SLA</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SLAFormFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateSLA.isPending}>
                {updateSLA.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
