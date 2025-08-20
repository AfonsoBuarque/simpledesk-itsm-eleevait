
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Edit, Trash2 } from 'lucide-react';
import { useFabricantes } from '@/hooks/useFabricantes';
import { Fabricante } from '@/types/fabricante';
import NewFabricanteDialog from './NewFabricanteDialog';
import EditFabricanteDialog from './EditFabricanteDialog';

const FabricanteManagement = () => {
  const { fabricantes, isLoading, deleteFabricante } = useFabricantes();
  const [editingFabricante, setEditingFabricante] = useState<Fabricante | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fabricanteToDelete, setFabricanteToDelete] = useState<Fabricante | null>(null);

  const handleEdit = (fabricante: Fabricante) => {
    setEditingFabricante(fabricante);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (fabricante: Fabricante) => {
    setFabricanteToDelete(fabricante);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (fabricanteToDelete) {
      try {
        await deleteFabricante.mutateAsync(fabricanteToDelete.id);
        setDeleteDialogOpen(false);
        setFabricanteToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir fabricante:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Fabricantes</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Carregando fabricantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fabricantes</h1>
        <NewFabricanteDialog />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>País de Origem</TableHead>
              <TableHead>Contato de Suporte</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fabricantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum fabricante cadastrado
                </TableCell>
              </TableRow>
            ) : (
              fabricantes.map((fabricante) => (
                <TableRow key={fabricante.id}>
                  <TableCell className="font-medium">{fabricante.nome}</TableCell>
                  <TableCell>{fabricante.pais_origem || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {fabricante.contato_suporte || '-'}
                  </TableCell>
                  <TableCell>
                    {(fabricante as any).clients?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(fabricante)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(fabricante)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditFabricanteDialog
        fabricante={editingFabricante}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o fabricante "{fabricanteToDelete?.nome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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

export default FabricanteManagement;
