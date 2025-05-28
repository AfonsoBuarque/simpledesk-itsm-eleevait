
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Categoria, CategoriaFormData } from '@/types/categoria';
import { useToast } from '@/hooks/use-toast';

export const useCategorias = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: categorias = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      console.log('Fetching categorias...');
      const { data, error } = await supabase
        .from('categorias_servico')
        .select(`
          *,
          categoria_pai:categorias_servico!categoria_pai_id(nome),
          cliente:clients(name),
          grupo:groups(name),
          sla:slas(nome)
        `)
        .order('ordem_exibicao', { ascending: true });

      if (error) {
        console.error('Error fetching categorias:', error);
        throw error;
      }

      console.log('Categorias fetched:', data);
      
      // Transform the data to match our Categoria interface
      const transformedData = (data || []).map(item => ({
        ...item,
        usuario_responsavel: null // We'll handle this separately if needed
      })) as Categoria[];

      return transformedData;
    },
  });

  const createCategoria = useMutation({
    mutationFn: async (categoriaData: CategoriaFormData) => {
      console.log('Creating categoria:', categoriaData);
      const { data, error } = await supabase
        .from('categorias_servico')
        .insert([categoriaData])
        .select()
        .single();

      if (error) {
        console.error('Error creating categoria:', error);
        throw error;
      }

      console.log('Categoria created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateCategoria = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CategoriaFormData> }) => {
      console.log('Updating categoria:', id, data);
      const { data: updatedData, error } = await supabase
        .from('categorias_servico')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating categoria:', error);
        throw error;
      }

      console.log('Categoria updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoria = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting categoria:', id);
      const { error } = await supabase
        .from('categorias_servico')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting categoria:', error);
        throw error;
      }

      console.log('Categoria deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: "Sucesso",
        description: "Categoria removida com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    categorias,
    isLoading,
    error,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
};
