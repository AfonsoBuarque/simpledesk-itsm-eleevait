
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
import { useCategorias } from '@/hooks/useCategorias';
import { Categoria, CategoriaFormData } from '@/types/categoria';
import CategoriaFormFields from './CategoriaFormFields';

const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string().optional(),
  tipo: z.enum(['incidente', 'solicitacao', 'problema', 'requisicao', 'mudanca']),
  categoria_pai_id: z.string().optional(),
  ordem_exibicao: z.number().min(0, 'Ordem deve ser maior ou igual a 0'),
  ativo: z.boolean(),
  client_id: z.string().optional(),
  grupo_id: z.string().optional(),
  sla_id: z.string().optional(),
  usuario_responsavel_id: z.string().optional(),
});

interface EditCategoriaDialogProps {
  categoria: Categoria;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCategoriaDialog = ({ categoria, isOpen, onClose }: EditCategoriaDialogProps) => {
  const { updateCategoria } = useCategorias();

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      tipo: 'incidente',
      ordem_exibicao: 0,
      ativo: true,
      categoria_pai_id: 'none',
      client_id: 'none',
      grupo_id: 'none',
      sla_id: 'none',
      usuario_responsavel_id: 'none',
    },
  });

  useEffect(() => {
    if (categoria) {
      form.reset({
        nome: categoria.nome,
        descricao: categoria.descricao || '',
        tipo: categoria.tipo,
        categoria_pai_id: categoria.categoria_pai_id || 'none',
        ordem_exibicao: categoria.ordem_exibicao,
        ativo: categoria.ativo,
        client_id: categoria.client_id || 'none',
        grupo_id: categoria.grupo_id || 'none',
        sla_id: categoria.sla_id || 'none',
        usuario_responsavel_id: categoria.usuario_responsavel_id || 'none',
      });
    }
  }, [categoria, form]);

  const onSubmit = async (data: CategoriaFormData) => {
    try {
      // Convert "none" values to undefined for the API
      const cleanData: Partial<CategoriaFormData> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== 'none' && value !== '' && value !== null) {
          (cleanData as any)[key] = value;
        }
      });

      await updateCategoria.mutateAsync({ 
        id: categoria.id, 
        data: cleanData
      });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CategoriaFormFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateCategoria.isPending}>
                {updateCategoria.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
