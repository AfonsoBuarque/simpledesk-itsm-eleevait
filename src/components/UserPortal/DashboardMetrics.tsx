
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DashboardMetricsProps {
  stats: {
    total: number;
    abertas: number;
    emAndamento: number;
    resolvidas: number;
    fechadas: number;
  };
}

const DashboardMetrics = ({ stats }: DashboardMetricsProps) => {
  const metrics = [
    {
      title: 'Total de Tickets',
      value: stats.total, 
      icon: Ticket,
      color: 'text-blue-600', 
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-l-blue-500 hover:border-l-blue-600',
    },
    {
      title: 'Em Aberto',
      value: stats.abertas + stats.emAndamento,
      icon: Clock,
      color: 'text-orange-600', 
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-l-orange-500 hover:border-l-orange-600',
    },
    {
      title: 'Resolvidas',
      value: stats.resolvidas,
      icon: CheckCircle,
      color: 'text-green-600', 
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-l-green-500 hover:border-l-green-600',
    },
    {
      title: 'Fechadas',
      value: stats.fechadas,
      icon: XCircle,
      color: 'text-gray-600', 
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-l-gray-500 hover:border-l-gray-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <Card key={metric.title} className={`${metric.borderColor} border-l-4 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor} shadow-sm`}>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color} transition-all duration-200 group-hover:scale-105`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
