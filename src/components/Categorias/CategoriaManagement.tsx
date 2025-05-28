
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import { useCategorias } from '@/hooks/useCategorias';
import { Categoria } from '@/types/categoria';
import { NewCategoriaDialog } from './NewCategoriaDialog';
import { EditCategoriaDialog } from './EditCategoriaDialog';

const CategoriaManagement = () => {
  const { categorias, isLoading, deleteCategoria } = useCategorias();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategoria.mutateAsync(id);
    }
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      incidente: 'bg-red-100 text-red-800',
      solicitacao: 'bg-blue-100 text-blue-800',
      problema: 'bg-yellow-100 text-yellow-800',
      requisicao: 'bg-green-100 text-green-800',
      mudanca: 'bg-purple-100 text-purple-800'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestão de Categorias</h1>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {categorias.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria Pai</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell className="font-medium">{categoria.nome}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(categoria.tipo)}>
                        {categoria.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {categoria.descricao || '-'}
                    </TableCell>
                    <TableCell>
                      {categoria.categoria_pai?.nome || '-'}
                    </TableCell>
                    <TableCell>
                      {categoria.cliente?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {categoria.grupo?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {categoria.sla?.nome || '-'}
                    </TableCell>
                    <TableCell>
                      {categoria.usuario_responsavel?.name || '-'}
                    </TableCell>
                    <TableCell>{categoria.ordem_exibicao}</TableCell>
                    <TableCell>
                      <Badge variant={categoria.ativo ? 'default' : 'secondary'}>
                        {categoria.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCategoria(categoria)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(categoria.id)}
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
            <Tags className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Comece criando sua primeira categoria de serviço.
            </p>
            <Button onClick={() => setIsNewDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Categoria
            </Button>
          </CardContent>
        </Card>
      )}

      <NewCategoriaDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
      />

      {editingCategoria && (
        <EditCategoriaDialog
          categoria={editingCategoria}
          isOpen={!!editingCategoria}
          onClose={() => setEditingCategoria(null)}
        />
      )}
    </div>
  );
};

export default CategoriaManagement;
