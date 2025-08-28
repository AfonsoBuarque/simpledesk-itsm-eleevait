import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao } from '@/types/solicitacao';

export const useResolvedTodayTickets = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['resolved-today-tickets'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
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
        .eq('status', 'resolvida')
        .gte('data_resolucao', today.toISOString())
        .order('data_resolucao', { ascending: false });

      if (error) throw error;
      return (data || []) as Solicitacao[];
    },
    enabled,
  });
};