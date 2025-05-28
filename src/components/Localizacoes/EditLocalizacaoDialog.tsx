
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
import { LocalizacaoFormFields } from './LocalizacaoFormFields';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import type { Localizacao, LocalizacaoFormData } from '@/types/localizacao';

const localizacaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.string().optional(),
  parent_id: z.string().optional(),
  coordenadas: z.string().optional(),
  user_id: z.string().optional(),
  client_id: z.string().optional(),
});

interface EditLocalizacaoDialogProps {
  localizacao: Localizacao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditLocalizacaoDialog = ({ 
  localizacao, 
  open, 
  onOpenChange 
}: EditLocalizacaoDialogProps) => {
  const { updateLocalizacao } = useLocalizacoes();

  const form = useForm<LocalizacaoFormData>({
    resolver: zodResolver(localizacaoSchema),
    defaultValues: {
      nome: '',
      tipo: '',
      parent_id: '',
      coordenadas: '',
      user_id: '',
      client_id: '',
    },
  });

  React.useEffect(() => {
    if (localizacao) {
      form.reset({
        nome: localizacao.nome,
        tipo: localizacao.tipo || '',
        parent_id: localizacao.parent_id || '',
        coordenadas: localizacao.coordenadas || '',
        user_id: localizacao.user_id || '',
        client_id: localizacao.client_id || '',
      });
    }
  }, [localizacao, form]);

  const onSubmit = async (data: LocalizacaoFormData) => {
    if (!localizacao) return;

    console.log('Updating localizacao:', { id: localizacao.id, data });
    
    // Convert empty strings to null for optional fields
    const cleanedData = {
      ...data,
      tipo: data.tipo === '' ? null : data.tipo,
      parent_id: data.parent_id === '' || data.parent_id === 'none' ? null : data.parent_id,
      coordenadas: data.coordenadas === '' ? null : data.coordenadas,
      user_id: data.user_id === '' || data.user_id === 'none' ? null : data.user_id,
      client_id: data.client_id === '' || data.client_id === 'none' ? null : data.client_id,
    };

    try {
      await updateLocalizacao.mutateAsync({
        id: localizacao.id,
        updates: cleanedData,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating localizacao:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Localização</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LocalizacaoFormFields control={form.control} />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={updateLocalizacao.isPending}
              >
                {updateLocalizacao.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
