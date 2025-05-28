
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
import { FornecedorFormFields } from './FornecedorFormFields';
import { useFornecedores } from '@/hooks/useFornecedores';
import type { FornecedorFormData } from '@/types/fornecedor';

const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  contato_responsavel: z.string().optional(),
  telefone_contato: z.string().optional(),
  email_contato: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.string().optional(),
  site: z.string().optional(),
  observacoes: z.string().optional(),
});

export const NewFornecedorDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { createFornecedor } = useFornecedores();

  const form = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: '',
      cnpj: '',
      contato_responsavel: '',
      telefone_contato: '',
      email_contato: '',
      endereco: '',
      site: '',
      observacoes: '',
    },
  });

  const onSubmit = async (data: FornecedorFormData) => {
    console.log('Submitting new fornecedor:', data);
    
    // Convert empty strings to undefined for optional fields
    const cleanedData = {
      ...data,
      cnpj: data.cnpj === '' ? undefined : data.cnpj,
      contato_responsavel: data.contato_responsavel === '' ? undefined : data.contato_responsavel,
      telefone_contato: data.telefone_contato === '' ? undefined : data.telefone_contato,
      email_contato: data.email_contato === '' ? undefined : data.email_contato,
      endereco: data.endereco === '' ? undefined : data.endereco,
      site: data.site === '' ? undefined : data.site,
      observacoes: data.observacoes === '' ? undefined : data.observacoes,
    };

    try {
      await createFornecedor.mutateAsync(cleanedData);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating fornecedor:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Fornecedor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FornecedorFormFields control={form.control} />
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
                disabled={createFornecedor.isPending}
              >
                {createFornecedor.isPending ? 'Criando...' : 'Criar Fornecedor'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
