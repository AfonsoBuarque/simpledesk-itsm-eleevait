import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao } from '@/types/solicitacao';

export const useOpenTickets = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['open-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solicitacoes')
        .select(`
          *,
          categoria:categorias_servico(nome),
          solicitante:users!solicitacoes_solicitante_id_fkey(name),
          cliente:clients(name),
          grupo_responsavel:groups(name),
          atendente:users!solicitacoes_atendente_id_fkey(name)
        `)
        .not('status', 'eq', 'fechada')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return (data || []) as Solicitacao[];
    },
    enabled,
  });
};