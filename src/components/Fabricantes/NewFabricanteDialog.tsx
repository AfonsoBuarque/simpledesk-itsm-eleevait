
import React, { useState } from 'react';
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
import { useFabricantes } from '@/hooks/useFabricantes';
import FabricanteFormFields from './FabricanteFormFields';
import { FabricanteInsert } from '@/types/fabricante';

const fabricanteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  pais_origem: z.string().optional(),
  contato_suporte: z.string().optional(),
  client_id: z.string().optional(),
});

const NewFabricanteDialog = () => {
  const [open, setOpen] = useState(false);
  const { createFabricante } = useFabricantes();

  const form = useForm<FabricanteInsert>({
    resolver: zodResolver(fabricanteSchema),
    defaultValues: {
      nome: '',
      pais_origem: '',
      contato_suporte: '',
      client_id: '',
    },
  });

  const onSubmit = async (data: FabricanteInsert) => {
    try {
      await createFabricante.mutateAsync(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar fabricante:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fabricante
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Fabricante</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FabricanteFormFields form={form} />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createFabricante.isPending}>
                {createFabricante.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFabricanteDialog;
