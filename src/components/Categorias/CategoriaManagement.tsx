
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <Card key={categoria.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{categoria.nome}</CardTitle>
                  <Badge className={getTipoColor(categoria.tipo)}>
                    {categoria.tipo}
                  </Badge>
                </div>
                <div className="flex space-x-1">
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
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoria.descricao && (
                <p className="text-sm text-gray-600">{categoria.descricao}</p>
              )}
              
              <div className="space-y-1 text-xs text-gray-500">
                {categoria.categoria_pai && (
                  <div>Categoria Pai: {categoria.categoria_pai.nome}</div>
                )}
                {categoria.cliente && (
                  <div>Cliente: {categoria.cliente.name}</div>
                )}
                {categoria.grupo && (
                  <div>Grupo: {categoria.grupo.name}</div>
                )}
                {categoria.sla && (
                  <div>SLA: {categoria.sla.nome}</div>
                )}
                {categoria.usuario_responsavel && (
                  <div>Responsável: {categoria.usuario_responsavel.name}</div>
                )}
                <div>Ordem: {categoria.ordem_exibicao}</div>
                <div>Status: {categoria.ativo ? 'Ativo' : 'Inativo'}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categorias.length === 0 && (
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
