
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MetricsCard from './MetricsCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getSLAStatus, getStatusColor, getUrgenciaColor } from '@/utils/slaStatus';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

const DashboardOverview = () => {
  const { tickets, stats, slaMetrics, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados do dashboard...</div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    return getUrgenciaColor(priority);
  };

  return (
    <div className="space-y-10 max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-8">

      {/* Page Title */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between mb-2 md:mb-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-100 p-2 shadow border border-blue-200">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Visão Geral do Dashboard
          </h1>
        </div>
        <div className="mt-2 md:mt-0 text-sm text-gray-500 font-medium">
          Última atualização: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </div>
      </section>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricsCard
          title="Tickets Abertos"
          value={stats?.totalOpen || 0}
          icon={Ticket}
          trend={{ value: "Atual", direction: "neutral" }}
        />
        <MetricsCard
          title="SLA em Risco"
          value={stats?.slaAtRisk || 0}
          icon={Clock}
          trend={{ value: "Crítico", direction: "down" }}
          className="border-l-4 border-l-red-500"
        />
        <MetricsCard
          title="Resolvidos Hoje"
          value={stats?.resolvedTodayCount || 0}
          icon={CheckCircle}
          trend={{ value: "Hoje", direction: "up" }}
        />
        <MetricsCard
          title="Problemas Críticos"
          value={stats?.criticalCount || 0}
          icon={AlertTriangle}
          trend={{ value: "Ativo", direction: "neutral" }}
          className="border-l-4 border-l-orange-500"
        />
      </div>

      {/* Section: Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tickets */}
        <Card className="rounded-xl shadow-md hover:shadow-xl border-0 transition-shadow duration-150 bg-gradient-to-br from-white via-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600 text-lg md:text-xl font-bold">
              <Ticket className="h-6 w-6" />
              Tickets Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum ticket encontrado
                </div>
              ) : (
                tickets.slice(0, 5).map((ticket) => {
                  const slaStatus = getSLAStatus(ticket);
                  return (
                    <div 
                      key={ticket.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-white/70 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-blue-600 text-lg">{ticket.numero}</span>
                          <Badge className={`${getPriorityColor(ticket.prioridade)} capitalize shadow`}>
                            {ticket.prioridade}
                          </Badge>
                        </div>
                        <p className="text-base font-medium text-gray-700 mb-1 truncate">{ticket.titulo}</p>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">Cliente:</span>
                          <span className="text-xs font-semibold text-gray-700">
                            {ticket.cliente?.name || 'Não informado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${getStatusColor(ticket.status)} shadow-sm`}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${slaStatus.color} shadow-sm`}>
                            {slaStatus.label}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {format(new Date(ticket.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* SLA Performance */}
        <Card className="rounded-xl shadow-md hover:shadow-xl border-0 transition-shadow duration-150 bg-gradient-to-br from-white via-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 text-lg md:text-xl font-bold">
              <TrendingUp className="h-6 w-6" />
              Performance SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {slaMetrics && slaMetrics.length > 0 ? (
                slaMetrics.map((metric) => (
                  <div key={metric.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-700">{metric.category}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${metric.current >= metric.target ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.current}%
                        </span>
                        <span className="text-xs text-gray-400">({metric.total} tickets)</span>
                      </div>
                    </div>
                    <Progress 
                      value={metric.current} 
                      className={`h-2 rounded-xl shadow-inner transition-colors duration-200 ${metric.current >= metric.target ? 'bg-gradient-to-r from-green-300 via-green-200 to-green-100' : 'bg-orange-200'}`}
                    />
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Meta: {metric.target}%</span>
                      <span className={metric.current >= metric.target ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {metric.current >= metric.target ? '✓ Meta atingida' : '⚠ Abaixo da meta'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma métrica de SLA disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
