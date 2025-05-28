
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
import { useCategorias } from '@/hooks/useCategorias';
import { CategoriaFormData } from '@/types/categoria';
import CategoriaFormFields from './CategoriaFormFields';

const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string().optional(),
  tipo: z.enum(['incidente', 'solicitacao', 'problema', 'requisicao', 'mudanca']),
  categoria_pai_id: z.string().optional(),
  ordem_exibicao: z.number().min(0, 'Ordem deve ser maior ou igual a 0'),
  ativo: z.boolean(),
  cliente_id: z.string().optional(),
  grupo_id: z.string().optional(),
  sla_id: z.string().optional(),
  usuario_responsavel_id: z.string().optional(),
});

interface NewCategoriaDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCategoriaDialog = ({ isOpen, onClose }: NewCategoriaDialogProps) => {
  const { createCategoria } = useCategorias();

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      tipo: 'incidente',
      ordem_exibicao: 0,
      ativo: true,
      categoria_pai_id: '',
      cliente_id: '',
      grupo_id: '',
      sla_id: '',
      usuario_responsavel_id: '',
    },
  });

  const onSubmit = async (data: CategoriaFormData) => {
    try {
      // Remove empty string values and convert them to undefined
      const cleanData: Partial<CategoriaFormData> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          (cleanData as any)[key] = value;
        }
      });

      await createCategoria.mutateAsync(cleanData as CategoriaFormData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CategoriaFormFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createCategoria.isPending}>
                {createCategoria.isPending ? 'Criando...' : 'Criar Categoria'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
