import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useProfiles } from '@/hooks/useProfiles';
import { Loader2, Search, UserCheck, Mail, Phone, Calendar, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EditProfileDialog } from './EditProfileDialog';

const ProfileManagement = () => {
  const { profiles, isLoading, error } = useProfiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredProfiles = profiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'technician':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'technician':
        return 'Técnico';
      case 'user':
        return 'Usuário';
      default:
        return role;
    }
  };

  const handleEdit = (profile: any) => {
    setEditingProfile(profile);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    // Refresh the data
    window.location.reload();
  };

  const handleDelete = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        console.error('Error deleting profile:', error);
        toast({
          title: "Erro ao excluir perfil",
          description: "Não foi possível excluir o perfil.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Perfil excluído",
        description: "Perfil foi excluído com sucesso.",
      });

      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Erro ao excluir perfil",
        description: "Erro inesperado ao excluir perfil.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando perfis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erro ao carregar perfis: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Perfis</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os perfis de usuários do sistema.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Lista de Perfis
          </CardTitle>
          <CardDescription>
            {filteredProfiles.length} perfis encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    {profile.full_name || 'Nome não informado'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{profile.department || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(profile.role || 'user')}>
                      {getRoleLabel(profile.role || 'user')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(profile.created_at || '').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(profile)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o perfil de {profile.full_name || profile.email}? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(profile.id)}
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
              ))}
            </TableBody>
          </Table>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum perfil encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Não há perfis cadastrados no sistema.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {editingProfile && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          profile={editingProfile}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default ProfileManagement;
