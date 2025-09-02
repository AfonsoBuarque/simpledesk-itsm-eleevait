import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Filter, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUserPortalTickets } from '@/hooks/useUserPortalTickets';

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

export const UserTicketsList: React.FC = () => {
  const { tickets, isLoading } = useUserPortalTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Filtrar tickets
  const filteredTickets = (tickets || []).filter((ticket: Ticket) => {
    const matchesSearch = ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.descricao && ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || ticket.urgencia === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageTickets = filteredTickets.slice(startIndex, endIndex);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, urgencyFilter]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando seus tickets...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="resolvida">Resolvida</SelectItem>
                <SelectItem value="fechada">Fechada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Urgências</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setUrgencyFilter('all');
            }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tickets */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Meus Tickets ({filteredTickets.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ticket encontrado</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || urgencyFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Você ainda não possui tickets criados.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentPageTickets.map((ticket: Ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                        {ticket.numero}
                      </span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                      <Badge className={getUrgencyColor(ticket.urgencia)}>
                        {getUrgencyLabel(ticket.urgencia)}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {ticket.titulo}
                  </h3>

                  {ticket.descricao && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {ticket.descricao}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Criado: {format(new Date(ticket.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Atualizado: {format(new Date(ticket.atualizado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                    </div>

                    {ticket.atendente_nome && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Atendente: {ticket.atendente_nome}</span>
                      </div>
                    )}
                  </div>

                  {ticket.categoria_nome && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Categoria: <span className="font-medium">{ticket.categoria_nome}</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredTickets.length > itemsPerPage && (
        <Card className="border-gray-200">
          <CardContent className="flex justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const shouldShow = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!shouldShow) {
                    // Show ellipsis for gaps
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
