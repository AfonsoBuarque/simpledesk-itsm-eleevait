import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SLAMetric {
  category: string;
  target: number;
  current: number;
  total: number;
  onTime: number;
  breached: number;
}

export const useSLAPerformance = () => {
  return useQuery({
    queryKey: ['sla-performance'],
    queryFn: async (): Promise<SLAMetric[]> => {
      const metrics: SLAMetric[] = [];
      
      // Buscar solicitações (requisições)
      const { data: solicitacoes, error: solicitacoesError } = await supabase
        .from('solicitacoes')
        .select(`
          id,
          tipo,
          status,
          data_limite_resolucao,
          data_resolucao,
          data_fechamento,
          categoria:categorias_servico(nome),
          sla:slas(nome, tempo_resolucao_min)
        `)
        .not('data_limite_resolucao', 'is', null);

      if (solicitacoesError) {
        console.error('Erro ao buscar solicitações:', solicitacoesError);
      }

      // Buscar incidentes
      const { data: incidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select(`
          id,
          tipo,
          status,
          data_limite_resolucao,
          data_resolucao,
          categoria:categorias_servico(nome)
        `)
        .not('data_limite_resolucao', 'is', null);

      if (incidentesError) {
        console.error('Erro ao buscar incidentes:', incidentesError);
      }

      // Buscar mudanças
      const { data: mudancas, error: mudancasError } = await supabase
        .from('mudancas')
        .select(`
          id,
          tipo,
          status,
          data_limite_resolucao,
          data_resolucao:data_fechamento
        `)
        .not('data_limite_resolucao', 'is', null);

      if (mudancasError) {
        console.error('Erro ao buscar mudanças:', mudancasError);
      }

      // Buscar problemas
      const { data: problemas, error: problemasError } = await supabase
        .from('problemas')
        .select(`
          id,
          tipo,
          status,
          data_limite_resolucao,
          data_resolucao
        `)
        .not('data_limite_resolucao', 'is', null);

      if (problemasError) {
        console.error('Erro ao buscar problemas:', problemasError);
      }

      // Processar cada tipo de ticket
      const tiposConfig = [
        { 
          key: 'requisicao', 
          label: 'Requisições', 
          data: solicitacoes?.filter(s => s.tipo === 'requisicao' || s.tipo === 'solicitacao') || [],
          resolvedStatuses: ['resolvida', 'fechada']
        },
        { 
          key: 'incidente', 
          label: 'Incidentes', 
          data: incidentes || [],
          resolvedStatuses: ['resolvido', 'fechado']
        },
        { 
          key: 'mudanca', 
          label: 'Mudanças', 
          data: mudancas || [],
          resolvedStatuses: ['implementada', 'fechada', 'concluida']
        },
        { 
          key: 'problema', 
          label: 'Problemas', 
          data: problemas || [],
          resolvedStatuses: ['resolvido', 'fechado']
        }
      ];

      tiposConfig.forEach(config => {
        const tickets = config.data;
        const total = tickets.length;
        
        if (total === 0) {
          metrics.push({
            category: config.label,
            target: 95,
            current: 0,
            total: 0,
            onTime: 0,
            breached: 0
          });
          return;
        }

        let onTime = 0;
        let breached = 0;

        tickets.forEach(ticket => {
          const dataLimite = new Date(ticket.data_limite_resolucao);
          const agora = new Date();

          if (config.resolvedStatuses.includes(ticket.status)) {
            // Ticket resolvido - verificar se foi no prazo
            const dataResolucao = ticket.data_resolucao ? new Date(ticket.data_resolucao) : null;
            if (dataResolucao && dataResolucao <= dataLimite) {
              onTime++;
            } else {
              breached++;
            }
          } else {
            // Ticket ainda aberto - verificar se está no prazo
            if (agora <= dataLimite) {
              onTime++;
            } else {
              breached++;
            }
          }
        });

        const currentPercentage = total > 0 ? Math.round((onTime / total) * 100) : 0;

        metrics.push({
          category: config.label,
          target: 95,
          current: currentPercentage,
          total,
          onTime,
          breached
        });
      });

      // Calcular métrica geral
      const totalGeral = metrics.reduce((acc, m) => acc + m.total, 0);
      const onTimeGeral = metrics.reduce((acc, m) => acc + m.onTime, 0);
      const breachedGeral = metrics.reduce((acc, m) => acc + m.breached, 0);
      
      if (totalGeral > 0) {
        metrics.unshift({
          category: 'SLA Geral',
          target: 95,
          current: Math.round((onTimeGeral / totalGeral) * 100),
          total: totalGeral,
          onTime: onTimeGeral,
          breached: breachedGeral
        });
      }

      return metrics;
    },
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
};