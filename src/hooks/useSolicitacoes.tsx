
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';

export const useSolicitacoes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: solicitacoes = [], isLoading, error } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: async () => {
      console.log('Fetching solicitações...');
      const { data, error } = await supabase
        .from('solicitacoes')
        .select(`
          *,
          categoria:categorias_servico(nome),
          sla:slas(nome),
          solicitante:users!solicitacoes_solicitante_id_fkey(name),
          cliente:clients(name),
          grupo_responsavel:groups(name),
          atendente:users!solicitacoes_atendente_id_fkey(name)
        `)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching solicitações:', error);
        throw error;
      }

      console.log('Solicitações fetched:', data);
      return data as Solicitacao[];
    },
  });

  const createSolicitacao = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      console.log('Creating solicitação:', formData);
      const { data, error } = await supabase
        .from('solicitacoes')
        .insert(formData)
        .select()
        .single();

      if (error) {
        console.error('Error creating solicitação:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: "Solicitação criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateSolicitacao = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Updating solicitação:', id, data);
      const { data: updatedData, error } = await supabase
        .from('solicitacoes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating solicitação:', error);
        throw error;
      }

      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: "Solicitação atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteSolicitacao = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting solicitação:', id);
      const { error } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting solicitação:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: "Solicitação excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    solicitacoes,
    isLoading,
    error,
    createSolicitacao,
    updateSolicitacao,
    deleteSolicitacao,
  };
};
