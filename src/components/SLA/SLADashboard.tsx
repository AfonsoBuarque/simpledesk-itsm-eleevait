
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Calendar
} from 'lucide-react';

const SLADashboard = () => {
  const slaMetrics = [
    {
      category: 'Incidentes Críticos',
      target: 2, // horas
      average: 1.8,
      breaches: 2,
      total: 15,
      compliance: 86.7
    },
    {
      category: 'Incidentes Altos',
      target: 4,
      average: 3.2,
      breaches: 1,
      total: 25,
      compliance: 96.0
    },
    {
      category: 'Requisições Padrão',
      target: 24,
      average: 18.5,
      breaches: 0,
      total: 45,
      compliance: 100.0
    },
    {
      category: 'Mudanças Normais',
      target: 72,
      average: 65.2,
      breaches: 1,
      total: 12,
      compliance: 91.7
    }
  ];

  const riskTickets = [
    {
      id: 'INC001234',
      title: 'Sistema de e-mail indisponível',
      timeRemaining: '1h 15m',
      riskLevel: 'high',
      priority: 'Critical'
    },
    {
      id: 'REQ001235',
      title: 'Acesso ao sistema financeiro',
      timeRemaining: '3h 45m',
      riskLevel: 'medium',
      priority: 'High'
    },
    {
      id: 'CHG001236',
      title: 'Atualização servidor web',
      timeRemaining: '8h 20m',
      riskLevel: 'low',
      priority: 'Medium'
    }
  ];

  const monthlyTrends = [
    { month: 'Jan', compliance: 92.5, tickets: 150 },
    { month: 'Fev', compliance: 94.2, tickets: 142 },
    { month: 'Mar', compliance: 89.8, tickets: 167 },
    { month: 'Abr', compliance: 96.1, tickets: 135 },
    { month: 'Mai', compliance: 93.7, tickets: 158 }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600';
    if (compliance >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">SLA & Métricas</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-700 bg-green-50">
            Última atualização: há 5 min
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Global</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-gray-600">Meta: 95%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Risco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-gray-600">Tickets com SLA em risco</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4.2h</div>
            <p className="text-xs text-gray-600">Resolução de incidentes</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">247</div>
            <p className="text-xs text-gray-600">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Performance by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {slaMetrics.map((metric, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{metric.category}</h4>
                      <p className="text-sm text-gray-600">
                        Meta: {metric.target}h | Média: {metric.average}h
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getComplianceColor(metric.compliance)}`}>
                        {metric.compliance}%
                      </div>
                      <p className="text-xs text-gray-600">
                        {metric.breaches} quebras em {metric.total} tickets
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={metric.compliance} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tickets at Risk */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Tickets em Risco de SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className={`p-4 border rounded-lg ${getRiskColor(ticket.riskLevel)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-600">{ticket.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{ticket.timeRemaining}</div>
                      <div className="text-xs">restantes</div>
                    </div>
                  </div>
                  <p className="text-sm">{ticket.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Tendências Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {monthlyTrends.map((trend) => (
              <div key={trend.month} className="text-center p-4 border rounded-lg">
                <div className="text-lg font-bold">{trend.month}</div>
                <div className={`text-2xl font-bold ${getComplianceColor(trend.compliance)}`}>
                  {trend.compliance}%
                </div>
                <div className="text-sm text-gray-600">{trend.tickets} tickets</div>
                <Progress value={trend.compliance} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLADashboard;
