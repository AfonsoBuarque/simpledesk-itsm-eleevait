
import React from 'react';
import { useUserPortalDashboard } from '@/hooks/useUserPortalDashboard';
import DashboardMetrics from './DashboardMetrics';
import StatusChart from './StatusChart';
import UrgencyChart from './UrgencyChart';
import MonthlyTrendChart from './MonthlyTrendChart';
import RecentTickets from './RecentTickets';
import { NotificationBanner } from './NotificationBanner';
import { Loader2 } from 'lucide-react';

const UserPortalDashboard = () => {
  const {
    stats,
    statusData,
    urgenciaData,
    monthlyData,
    recentTickets,
    isLoading
  } = useUserPortalDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner de Notificações */}
      <NotificationBanner 
        urgentTickets={urgenciaData.find(item => item.name === 'alta')?.value || 0}
        pendingTickets={statusData.find(item => item.name === 'em_andamento')?.value || 0}
        resolvedToday={statusData.find(item => item.name === 'resolvida')?.value || 0}
      />

      {/* Métricas principais */}
      <div className="animate-fade-in" style={{ '--tw-animation-delay': '0.1s' } as React.CSSProperties}>
        <DashboardMetrics stats={stats} />
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ '--tw-animation-delay': '0.2s' } as React.CSSProperties}>
        <StatusChart data={statusData} />
        <UrgencyChart data={urgenciaData} />
      </div>

      {/* Tendência mensal e tickets recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ '--tw-animation-delay': '0.3s' } as React.CSSProperties}>
        <MonthlyTrendChart data={monthlyData} />
        <RecentTickets tickets={recentTickets} />
      </div>
    </div>
  );
};

export default UserPortalDashboard;
