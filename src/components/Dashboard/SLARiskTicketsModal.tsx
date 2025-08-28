import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSLARiskTickets } from '@/hooks/useSLARiskTickets';
import { getStatusColor } from '@/utils/slaStatus';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, AlertTriangle } from 'lucide-react';

interface SLARiskTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketClick: (ticket: any) => void;
}

const SLARiskTicketsModal = ({ isOpen, onClose, onTicketClick }: SLARiskTicketsModalProps) => {
  const { data: tickets = [], isLoading } = useSLARiskTickets(isOpen);

  const getTimeSinceExpired = (dataLimite: string) => {
    const limite = new Date(dataLimite);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - limite.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h atraso`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d atraso`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Tickets com SLA em Risco ({tickets.length})
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Carregando tickets...</div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Nenhum ticket com SLA em risco encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-red-50 hover:bg-red-100"
                onClick={() => {
                  onTicketClick(ticket);
                  onClose();
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-blue-600 text-lg">{ticket.numero}</span>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {getTimeSinceExpired(ticket.data_limite_resolucao)}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2">{ticket.titulo}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Solicitante:</span>{' '}
                        {ticket.solicitante?.name || 'Não informado'}
                      </div>
                      <div>
                        <span className="font-medium">Cliente:</span>{' '}
                        {ticket.cliente?.name || 'Não informado'}
                      </div>
                      <div>
                        <span className="font-medium">Categoria:</span>{' '}
                        {ticket.categoria?.nome || 'Não informado'}
                      </div>
                      <div>
                        <span className="font-medium">Prazo:</span>{' '}
                        {format(new Date(ticket.data_limite_resolucao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Badge className="bg-red-500 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      SLA Vencido
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SLARiskTicketsModal;