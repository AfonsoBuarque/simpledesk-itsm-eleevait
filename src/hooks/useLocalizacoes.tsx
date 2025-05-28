
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { LocalizacaoFormData, LocalizacaoFromDB, Localizacao } from '@/types/localizacao';

export const useLocalizacoes = () => {
  const queryClient = useQueryClient();

  const { data: localizacoes = [], isLoading, error } = useQuery({
    queryKey: ['localizacoes'],
    queryFn: async (): Promise<Localizacao[]> => {
      console.log('Fetching localizacoes...');
      
      const { data, error } = await supabase
        .from('localizacoes')
        .select(`
          *,
          parent_localizacao:parent_id(id, nome),
          users(id, name),
          clients(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching localizacoes:', error);
        throw error;
      }

      console.log('Fetched localizacoes:', data);

      return (data as LocalizacaoFromDB[]).map(item => ({
        id: item.id,
        nome: item.nome,
        tipo: item.tipo,
        parent_id: item.parent_id,
        coordenadas: item.coordenadas,
        user_id: item.user_id,
        client_id: item.client_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        parent: item.parent_localizacao ? {
          id: item.parent_localizacao.id,
          nome: item.parent_localizacao.nome
        } : undefined,
        user: item.users ? {
          id: item.users.id,
          name: item.users.name
        } : undefined,
        client: item.clients ? {
          id: item.clients.id,
          name: item.clients.name
        } : undefined
      }));
    },
  });

  const createLocalizacao = useMutation({
    mutationFn: async (newLocalizacao: LocalizacaoFormData) => {
      console.log('Creating localizacao:', newLocalizacao);
      
      const { data, error } = await supabase
        .from('localizacoes')
        .insert([newLocalizacao])
        .select()
        .single();

      if (error) {
        console.error('Error creating localizacao:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizacoes'] });
      toast({
        title: "Sucesso",
        description: "Localização criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating localizacao:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar localização. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateLocalizacao = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LocalizacaoFormData> }) => {
      console.log('Updating localizacao:', { id, updates });
      
      const { data, error } = await supabase
        .from('localizacoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating localizacao:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizacoes'] });
      toast({
        title: "Sucesso",
        description: "Localização atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating localizacao:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar localização. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteLocalizacao = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting localizacao:', id);
      
      const { error } = await supabase
        .from('localizacoes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting localizacao:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizacoes'] });
      toast({
        title: "Sucesso",
        description: "Localização excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting localizacao:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir localização. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    localizacoes,
    isLoading,
    error,
    createLocalizacao,
    updateLocalizacao,
    deleteLocalizacao,
  };
};
