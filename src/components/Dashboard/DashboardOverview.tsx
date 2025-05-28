
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import MetricsCard from './MetricsCard';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Plus
} from 'lucide-react';

const DashboardOverview = () => {
  const recentTickets = [
    { id: 'INC001234', title: 'Sistema de e-mail indisponível', priority: 'High', status: 'Em Andamento', sla: '2h 15m' },
    { id: 'REQ001235', title: 'Acesso ao sistema financeiro', priority: 'Medium', status: 'Aguardando Aprovação', sla: '4h 30m' },
    { id: 'CHG001236', title: 'Atualização do servidor web', priority: 'Low', status: 'Planejado', sla: '1d 2h' },
    { id: 'PRB001237', title: 'Lentidão na rede corporativa', priority: 'High', status: 'Investigação', sla: '6h 45m' }
  ];

  const slaMetrics = [
    { category: 'Incidentes', target: 95, current: 92, total: 45 },
    { category: 'Requisições', target: 90, current: 94, total: 32 },
    { category: 'Mudanças', target: 98, current: 96, total: 12 },
    { category: 'Problemas', target: 85, current: 88, total: 8 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Aguardando Aprovação': return 'bg-orange-100 text-orange-800';
      case 'Planejado': return 'bg-purple-100 text-purple-800';
      case 'Investigação': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          value="247"
          icon={Ticket}
          trend={{ value: "+12%", direction: "up" }}
        />
        <MetricsCard
          title="SLA em Risco"
          value="8"
          icon={Clock}
          trend={{ value: "-5%", direction: "down" }}
          className="border-l-4 border-l-red-500"
        />
        <MetricsCard
          title="Resolvidos Hoje"
          value="42"
          icon={CheckCircle}
          trend={{ value: "+8%", direction: "up" }}
        />
        <MetricsCard
          title="Problemas Críticos"
          value="3"
          icon={AlertTriangle}
          trend={{ value: "0%", direction: "neutral" }}
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
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-blue-600">{ticket.id}</span>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <span className="text-xs text-gray-500">SLA: {ticket.sla}</span>
                    </div>
                  </div>
                </div>
              ))}
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
              {slaMetrics.map((metric) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
