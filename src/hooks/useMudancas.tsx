import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Mudanca } from '@/types/mudanca';

export const useMudancas = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mudancas = [], isLoading, error } = useQuery({
    queryKey: ['mudancas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mudancas' as any)
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return (data as any[]) || [];
    },
  });

  const createMudanca = useMutation({
    mutationFn: async (mudanca: Partial<Mudanca>) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('mudancas' as any)
        .insert({
          ...mudanca,
          criado_por: user.user?.id,
          solicitante_id: user.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });
      toast({
        title: "Sucesso",
        description: "Mudança criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar mudança. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMudanca = useMutation({
    mutationFn: async ({ id, ...mudanca }: Partial<Mudanca> & { id: string }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('mudancas' as any)
        .update({
          ...mudanca,
          atualizado_por: user.user?.id,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });
      toast({
        title: "Sucesso",
        description: "Mudança atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mudança. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMudanca = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mudancas' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });
      toast({
        title: "Sucesso",
        description: "Mudança deletada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar mudança. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    mudancas,
    isLoading,
    error,
    createMudanca,
    updateMudanca,
    deleteMudanca,
  };
};