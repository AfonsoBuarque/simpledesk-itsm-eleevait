
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPortalRequisicoes } from '@/hooks/useUserPortalRequisicoes';
import { novaRequisicaoSchema, NovaRequisicaoFormData } from './schemas/novaRequisicaoSchema';
import { NovaRequisicaoFormFields } from './NovaRequisicaoFormFields';
import { NovaRequisicaoInfo } from './NovaRequisicaoInfo';
import { NovaRequisicaoActions } from './NovaRequisicaoActions';

interface NovaRequisicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaRequisicaoModal = ({ isOpen, onClose }: NovaRequisicaoModalProps) => {
  const { createRequisicao } = useUserPortalRequisicoes();

  const form = useForm<NovaRequisicaoFormData>({
    resolver: zodResolver(novaRequisicaoSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      urgencia: 'media',
    },
  });

  const onSubmit = async (data: NovaRequisicaoFormData) => {
    try {
      // Ensure data matches the expected type by explicitly structuring it
      const formData = {
        titulo: data.titulo,
        descricao: data.descricao || '',
        categoria_id: data.categoria_id || undefined,
        urgencia: data.urgencia,
      };
      
      await createRequisicao.mutateAsync(formData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Nova Requisição de Serviço
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <NovaRequisicaoFormFields form={form} />
                <NovaRequisicaoInfo />
                <NovaRequisicaoActions 
                  isLoading={createRequisicao.isPending}
                  onCancel={handleClose}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
