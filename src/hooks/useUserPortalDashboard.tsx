
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUserPortalDashboard = () => {
  const { user } = useAuth();

  const { data: userTickets = [], isLoading: loadingTickets } = useQuery({
    queryKey: ['user-portal-tickets', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for fetching tickets');
        return [];
      }
      
      console.log('Fetching tickets for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('solicitacoes')
          .select(`
            *,
            categoria:categorias_servico(nome),
            sla:slas(nome),
            cliente:clients(name),
            grupo_responsavel:groups(name),
            atendente:users!solicitacoes_atendente_id_fkey(name)
          `)
          .eq('solicitante_id', user.id)
          .order('criado_em', { ascending: false });

        if (error) {
          console.error('Error fetching user tickets:', error);
          throw error;
        }

        console.log('User tickets fetched successfully:', data?.length || 0, 'tickets');
        console.log('Tickets data:', data);
        return data || [];
      } catch (error) {
        console.error('Exception while fetching tickets:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calcular métricas
  const stats = {
    total: userTickets.length,
    abertas: userTickets.filter(t => t.status === 'aberta').length,
    emAndamento: userTickets.filter(t => t.status === 'em_andamento').length,
    resolvidas: userTickets.filter(t => t.status === 'resolvida').length,
    fechadas: userTickets.filter(t => t.status === 'fechada').length,
  };

  // Dados para gráficos
  const statusData = [
    { name: 'Abertas', value: stats.abertas, color: '#3b82f6' },
    { name: 'Em Andamento', value: stats.emAndamento, color: '#f59e0b' },
    { name: 'Resolvidas', value: stats.resolvidas, color: '#10b981' },
    { name: 'Fechadas', value: stats.fechadas, color: '#6b7280' },
  ];

  const urgenciaData = [
    { 
      name: 'Baixa', 
      value: userTickets.filter(t => t.urgencia === 'baixa').length,
      color: '#10b981'
    },
    { 
      name: 'Média', 
      value: userTickets.filter(t => t.urgencia === 'media').length,
      color: '#f59e0b'
    },
    { 
      name: 'Alta', 
      value: userTickets.filter(t => t.urgencia === 'alta').length,
      color: '#ef4444'
    },
  ];

  // Tickets recentes (últimos 30 dias)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentTickets = userTickets.filter(ticket => 
    new Date(ticket.criado_em) >= thirtyDaysAgo
  );

  // Dados mensais para gráfico de linha
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
    
    const monthTickets = userTickets.filter(ticket => {
      const ticketDate = new Date(ticket.criado_em);
      return ticketDate.getMonth() === date.getMonth() && 
             ticketDate.getFullYear() === date.getFullYear();
    });
    
    monthlyData.push({
      month: monthName,
      total: monthTickets.length,
      resolvidas: monthTickets.filter(t => t.status === 'resolvida' || t.status === 'fechada').length,
    });
  }

  return {
    userTickets,
    recentTickets,
    stats,
    statusData,
    urgenciaData,
    monthlyData,
    isLoading: loadingTickets,
  };
};
