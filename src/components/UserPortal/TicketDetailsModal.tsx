import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Tag, AlertTriangle, Zap, MessageSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RequisicaoChat } from '@/components/Requisicoes/RequisicaoChat';

interface Ticket {
  id: string;
  numero: string;
  titulo: string;
  descricao?: string;
  status: string;
  urgencia: string;
  prioridade: string;
  criado_em: string;
  atualizado_em: string;
  categoria_id?: string;
  atendente_id?: string;
  categoria_nome?: string | null;
  atendente_nome?: string | null;
}

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberta':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pendente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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
      case 'critica':
        return 'bg-red-200 text-red-900 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aberta': return 'Aberta';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'resolvida': return 'Resolvida';
      case 'fechada': return 'Fechada';
      default: return status;
    }
  };

  const getUrgencyLabel = (urgencia: string) => {
    switch (urgencia) {
      case 'baixa': return 'Baixa';
      case 'media': return 'Média';
      case 'alta': return 'Alta';
      case 'critica': return 'Crítica';
      default: return urgencia;
    }
  };

  const getPriorityLabel = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'Baixa';
      case 'media': return 'Média';
      case 'alta': return 'Alta';
      case 'critica': return 'Crítica';
      default: return prioridade;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              {ticket.numero}
            </span>
            <span className="text-gray-900">{ticket.titulo}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-y-auto">
            <div className="space-y-6 pr-2">
              {/* Status e Urgência */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Urgência:</span>
                  <Badge className={getUrgencyColor(ticket.urgencia)}>
                    {getUrgencyLabel(ticket.urgencia)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Prioridade:</span>
                  <Badge className={getUrgencyColor(ticket.prioridade)}>
                    {getPriorityLabel(ticket.prioridade)}
                  </Badge>
                </div>
              </div>

              {/* Descrição */}
              {ticket.descricao && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Descrição</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.descricao}</p>
                  </div>
                </div>
              )}

              {/* Informações Adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Informações Gerais</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Criado em:</span>
                      <span className="font-medium">
                        {format(new Date(ticket.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Atualizado em:</span>
                      <span className="font-medium">
                        {format(new Date(ticket.atualizado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                    </div>

                    {ticket.categoria_nome && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-medium">{ticket.categoria_nome}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Atendimento</h3>
                  
                  <div className="space-y-3">
                    {ticket.atendente_nome ? (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Atendente:</span>
                        <span className="font-medium">{ticket.atendente_nome}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Atendente:</span>
                        <span className="text-gray-500 italic">Não atribuído</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ID para referência técnica */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">ID: {ticket.id}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 min-h-0">
            <div className="h-full">
              <RequisicaoChat 
                requisicao={ticket as any} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};