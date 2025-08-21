
import React, { useState, useEffect } from 'react';
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
import { useFabricantes } from '@/hooks/useFabricantes';
import FabricanteFormFields from './FabricanteFormFields';
import { Fabricante, FabricanteInsert } from '@/types/fabricante';

const fabricanteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  pais_origem: z.string().optional(),
  contato_suporte: z.string().optional(),
  client_id: z.string().optional(),
});

interface EditFabricanteDialogProps {
  fabricante: Fabricante | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditFabricanteDialog = ({ fabricante, open, onOpenChange }: EditFabricanteDialogProps) => {
  const { updateFabricante } = useFabricantes();

  const form = useForm<FabricanteInsert>({
    resolver: zodResolver(fabricanteSchema),
    defaultValues: {
      nome: '',
      pais_origem: '',
      contato_suporte: '',
      client_id: '',
    },
  });

  useEffect(() => {
    if (fabricante) {
      form.reset({
        nome: fabricante.nome,
        pais_origem: fabricante.pais_origem || '',
        contato_suporte: fabricante.contato_suporte || '',
        client_id: fabricante.client_id || '',
      });
    }
  }, [fabricante, form]);

  const onSubmit = async (data: FabricanteInsert) => {
    if (!fabricante) return;
    
    try {
      await updateFabricante.mutateAsync({ id: fabricante.id, ...data });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar fabricante:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Fabricante</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FabricanteFormFields form={form} />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateFabricante.isPending}>
                {updateFabricante.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFabricanteDialog;
