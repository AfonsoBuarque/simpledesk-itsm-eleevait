
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { useSolicitacoes } from '@/hooks/useSolicitacoes';
import { Solicitacao } from '@/types/solicitacao';
import { NewSolicitacaoDialog } from './NewSolicitacaoDialog';
import { EditSolicitacaoDialog } from './EditSolicitacaoDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatBrazilTime } from '@/utils/timezone';

const SolicitacaoManagement = () => {
  const { solicitacoes, isLoading, deleteSolicitacao } = useSolicitacoes();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingSolicitacao, setEditingSolicitacao] = useState<Solicitacao | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      await deleteSolicitacao.mutateAsync(id);
    }
  };

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

  const formatTipo = (tipo: string) => {
    const tipos = {
      incidente: 'Incidente',
      solicitacao: 'Solicitação',
      problema: 'Problema',
      requisicao: 'Requisição',
      mudanca: 'Mudança'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando solicitações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestão de Solicitações</h1>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      {solicitacoes.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitacoes.map((solicitacao) => (
                  <TableRow key={solicitacao.id}>
                    <TableCell className="font-medium">{solicitacao.numero}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {solicitacao.titulo}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatTipo(solicitacao.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(solicitacao.status)}>
                        {solicitacao.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getUrgenciaColor(solicitacao.urgencia)}>
                        {solicitacao.urgencia}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {solicitacao.solicitante?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {solicitacao.cliente?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {solicitacao.grupo_responsavel?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {formatBrazilTime(solicitacao.data_abertura, 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSolicitacao(solicitacao)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(solicitacao.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Comece criando sua primeira solicitação de serviço.
            </p>
            <Button onClick={() => setIsNewDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Solicitação
            </Button>
          </CardContent>
        </Card>
      )}

      <NewSolicitacaoDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
      />

      {editingSolicitacao && (
        <EditSolicitacaoDialog
          solicitacao={editingSolicitacao}
          isOpen={!!editingSolicitacao}
          onClose={() => setEditingSolicitacao(null)}
        />
      )}
    </div>
  );
};

export default SolicitacaoManagement;
