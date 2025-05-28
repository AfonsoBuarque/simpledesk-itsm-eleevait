
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
import { Edit } from 'lucide-react';
import { FornecedorFormFields } from './FornecedorFormFields';
import { useFornecedores } from '@/hooks/useFornecedores';
import type { Fornecedor, FornecedorFormData } from '@/types/fornecedor';

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

interface EditFornecedorDialogProps {
  fornecedor: Fornecedor;
}

export const EditFornecedorDialog = ({ fornecedor }: EditFornecedorDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const { updateFornecedor } = useFornecedores();

  const form = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj || '',
      contato_responsavel: fornecedor.contato_responsavel || '',
      telefone_contato: fornecedor.telefone_contato || '',
      email_contato: fornecedor.email_contato || '',
      endereco: fornecedor.endereco || '',
      site: fornecedor.site || '',
      observacoes: fornecedor.observacoes || '',
    },
  });

  const onSubmit = async (data: FornecedorFormData) => {
    console.log('Updating fornecedor:', data);
    
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
      await updateFornecedor.mutateAsync({ id: fornecedor.id, updates: cleanedData });
      setOpen(false);
    } catch (error) {
      console.error('Error updating fornecedor:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
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
                disabled={updateFornecedor.isPending}
              >
                {updateFornecedor.isPending ? 'Atualizando...' : 'Atualizar Fornecedor'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
