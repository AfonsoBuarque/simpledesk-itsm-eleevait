
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
import { Edit, Trash2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { NewLocalizacaoDialog } from './NewLocalizacaoDialog';
import { EditLocalizacaoDialog } from './EditLocalizacaoDialog';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import type { Localizacao } from '@/types/localizacao';

export const LocalizacaoManagement = () => {
  const { localizacoes, isLoading, deleteLocalizacao } = useLocalizacoes();
  const [editingLocalizacao, setEditingLocalizacao] = React.useState<Localizacao | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const handleEdit = (localizacao: Localizacao) => {
    setEditingLocalizacao(localizacao);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLocalizacao.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting localizacao:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Localizações</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Carregando localizações...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Localizações</h1>
          <p className="text-gray-600">Gerencie as localizações da organização</p>
        </div>
        <NewLocalizacaoDialog />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Localização Pai</TableHead>
              <TableHead>Coordenadas</TableHead>
              <TableHead>Usuário Responsável</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localizacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  Nenhuma localização cadastrada
                </TableCell>
              </TableRow>
            ) : (
              localizacoes.map((localizacao) => (
                <TableRow key={localizacao.id}>
                  <TableCell className="font-medium">{localizacao.nome}</TableCell>
                  <TableCell>
                    {localizacao.tipo ? (
                      <Badge variant="secondary">{localizacao.tipo}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {localizacao.parent ? (
                      <span className="text-sm">{localizacao.parent.nome}</span>
                    ) : (
                      <span className="text-gray-400">Raiz</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {localizacao.coordenadas ? (
                      <span className="text-sm font-mono">{localizacao.coordenadas}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {localizacao.user ? (
                      <span className="text-sm">{localizacao.user.name}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {localizacao.client ? (
                      <span className="text-sm">{localizacao.client.name}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(localizacao)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a localização "{localizacao.nome}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(localizacao.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditLocalizacaoDialog
        localizacao={editingLocalizacao}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};
