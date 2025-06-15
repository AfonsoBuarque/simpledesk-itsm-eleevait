import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao } from '@/types/solicitacao';

export const useDashboardData = () => {
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['dashboard-tickets'],
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
        .order('criado_em', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as Solicitacao[];
    },
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Buscar contagens de tickets por status
      const { data: statusCount, error: statusError } = await supabase
        .from('solicitacoes')
        .select('status')
        .not('status', 'eq', 'fechada');

      if (statusError) throw statusError;

      // Buscar tickets resolvidos hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: resolvedToday, error: resolvedError } = await supabase
        .from('solicitacoes')
        .select('id')
        .eq('status', 'resolvida')
        .gte('data_resolucao', today.toISOString());

      if (resolvedError) throw resolvedError;

      // Buscar tickets em risco de SLA
      const now = new Date();
      const { data: slaRisk, error: slaError } = await supabase
        .from('solicitacoes')
        .select('id, data_limite_resolucao')
        .not('status', 'in', '("resolvida","fechada")')
        .not('data_limite_resolucao', 'is', null)
        .lt('data_limite_resolucao', now.toISOString());

      if (slaError) throw slaError;

      // Buscar problemas críticos
      const { data: criticalProblems, error: criticalError } = await supabase
        .from('solicitacoes')
        .select('id')
        .eq('tipo', 'problema')
        .eq('prioridade', 'critica')
        .not('status', 'in', '("resolvida","fechada")');

      if (criticalError) throw criticalError;

      const totalOpen = statusCount?.length || 0;
      const slaAtRisk = slaRisk?.length || 0;
      const resolvedTodayCount = resolvedToday?.length || 0;
      const criticalCount = criticalProblems?.length || 0;

      return {
        totalOpen,
        slaAtRisk,
        resolvedTodayCount,
        criticalCount,
      };
    },
  });

  const { data: slaMetrics, isLoading: slaLoading } = useQuery({
    queryKey: ['dashboard-sla-metrics'],
    queryFn: async () => {
      // Buscar métricas de SLA por tipo
      const tipos = [
        { key: 'incidente', label: 'Incidentes' },
        { key: 'solicitacao', synonyms: ['solicitacao', 'requisicao'], label: 'Solicitações' },
        { key: 'mudanca', label: 'Mudanças' },
        { key: 'problema', label: 'Problemas' },
      ];
      const metrics = [];

      for (const tipoConfig of tipos) {
        // Corrigir chave de busca para Solicitações (aceitar solicitacao e requisicao)
        let tipoKeys = tipoConfig.synonyms || [tipoConfig.key];

        // LOG para debug (remover quando estiver OK)
        console.log(`Querying tickets for tipo(s): ${tipoKeys.join(', ')}`);

        const { data: total, error: totalError } = await supabase
          .from('solicitacoes')
          .select('id, data_limite_resolucao, data_resolucao, status, tipo')
          .in('tipo', tipoKeys)
          .not('data_limite_resolucao', 'is', null);

        if (totalError) {
          console.error(`Erro ao buscar tickets de tipo(s) '${tipoKeys.join(', ')}':`, totalError);
          metrics.push({
            category: tipoConfig.label,
            target: 95,
            current: 0,
            total: 0,
          });
          continue;
        }

        const totalTickets = total?.length || 0;
        if (totalTickets === 0) {
          metrics.push({
            category: tipoConfig.label,
            target: 95,
            current: 0,
            total: 0,
          });
          continue;
        }

        const onTime = total?.filter(ticket => {
          if (ticket.status === 'resolvida' && ticket.data_resolucao && ticket.data_limite_resolucao) {
            return new Date(ticket.data_resolucao) <= new Date(ticket.data_limite_resolucao);
          }
          if (ticket.status !== 'resolvida' && ticket.data_limite_resolucao) {
            return new Date() <= new Date(ticket.data_limite_resolucao);
          }
          return false;
        }).length || 0;

        const currentPercentage = totalTickets > 0 ? Math.round((onTime / totalTickets) * 100) : 0;

        console.log(
          `[${tipoConfig.label}] Tickets total:`,
          totalTickets,
          '- SLA OK:', onTime,
          '- SLA %:', currentPercentage
        );

        metrics.push({
          category: tipoConfig.label,
          target: 95,
          current: currentPercentage,
          total: totalTickets,
        });
      }

      return metrics;
    },
  });

  return {
    tickets,
    stats,
    slaMetrics,
    isLoading: ticketsLoading || statsLoading || slaLoading,
  };
};
