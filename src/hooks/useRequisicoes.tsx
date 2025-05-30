
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { toast } from '@/components/ui/use-toast';

export const useRequisicoes = () => {
  const queryClient = useQueryClient();

  // Fetch requisições (tipo = 'requisicao')
  const { data: requisicoes = [], isLoading, error } = useQuery({
    queryKey: ['requisicoes'],
    queryFn: async () => {
      console.log('Fetching requisições...');
      
      try {
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
          .eq('tipo', 'requisicao')
          .order('criado_em', { ascending: false });

        if (error) {
          console.error('Error fetching requisições:', error);
          throw error;
        }

        console.log('Requisições fetched successfully:', data?.length || 0, 'items');
        return data as Solicitacao[];
      } catch (error) {
        console.error('Exception while fetching requisições:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Create requisição
  const createRequisicao = useMutation({
    mutationFn: async (data: SolicitacaoFormData) => {
      console.log('Creating requisição:', data);
      
      // Preparar dados removendo campos que não devem ser enviados e convertendo arrays
      const { anexos, ativos_envolvidos, tags, ...restData } = data;
      
      const requisicaoData = {
        ...restData,
        tipo: 'requisicao' as const,
        numero: '', // Será gerado automaticamente pelo trigger
        // Converter arrays para JSON se existirem
        ...(anexos && { anexos: JSON.stringify(anexos) }),
        ...(ativos_envolvidos && { ativos_envolvidos: JSON.stringify(ativos_envolvidos) }),
        ...(tags && { tags: JSON.stringify(tags) }),
      };

      const { data: result, error } = await supabase
        .from('solicitacoes')
        .insert(requisicaoData)
        .select()
        .single();

      if (error) {
        console.error('Error creating requisição:', error);
        throw error;
      }

      console.log('Requisição created successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      toast({
        title: 'Sucesso',
        description: 'Requisição criada com sucesso!',
      });
    },
    onError: (error: any) => {
      console.error('Error creating requisição:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar requisição: ' + (error.message || 'Erro desconhecido'),
        variant: 'destructive',
      });
    },
  });

  // Update requisição
  const updateRequisicao = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Updating requisição:', id, data);
      
      // Preparar dados para atualização, convertendo arrays para JSON
      const { anexos, ativos_envolvidos, tags, ...restData } = data;
      
      const updateData = {
        ...restData,
        // Converter arrays para JSON apenas se estiverem presentes
        ...(anexos !== undefined && { anexos: anexos ? JSON.stringify(anexos) : null }),
        ...(ativos_envolvidos !== undefined && { ativos_envolvidos: ativos_envolvidos ? JSON.stringify(ativos_envolvidos) : null }),
        ...(tags !== undefined && { tags: tags ? JSON.stringify(tags) : null }),
      };

      const { data: result, error } = await supabase
        .from('solicitacoes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating requisição:', error);
        throw error;
      }

      console.log('Requisição updated successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      toast({
        title: 'Sucesso',
        description: 'Requisição atualizada com sucesso!',
      });
    },
    onError: (error: any) => {
      console.error('Error updating requisição:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar requisição: ' + (error.message || 'Erro desconhecido'),
        variant: 'destructive',
      });
    },
  });

  // Delete requisição
  const deleteRequisicao = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting requisição:', id);
      
      const { error } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting requisição:', error);
        throw error;
      }

      console.log('Requisição deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      toast({
        title: 'Sucesso',
        description: 'Requisição excluída com sucesso!',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting requisição:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir requisição: ' + (error.message || 'Erro desconhecido'),
        variant: 'destructive',
      });
    },
  });

  return {
    requisicoes,
    isLoading,
    error,
    createRequisicao,
    updateRequisicao,
    deleteRequisicao,
  };
};
