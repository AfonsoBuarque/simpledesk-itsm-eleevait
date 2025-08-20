
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Fabricante, FabricanteInsert, FabricanteUpdate } from '@/types/fabricante';
import { useToast } from '@/hooks/use-toast';

export const useFabricantes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: fabricantes = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['fabricantes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fabricantes')
        .select(`
          *,
          clients:client_id (id, name)
        `)
        .order('nome');
      
      if (error) throw error;
      return data as Fabricante[];
    }
  });

  const createFabricante = useMutation({
    mutationFn: async (fabricante: FabricanteInsert) => {
      const { data, error } = await supabase
        .from('fabricantes')
        .insert([fabricante])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fabricantes'] });
      toast({
        title: "Sucesso",
        description: "Fabricante criado com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar fabricante: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateFabricante = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & FabricanteUpdate) => {
      const { data, error } = await supabase
        .from('fabricantes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fabricantes'] });
      toast({
        title: "Sucesso",
        description: "Fabricante atualizado com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar fabricante: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteFabricante = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fabricantes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fabricantes'] });
      toast({
        title: "Sucesso",
        description: "Fabricante excluído com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir fabricante: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    fabricantes,
    isLoading,
    error,
    createFabricante,
    updateFabricante,
    deleteFabricante
  };
};
