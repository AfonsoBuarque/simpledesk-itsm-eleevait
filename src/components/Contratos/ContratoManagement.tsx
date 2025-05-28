
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, FileText } from 'lucide-react';
import { NewContratoDialog } from './NewContratoDialog';
import { EditContratoDialog } from './EditContratoDialog';
import { useContratos } from '@/hooks/useContratos';
import type { Contrato } from '@/types/contrato';

export const ContratoManagement = () => {
  const { contratos, isLoading, deleteContrato } = useContratos();
  const [editingContrato, setEditingContrato] = React.useState<Contrato | null>(null);
  const [deletingContrato, setDeletingContrato] = React.useState<Contrato | null>(null);

  const handleEdit = (contrato: Contrato) => {
    setEditingContrato(contrato);
  };

  const handleDelete = (contrato: Contrato) => {
    setDeletingContrato(contrato);
  };

  const confirmDelete = async () => {
    if (deletingContrato) {
      await deleteContrato.mutateAsync(deletingContrato.id);
      setDeletingContrato(null);
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
        </div>
        <div className="text-center py-8">Carregando contratos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Contratos</h1>
        <NewContratoDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Contratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contratos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum contrato encontrado. Clique em "Novo Contrato" para criar o primeiro.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Valor NF</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">
                        {contrato.numero_contrato}
                      </TableCell>
                      <TableCell>{contrato.nome_contrato || '-'}</TableCell>
                      <TableCell>{contrato.client?.name || '-'}</TableCell>
                      <TableCell>{contrato.fabricante?.nome || '-'}</TableCell>
                      <TableCell>{contrato.usuario_responsavel?.name || '-'}</TableCell>
                      <TableCell>{formatCurrency(contrato.nota_fiscal_valor)}</TableCell>
                      <TableCell>{formatDate(contrato.data_inicio)}</TableCell>
                      <TableCell>{formatDate(contrato.data_fim)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(contrato)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(contrato)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <EditContratoDialog
        contrato={editingContrato}
        open={!!editingContrato}
        onOpenChange={(open) => !open && setEditingContrato(null)}
      />

      <AlertDialog open={!!deletingContrato} onOpenChange={() => setDeletingContrato(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o contrato "{deletingContrato?.numero_contrato}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
