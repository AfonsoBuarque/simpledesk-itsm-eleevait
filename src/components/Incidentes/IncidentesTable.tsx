
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, AlertCircle, Pencil } from 'lucide-react';
import { Solicitacao } from '@/types/solicitacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getSLAStatus, getStatusColor, getUrgenciaColor } from '@/utils/slaStatus';

interface IncidentesTableProps {
  incidentes: Solicitacao[];
  onEditIncidente: (incidente: Solicitacao) => void;
  onNewIncidente: () => void;
}

const IncidentesTable = ({ incidentes, onEditIncidente, onNewIncidente }: IncidentesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(incidentes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIncidentes = incidentes.slice(startIndex, endIndex);

  if (incidentes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum incidente encontrado
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Comece criando seu primeiro incidente para registrar ocorrências!
          </p>
          <Button onClick={onNewIncidente}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Incidente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Incidentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urgência</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Data Abertura</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentIncidentes.map((incidente) => {
              const slaStatus = getSLAStatus(incidente);
              const IconComponent = slaStatus.icon;
              
              return (
                <TableRow key={incidente.id}>
                  <TableCell>
                    <button
                      onClick={() => onEditIncidente(incidente)}
                      className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer"
                    >
                      {incidente.numero}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {incidente.titulo}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(incidente.status)}>
                      {incidente.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUrgenciaColor(incidente.urgencia)}>
                      {incidente.urgencia}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {incidente.solicitante?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {incidente.cliente?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {incidente.grupo_responsavel?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(incidente.data_abertura), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IconComponent className="h-4 w-4" />
                      <Badge className={slaStatus.color}>
                        {slaStatus.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditIncidente(incidente)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentesTable;
