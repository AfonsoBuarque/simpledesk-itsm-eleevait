import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCriticalProblems } from '@/hooks/useCriticalProblems';
import { getStatusColor } from '@/utils/slaStatus';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, Zap } from 'lucide-react';

interface CriticalProblemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketClick: (ticket: any) => void;
}

const CriticalProblemsModal = ({ isOpen, onClose, onTicketClick }: CriticalProblemsModalProps) => {
  const { data: tickets = [], isLoading } = useCriticalProblems(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <Zap className="h-5 w-5" />
            Problemas Críticos ({tickets.length})
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Carregando problemas...</div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Nenhum problema crítico encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-orange-50 hover:bg-orange-100"
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
                        Crítica
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
                        <span className="font-medium">Criado em:</span>{' '}
                        {format(new Date(ticket.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Badge className="bg-orange-500 text-white">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Crítico
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

export default CriticalProblemsModal;