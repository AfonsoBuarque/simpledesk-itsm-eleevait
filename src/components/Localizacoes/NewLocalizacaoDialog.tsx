
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { LocalizacaoFormFields } from './LocalizacaoFormFields';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import type { LocalizacaoFormData } from '@/types/localizacao';

const localizacaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.string().optional(),
  parent_id: z.string().optional(),
  coordenadas: z.string().optional(),
  user_id: z.string().optional(),
  client_id: z.string().optional(),
});

export const NewLocalizacaoDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { createLocalizacao } = useLocalizacoes();

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

  const onSubmit = async (data: LocalizacaoFormData) => {
    console.log('Submitting new localizacao:', data);
    
    // Convert empty strings to undefined/null for optional fields
    const cleanedData = {
      ...data,
      tipo: data.tipo === '' ? null : data.tipo,
      parent_id: data.parent_id === '' || data.parent_id === 'none' ? null : data.parent_id,
      coordenadas: data.coordenadas === '' ? null : data.coordenadas,
      user_id: data.user_id === '' || data.user_id === 'none' ? null : data.user_id,
      client_id: data.client_id === '' || data.client_id === 'none' ? null : data.client_id,
    };

    try {
      await createLocalizacao.mutateAsync(cleanedData);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating localizacao:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Localização
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Localização</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LocalizacaoFormFields control={form.control} />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createLocalizacao.isPending}
              >
                {createLocalizacao.isPending ? 'Criando...' : 'Criar Localização'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
