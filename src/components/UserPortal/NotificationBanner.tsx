import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface NotificationBannerProps {
  urgentTickets: number;
  pendingTickets: number;
  resolvedToday: number;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  urgentTickets,
  pendingTickets,
  resolvedToday
}) => {
  if (urgentTickets === 0 && pendingTickets === 0 && resolvedToday === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3 animate-fade-in">
      {urgentTickets > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-red-800">
              Você tem <strong>{urgentTickets}</strong> ticket{urgentTickets > 1 ? 's' : ''} de alta prioridade aguardando atenção.
            </span>
            <Badge variant="destructive" className="ml-2">
              Urgente
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      {pendingTickets > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-yellow-800">
              {pendingTickets} ticket{pendingTickets > 1 ? 's' : ''} em andamento aguardando atualização.
            </span>
            <Badge variant="outline" className="ml-2 border-yellow-600 text-yellow-700">
              Pendente
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      {resolvedToday > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-green-800">
              Parabéns! {resolvedToday} ticket{resolvedToday > 1 ? 's foram resolvidos' : ' foi resolvido'} hoje.
            </span>
            <Badge variant="outline" className="ml-2 border-green-600 text-green-700">
              Resolvido
            </Badge>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
