import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import type { MudancaStats } from '@/types/mudanca';

const MudancaStatsCards = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['mudanca-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mudanca_stats' as any)
        .select('*')
        .single();

      if (error) throw error;
      return data as any;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const successRate = stats.total_mudancas > 0 
    ? ((stats.mudancas_sucesso / stats.total_mudancas) * 100).toFixed(1)
    : '0';

  const rollbackRate = stats.total_mudancas > 0 
    ? ((stats.mudancas_rollback / stats.total_mudancas) * 100).toFixed(1)
    : '0';

  const cards = [
    {
      title: 'Total de Mudanças',
      value: stats.total_mudancas,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Taxa de Sucesso',
      value: `${successRate}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: `${stats.mudancas_sucesso} sucessos`,
    },
    {
      title: 'Taxa de Rollback',
      value: `${rollbackRate}%`,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      subtitle: `${stats.mudancas_rollback} rollbacks`,
    },
    {
      title: 'Tempo Médio Aprovação',
      value: `${stats.tempo_medio_aprovacao_horas?.toFixed(1) || '0'}h`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Mudanças Normais',
      value: stats.mudancas_normais,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Mudanças Emergenciais',
      value: stats.mudancas_emergenciais,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Mudanças Padrão',
      value: stats.mudancas_padrao,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'SLA Vencido',
      value: stats.mudancas_sla_vencido,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      alert: stats.mudancas_sla_vencido > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={card.alert ? 'border-red-200 bg-red-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
                {card.alert && (
                  <Badge variant="destructive" className="ml-2">
                    Atenção
                  </Badge>
                )}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MudancaStatsCards;