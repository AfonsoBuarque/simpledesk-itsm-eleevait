
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGroups } from '@/hooks/useGroups';
import { NewGroupDialog } from './NewGroupDialog';
import { EditGroupDialog } from './EditGroupDialog';

const GroupManagement = () => {
  const { groups, loading, deleteGroup } = useGroups();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (group.client?.name && group.client.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteGroup = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      await deleteGroup(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando grupos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Grupos
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie os grupos de usuários do sistema ITSM
          </p>
        </div>
        <Button 
          onClick={() => setShowNewGroupDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Grupos</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredGroups.length} grupo(s) encontrado(s)
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description || '-'}</TableCell>
                  <TableCell>
                    {group.client ? (
                      <Badge variant="outline">{group.client.name}</Badge>
                    ) : (
                      <span className="text-gray-400">Sem cliente</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{group.user_count || 0} usuários</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={group.status === 'active' ? 'default' : 'secondary'}
                      className={group.status === 'active' ? 'bg-green-500' : ''}
                    >
                      {group.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGroup(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGroups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchTerm ? 'Nenhum grupo encontrado com os critérios de busca.' : 'Nenhum grupo cadastrado.'}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewGroupDialog 
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
      />

      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          open={!!editingGroup}
          onOpenChange={(open) => !open && setEditingGroup(null)}
        />
      )}
    </div>
  );
};

export default GroupManagement;
