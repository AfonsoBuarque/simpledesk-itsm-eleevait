
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import MetricsCard from './MetricsCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSLAPerformance } from '@/hooks/useSLAPerformance';
import { getSLAStatus, getStatusColor, getUrgenciaColor } from '@/utils/slaStatus';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EditRequisicaoDialog } from '@/components/Requisicoes/EditRequisicaoDialog';
import EditIncidenteDialog from '@/components/Incidentes/EditIncidenteDialog';
import SLARiskTicketsModal from './SLARiskTicketsModal';
import OpenTicketsModal from './OpenTicketsModal';
import ResolvedTodayModal from './ResolvedTodayModal';
import CriticalProblemsModal from './CriticalProblemsModal';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DashboardOverview = () => {
  const { tickets, stats, slaMetrics, isLoading } = useDashboardData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSLARiskModalOpen, setIsSLARiskModalOpen] = useState(false);
  const [isOpenTicketsModalOpen, setIsOpenTicketsModalOpen] = useState(false);
  const [isResolvedTodayModalOpen, setIsResolvedTodayModalOpen] = useState(false);
  const [isCriticalProblemsModalOpen, setIsCriticalProblemsModalOpen] = useState(false);
  const itemsPerPage = 3;


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados do dashboard...</div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    return getUrgenciaColor(priority);
  };

  // Pagination logic
  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedTicket(null);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-10 max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-8">
      {/* Page Title */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between mb-2 md:mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight gradient-heading">
            Visão Geral do Dashboard
          </h1>
        </div>
        <div className="mt-2 md:mt-0 text-sm text-gray-500 font-medium">
          Última atualização: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </div>
      </section>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in" style={{ '--tw-animation-delay': '0.1s' } as React.CSSProperties}>
        <MetricsCard
          title="Tickets Abertos"
          value={stats?.totalOpen || 0}
          icon={Ticket}
          trend={{ value: "Atual", direction: "neutral" }}
          onClick={() => setIsOpenTicketsModalOpen(true)}
        />
        <MetricsCard
          title="SLA em Risco"
          value={stats?.slaAtRisk || 0}
          icon={Clock}
          trend={{ value: "Crítico", direction: "down" }}
          className="border-l-4 border-l-red-500"
          onClick={() => setIsSLARiskModalOpen(true)}
        />
        <MetricsCard
          title="Resolvidos Hoje"
          value={stats?.resolvedTodayCount || 0}
          icon={CheckCircle}
          trend={{ value: "Hoje", direction: "up" }}
          onClick={() => setIsResolvedTodayModalOpen(true)}
        />
        <MetricsCard
          title="Problemas Críticos"
          value={stats?.criticalCount || 0}
          icon={AlertTriangle}
          trend={{ value: "Ativo", direction: "neutral" }}
          className="border-l-4 border-l-orange-500"
          onClick={() => setIsCriticalProblemsModalOpen(true)}
        />
      </div>

      {/* Section: Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ '--tw-animation-delay': '0.2s' } as React.CSSProperties}>
        {/* Recent Tickets */}
        <Card className="rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:translate-y-[-2px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600 text-lg md:text-xl font-bold">
              <Ticket className="h-6 w-6" />
              Tickets Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum ticket encontrado
                </div>
              ) : (
                <>
                  {paginatedTickets.map((ticket) => {
                    const slaStatus = getSLAStatus(ticket);
                    return (
                      <div 
                        key={ticket.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-blue-600 text-lg">{ticket.numero}</span>
                            <Badge className={`${getPriorityColor(ticket.prioridade)} capitalize shadow`}>
                              {ticket.prioridade}
                            </Badge>
                          </div>
                          <p className="text-base font-medium text-gray-700 mb-1 truncate">{ticket.titulo}</p>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">Cliente:</span>
                            <span className="text-xs font-semibold text-gray-700">
                              {ticket.cliente?.name || 'Não informado'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${getStatusColor(ticket.status)} shadow-sm`}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={`${slaStatus.color} shadow-sm`}>
                              {slaStatus.label}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {format(new Date(ticket.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Página {currentPage} de {totalPages} ({tickets.length} tickets)
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1"
                        >
                          Próximo
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SLA Performance */}
        <Card className="rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:translate-y-[-2px]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 text-lg md:text-xl font-bold">
                <TrendingUp className="h-6 w-6" />
                Performance SLA
              </div>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Tempo Real
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slaMetrics && slaMetrics.length > 0 ? (
                <>
                  {/* SLA Geral Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">SLA Geral</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${
                          slaMetrics.reduce((acc, m) => acc + m.current * m.total, 0) / slaMetrics.reduce((acc, m) => acc + m.total, 0) >= 95 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round(slaMetrics.reduce((acc, m) => acc + m.current * m.total, 0) / slaMetrics.reduce((acc, m) => acc + m.total, 0) || 0)}%
                        </span>
                        <span className="text-sm text-gray-500">
                          ({slaMetrics.reduce((acc, m) => acc + m.total, 0)} total)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Meta: 95%</span>
                      <span className="text-green-600 font-medium">
                        ✓ {slaMetrics.reduce((acc, m) => acc + Math.round(m.current * m.total / 100), 0)} no prazo
                      </span>
                      <span className="text-red-600 font-medium">
                        ⚠ {slaMetrics.reduce((acc, m) => acc + m.total - Math.round(m.current * m.total / 100), 0)} violados
                      </span>
                    </div>
                  </div>

                  {/* Individual Metrics */}
                  {slaMetrics.map((metric) => {
                    const onTime = Math.round(metric.current * metric.total / 100);
                    const violated = metric.total - onTime;
                    
                    return (
                      <div key={metric.category} className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-gray-800">{metric.category}</span>
                            {metric.total === 0 && (
                              <Badge variant="outline" className="text-xs text-gray-500">
                                Sem dados
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-bold ${
                              metric.current >= metric.target ? 'text-green-600' : 
                              metric.current === 0 ? 'text-gray-400' : 'text-red-600'
                            } transition-all duration-300`}>
                              {metric.current}%
                            </span>
                            <span className="text-sm text-gray-500">({metric.total} total)</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <Progress 
                            value={metric.current} 
                            className={`h-2 rounded-full ${
                              metric.current >= metric.target ? 'bg-green-100' :
                              metric.current === 0 ? 'bg-gray-100' : 'bg-red-100'
                            }`}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">Meta: {metric.target}%</span>
                            {metric.total > 0 && (
                              <>
                                <span className="text-green-600 font-medium">
                                  ✓ {onTime} no prazo
                                </span>
                                <span className="text-red-600 font-medium">
                                  ⚠ {violated} violados
                                </span>
                              </>
                            )}
                          </div>
                          <Badge 
                            variant={metric.current >= metric.target ? "default" : "destructive"}
                            className={`text-xs font-medium ${
                              metric.current >= metric.target 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : metric.current === 0 
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {metric.current >= metric.target ? '✓ Meta atingida' : 
                             metric.current === 0 ? '📊 Sem dados' : '⚠️ Abaixo da meta'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-3">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="font-medium text-gray-700 mb-1">Calculando métricas de SLA...</div>
                  <div className="text-sm text-gray-500">Dados sendo processados do sistema</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      {selectedTicket && (
        <>
          {selectedTicket.tipo === 'incidente' ? (
            <EditIncidenteDialog
              incidente={selectedTicket}
              isOpen={isEditDialogOpen}
              onClose={handleCloseDialog}
            />
          ) : (
            <EditRequisicaoDialog
              requisicao={selectedTicket}
              isOpen={isEditDialogOpen}
              onClose={handleCloseDialog}
            />
          )}
        </>
      )}

      {/* SLA Risk Modal */}
      <SLARiskTicketsModal
        isOpen={isSLARiskModalOpen}
        onClose={() => setIsSLARiskModalOpen(false)}
        onTicketClick={handleTicketClick}
      />

      {/* Open Tickets Modal */}
      <OpenTicketsModal
        isOpen={isOpenTicketsModalOpen}
        onClose={() => setIsOpenTicketsModalOpen(false)}
        onTicketClick={handleTicketClick}
      />

      {/* Resolved Today Modal */}
      <ResolvedTodayModal
        isOpen={isResolvedTodayModalOpen}
        onClose={() => setIsResolvedTodayModalOpen(false)}
        onTicketClick={handleTicketClick}
      />

      {/* Critical Problems Modal */}
      <CriticalProblemsModal
        isOpen={isCriticalProblemsModalOpen}
        onClose={() => setIsCriticalProblemsModalOpen(false)}
        onTicketClick={handleTicketClick}
      />
    </div>
  );
};

export default DashboardOverview;
