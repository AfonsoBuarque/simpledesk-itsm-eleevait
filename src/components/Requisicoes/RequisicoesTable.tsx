
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, HelpCircle, Pencil } from 'lucide-react';
import { Solicitacao } from '@/types/solicitacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatBrazilTime } from '@/utils/timezone';
import { getSLAStatus, getStatusColor, getUrgenciaColor } from '@/utils/slaStatus';

interface RequisicoesTableProps {
  requisicoes: Solicitacao[];
  onEditRequisicao: (requisicao: Solicitacao) => void;
  onNewRequisicao: () => void;
}

const RequisicoesTable = ({ requisicoes, onEditRequisicao, onNewRequisicao }: RequisicoesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(requisicoes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequisicoes = requisicoes.slice(startIndex, endIndex);

  if (requisicoes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <HelpCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma requisição encontrada
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Comece criando sua primeira requisição de serviço.
          </p>
          <Button onClick={onNewRequisicao}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Requisição
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Requisições</CardTitle>
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
              <TableHead>Data Criação</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRequisicoes.map((requisicao) => {
              const slaStatus = getSLAStatus(requisicao);
              const IconComponent = slaStatus.icon;
              
              return (
                <TableRow key={requisicao.id}>
                  <TableCell>
                    <button
                      onClick={() => onEditRequisicao(requisicao)}
                      className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer"
                    >
                      {requisicao.numero}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {requisicao.titulo}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(requisicao.status)}>
                      {requisicao.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUrgenciaColor(requisicao.urgencia)}>
                      {requisicao.urgencia}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {requisicao.solicitante?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {requisicao.cliente?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {requisicao.grupo_responsavel?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {formatBrazilTime(requisicao.criado_em, 'dd/MM/yyyy HH:mm')}
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
                      onClick={() => onEditRequisicao(requisicao)}
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

export default RequisicoesTable;
