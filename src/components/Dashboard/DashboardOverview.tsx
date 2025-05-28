
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  TrendingUp,
  Plus
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
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Incidente
        </Button>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Nova Requisição
        </Button>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Nova Mudança
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
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
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-blue-600">{ticket.numero}</span>
                          <Badge className={getPriorityColor(ticket.prioridade)}>
                            {ticket.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ticket.titulo}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={slaStatus.color}>
                            {slaStatus.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slaMetrics && slaMetrics.length > 0 ? (
                slaMetrics.map((metric) => (
                  <div key={metric.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{metric.current}%</span>
                        <span className="text-xs text-gray-400">({metric.total} tickets)</span>
                      </div>
                    </div>
                    <Progress 
                      value={metric.current} 
                      className={`h-2 ${metric.current >= metric.target ? 'bg-green-200' : 'bg-red-200'}`}
                    />
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Meta: {metric.target}%</span>
                      <span className={metric.current >= metric.target ? 'text-green-600' : 'text-red-600'}>
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
