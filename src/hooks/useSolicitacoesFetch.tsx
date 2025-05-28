
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao } from '@/types/solicitacao';

export const useSolicitacoesFetch = () => {
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

  return {
    solicitacoes,
    isLoading,
    error,
  };
};
