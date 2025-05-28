
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, HelpCircle, Clock, User } from 'lucide-react';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { Solicitacao } from '@/types/solicitacao';
import { NewRequisicaoDialog } from './NewRequisicaoDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RequisicoesManagement = () => {
  const { requisicoes, isLoading } = useRequisicoes();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      aberta: 'bg-blue-100 text-blue-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      pendente: 'bg-orange-100 text-orange-800',
      resolvida: 'bg-green-100 text-green-800',
      fechada: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUrgenciaColor = (urgencia: string) => {
    const colors = {
      baixa: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return colors[urgencia as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Contar requisições por status
  const statusCounts = requisicoes.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando requisições...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Requisições</h1>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Requisição
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requisicoes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertas</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts['aberta'] || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts['em_andamento'] || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts['resolvida'] || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de requisições */}
      {requisicoes.length > 0 ? (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisicoes.map((requisicao) => (
                  <TableRow key={requisicao.id}>
                    <TableCell className="font-medium">{requisicao.numero}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <HelpCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma requisição encontrada
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Comece criando sua primeira requisição de serviço.
            </p>
            <Button onClick={() => setIsNewDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Requisição
            </Button>
          </CardContent>
        </Card>
      )}

      <NewRequisicaoDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
      />
    </div>
  );
};

export default RequisicoesManagement;
