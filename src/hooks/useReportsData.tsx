import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface TicketStatusData {
  name: string;
  value: number;
  color: string;
}

interface TicketTypeData {
  name: string;
  total: number;
  incidents: number;
  requests: number;
  problems: number;
  changes: number;
}

interface MonthlyTicketData {
  date: string;
  incidents: number;
  requests: number;
  problems: number;
  changes: number;
  total: number;
}

interface TicketMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  averageResolutionTime: number;
}

export const useReportsData = (selectedMonth: Date) => {
  const [statusData, setStatusData] = useState<TicketStatusData[]>([]);
  const [typeData, setTypeData] = useState<TicketTypeData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTicketData[]>([]);
  const [metrics, setMetrics] = useState<TicketMetrics>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    criticalTickets: 0,
    averageResolutionTime: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);
      
      // Buscar dados de incidentes
      const { data: incidents } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('tipo', 'incidente')
        .gte('criado_em', startDate.toISOString())
        .lte('criado_em', endDate.toISOString());

      // Buscar dados de requisições
      const { data: requests } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('tipo', 'requisicao')
        .gte('criado_em', startDate.toISOString())
        .lte('criado_em', endDate.toISOString());

      // Buscar dados de problemas
      const { data: problems } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('tipo', 'problema')
        .gte('criado_em', startDate.toISOString())
        .lte('criado_em', endDate.toISOString());

      // Buscar dados de mudanças
      const { data: changes } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('tipo', 'mudanca')
        .gte('criado_em', startDate.toISOString())
        .lte('criado_em', endDate.toISOString());

      const allTickets = [
        ...(incidents || []),
        ...(requests || []),
        ...(problems || []),
        ...(changes || [])
      ];

      // Processar dados de status
      const statusCounts = allTickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusColors = {
        'aberto': '#ef4444',
        'em_andamento': '#f97316',
        'aguardando': '#eab308',
        'resolvido': '#22c55e',
        'fechado': '#6b7280',
        'cancelado': '#ef4444'
      };

      const processedStatusData: TicketStatusData[] = Object.entries(statusCounts).map(([status, count]) => ({
        name: getStatusLabel(status),
        value: count,
        color: statusColors[status as keyof typeof statusColors] || '#6b7280'
      }));

      setStatusData(processedStatusData);

      // Processar dados por tipo
      const typeStats = [
        {
          name: 'Incidentes',
          total: incidents?.length || 0,
          incidents: incidents?.length || 0,
          requests: 0,
          problems: 0,
          changes: 0
        },
        {
          name: 'Requisições',
          total: requests?.length || 0,
          incidents: 0,
          requests: requests?.length || 0,
          problems: 0,
          changes: 0
        },
        {
          name: 'Problemas',
          total: problems?.length || 0,
          incidents: 0,
          requests: 0,
          problems: problems?.length || 0,
          changes: 0
        },
        {
          name: 'Mudanças',
          total: changes?.length || 0,
          incidents: 0,
          requests: 0,
          problems: 0,
          changes: changes?.length || 0
        }
      ];

      setTypeData(typeStats);

      // Processar dados mensais (por dias do mês)
      const dailyData: MonthlyTicketData[] = [];
      const daysInMonth = endDate.getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
        const dayString = format(dayDate, 'yyyy-MM-dd');
        
        const dayTickets = allTickets.filter(ticket => 
          format(new Date(ticket.criado_em), 'yyyy-MM-dd') === dayString
        );

        dailyData.push({
          date: format(dayDate, 'dd/MM'),
          incidents: dayTickets.filter(t => t.tipo === 'incidente').length,
          requests: dayTickets.filter(t => t.tipo === 'requisicao').length,
          problems: dayTickets.filter(t => t.tipo === 'problema').length,
          changes: dayTickets.filter(t => t.tipo === 'mudanca').length,
          total: dayTickets.length
        });
      }

      setMonthlyData(dailyData);

      // Calcular métricas
      const openTickets = allTickets.filter(t => ['aberto', 'em_andamento', 'aguardando'].includes(t.status)).length;
      const resolvedTickets = allTickets.filter(t => ['resolvido', 'fechado'].includes(t.status)).length;
      const criticalTickets = allTickets.filter(t => t.prioridade === 'critica').length;

      setMetrics({
        totalTickets: allTickets.length,
        openTickets,
        resolvedTickets,
        criticalTickets,
        averageResolutionTime: 0 // Calcular tempo médio de resolução se necessário
      });

    } catch (error) {
      console.error('Erro ao buscar dados dos relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'aberto': 'Aberto',
      'em_andamento': 'Em Andamento',
      'aguardando': 'Aguardando',
      'resolvido': 'Resolvido',
      'fechado': 'Fechado',
      'cancelado': 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  useEffect(() => {
    fetchReportsData();
  }, [selectedMonth]);

  return {
    statusData,
    typeData,
    monthlyData,
    metrics,
    loading,
    refetch: fetchReportsData
  };
};