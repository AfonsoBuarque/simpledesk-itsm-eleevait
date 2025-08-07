
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao } from '@/types/solicitacao';
import { useClientFilter } from './useClientFilter';

export const useSolicitacoesFetch = () => {
  const { currentClientId, isAdmin, clientLoading, applyClientFilter } = useClientFilter();
  
  const { data: solicitacoes = [], isLoading, error } = useQuery({
    queryKey: ['solicitacoes', currentClientId, isAdmin],
    queryFn: async () => {
      console.log('Fetching solicitações with client isolation...', { currentClientId, isAdmin });
      
      let query = supabase
        .from('solicitacoes')
        .select(`
          *,
          categoria:categorias_servico(nome),
          sla:slas(nome),
          solicitante:users!solicitacoes_solicitante_id_fkey(name),
          cliente:clients(name),
          grupo_responsavel:groups(name),
          atendente:users!solicitacoes_atendente_id_fkey(name)
        `);

      // Aplicar filtro de cliente usando o useClientFilter
      query = applyClientFilter(query, 'client_id');

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching solicitações:', error);
        throw error;
      }

      console.log('Solicitações fetched with security:', data?.length, 'records');
      return data as Solicitacao[];
    },
    enabled: !clientLoading, // Só executa quando o cliente já foi carregado
  });

  return {
    solicitacoes,
    isLoading,
    error,
  };
};
