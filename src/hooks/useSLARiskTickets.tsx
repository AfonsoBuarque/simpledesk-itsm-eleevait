import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao } from '@/types/solicitacao';

export const useSLARiskTickets = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['sla-risk-tickets'],
    queryFn: async () => {
      const now = new Date();
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
        .not('status', 'in', '("resolvida","fechada")')
        .not('data_limite_resolucao', 'is', null)
        .lt('data_limite_resolucao', now.toISOString())
        .order('data_limite_resolucao', { ascending: true });

      if (error) throw error;
      return (data || []) as Solicitacao[];
    },
    enabled,
  });
};