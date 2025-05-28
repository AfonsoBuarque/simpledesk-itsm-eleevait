
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAtivos, useDeleteAtivo } from '@/hooks/useAtivos';
import { NewAtivoDialog } from './NewAtivoDialog';
import { EditAtivoDialog } from './EditAtivoDialog';
import { Ativo } from '@/types/ativo';

const AtivoManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingAtivo, setEditingAtivo] = useState<Ativo | null>(null);

  const { data: ativos, isLoading, error } = useAtivos();
  const deleteAtivoMutation = useDeleteAtivo();

  const filteredAtivos = ativos?.filter(ativo =>
    ativo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ativo.patrimonio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ativo.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteAtivo = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ativo?')) {
      await deleteAtivoMutation.mutateAsync(id);
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'default';
      case 'inativo':
        return 'secondary';
      case 'manutencao':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Ativos</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando ativos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Ativos</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Erro ao carregar ativos: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ativos</h1>
          <p className="text-gray-600">Gerencie os ativos do CMDB</p>
        </div>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ativo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ativos</CardTitle>
          <CardDescription>
            Gerencie todos os ativos de TI da organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, patrimônio ou número de série..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAtivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Nenhum ativo encontrado para a busca.' : 'Nenhum ativo cadastrado.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAtivos.map((ativo) => (
                    <TableRow key={ativo.id}>
                      <TableCell className="font-medium">{ativo.nome}</TableCell>
                      <TableCell>{ativo.tipo_id || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(ativo.status_operacional)}>
                          {ativo.status_operacional || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{ativo.patrimonio || '-'}</TableCell>
                      <TableCell>{ativo.fabricante?.nome || '-'}</TableCell>
                      <TableCell>{ativo.client?.name || '-'}</TableCell>
                      <TableCell>{ativo.localizacao?.nome || '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingAtivo(ativo)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAtivo(ativo.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NewAtivoDialog 
        open={showNewDialog} 
        onOpenChange={setShowNewDialog} 
      />

      {editingAtivo && (
        <EditAtivoDialog
          ativo={editingAtivo}
          open={!!editingAtivo}
          onOpenChange={() => setEditingAtivo(null)}
        />
      )}
    </div>
  );
};

export default AtivoManagement;
