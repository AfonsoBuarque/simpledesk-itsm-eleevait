
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, HelpCircle, Pencil } from 'lucide-react';
import { Solicitacao } from '@/types/solicitacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getSLAStatus, getStatusColor, getUrgenciaColor } from '@/utils/slaStatus';

interface RequisicoesTableProps {
  requisicoes: Solicitacao[];
  onEditRequisicao: (requisicao: Solicitacao) => void;
  onNewRequisicao: () => void;
}

const RequisicoesTable = ({ requisicoes, onEditRequisicao, onNewRequisicao }: RequisicoesTableProps) => {
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
              <TableHead>Data Abertura</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisicoes.map((requisicao) => {
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
                    {format(new Date(requisicao.data_abertura), 'dd/MM/yyyy HH:mm', {
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
      </CardContent>
    </Card>
  );
};

export default RequisicoesTable;
