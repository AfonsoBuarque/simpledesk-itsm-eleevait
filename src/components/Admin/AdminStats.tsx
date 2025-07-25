import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building, Ticket, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [clientsResult, usersResult, ticketsResult, incidentsResult] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('solicitacoes').select('id', { count: 'exact' }),
        supabase.from('incidentes').select('id', { count: 'exact' })
      ]);

      return {
        totalClients: clientsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalTickets: ticketsResult.count || 0,
        totalIncidents: incidentsResult.count || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-24 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats?.totalClients || 0,
      description: 'Clientes ativos no sistema',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Total de Usuários',
      value: stats?.totalUsers || 0,
      description: 'Usuários em todos os clientes',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Tickets Abertos',
      value: stats?.totalTickets || 0,
      description: 'Solicitações ativas',
      icon: Ticket,
      color: 'text-yellow-600'
    },
    {
      title: 'Incidentes',
      value: stats?.totalIncidents || 0,
      description: 'Incidentes reportados',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};