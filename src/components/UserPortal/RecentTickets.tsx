
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Ticket {
  id: string;
  numero: string;
  titulo: string;
  status: string;
  urgencia: string;
  criado_em: string;
  categoria?: { nome: string } | null;
}

interface RecentTicketsProps {
  tickets: Ticket[];
}

const RecentTickets = ({ tickets }: RecentTicketsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberta':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolvida':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fechada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (tickets.length === 0) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-600">
            <Clock className="h-5 w-5" />
            Tickets Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-500">
            Nenhum ticket encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover border border-gray-100 shadow-md hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-600">
          <Clock className="h-5 w-5 text-blue-600" />
          Tickets Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {tickets.slice(0, 10).map((ticket) => (
            <div 
              key={ticket.id} 
              className="p-4 border rounded-lg hover:bg-white hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded shadow-sm">{ticket.numero}</span>
                  <Badge className={getUrgencyColor(ticket.urgencia)}>
                    {ticket.urgencia}
                  </Badge>
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-700 transition-colors group-hover:text-blue-700">
                {ticket.titulo}
              </h4>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(ticket.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </div>
                {ticket.categoria && (
                  <span className="text-gray-500">
                    {ticket.categoria.nome}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTickets;
