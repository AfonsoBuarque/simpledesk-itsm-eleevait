
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
import { sanitizeInput, validateEmail, rateLimitCheck } from '@/utils/inputSanitizer';
import { toast } from 'sonner';
import type { FornecedorFormData } from '@/types/fornecedor';

const fornecedorSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine(val => val.trim().length > 0, 'Nome não pode estar vazio'),
  cnpj: z.string()
    .optional()
    .refine(val => !val || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/.test(val), 'CNPJ inválido'),
  contato_responsavel: z.string()
    .max(100, 'Nome do contato deve ter no máximo 100 caracteres')
    .optional(),
  telefone_contato: z.string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional(),
  email_contato: z.string()
    .refine(val => !val || val === '' || validateEmail(val), 'Email inválido')
    .optional(),
  endereco: z.string()
    .max(500, 'Endereço deve ter no máximo 500 caracteres')
    .optional(),
  site: z.string()
    .max(200, 'Site deve ter no máximo 200 caracteres')
    .refine(val => !val || /^https?:\/\/.+/.test(val), 'URL deve começar com http:// ou https://')
    .optional(),
  observacoes: z.string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional(),
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
    try {
      // Rate limiting check
      if (!rateLimitCheck('create_fornecedor', 10, 60000)) {
        toast.error('Muitas tentativas. Tente novamente em alguns minutos.');
        return;
      }

      console.log('Submitting new fornecedor:', data);
      
      // Sanitizar entradas
      const sanitizedData = {
        nome: sanitizeInput(data.nome),
        cnpj: data.cnpj ? sanitizeInput(data.cnpj) : undefined,
        contato_responsavel: data.contato_responsavel ? sanitizeInput(data.contato_responsavel) : undefined,
        telefone_contato: data.telefone_contato ? sanitizeInput(data.telefone_contato) : undefined,
        email_contato: data.email_contato ? sanitizeInput(data.email_contato) : undefined,
        endereco: data.endereco ? sanitizeInput(data.endereco) : undefined,
        site: data.site ? sanitizeInput(data.site) : undefined,
        observacoes: data.observacoes ? sanitizeInput(data.observacoes) : undefined,
      };

      // Validações adicionais
      if (!sanitizedData.nome || sanitizedData.nome.trim().length === 0) {
        toast.error('Nome é obrigatório');
        return;
      }

      if (sanitizedData.email_contato && !validateEmail(sanitizedData.email_contato)) {
        toast.error('Email de contato inválido');
        return;
      }

      // Convert empty strings to undefined for optional fields
      const cleanedData = {
        ...sanitizedData,
        cnpj: sanitizedData.cnpj === '' ? undefined : sanitizedData.cnpj,
        contato_responsavel: sanitizedData.contato_responsavel === '' ? undefined : sanitizedData.contato_responsavel,
        telefone_contato: sanitizedData.telefone_contato === '' ? undefined : sanitizedData.telefone_contato,
        email_contato: sanitizedData.email_contato === '' ? undefined : sanitizedData.email_contato,
        endereco: sanitizedData.endereco === '' ? undefined : sanitizedData.endereco,
        site: sanitizedData.site === '' ? undefined : sanitizedData.site,
        observacoes: sanitizedData.observacoes === '' ? undefined : sanitizedData.observacoes,
      };

      await createFornecedor.mutateAsync(cleanedData);
      form.reset();
      setOpen(false);
      toast.success('Fornecedor criado com sucesso');
    } catch (error) {
      console.error('Error creating fornecedor:', error);
      toast.error('Erro ao criar fornecedor. Tente novamente.');
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
