import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, User, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export const UsersOverview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, statusFilter, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleViewUser = (userId: string) => {
    navigate(`/?section=users&action=view&id=${userId}`);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/?section=users&action=edit&id=${userId}`);
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      render: (user: any) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{user.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'role',
      header: 'Função',
      render: (user: any) => {
        const roleColors = {
          admin: 'bg-red-100 text-red-800',
          technician: 'bg-blue-100 text-blue-800',
          user: 'bg-gray-100 text-gray-800'
        };
        return (
          <Badge className={roleColors[user.role as keyof typeof roleColors] || roleColors.user}>
            {user.role === 'admin' ? 'Administrador' : 
             user.role === 'technician' ? 'Técnico' : 'Usuário'}
          </Badge>
        );
      },
    },
    {
      key: 'clients',
      header: 'Cliente',
      render: (user: any) => {
        const client = user.clients;
        return client ? (
          <span className="text-sm">{client.name}</span>
        ) : (
          <Badge variant="outline">Sem cliente</Badge>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: any) => (
        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Data de Criação',
      render: (user: any) => {
        const date = new Date(user.created_at);
        return date.toLocaleDateString('pt-BR');
      },
    },
  ];

  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      label: 'Visualizar',
      onClick: (user: any) => handleViewUser(user.id)
    },
    {
      icon: <Edit className="h-4 w-4" />,
      label: 'Editar',
      onClick: (user: any) => handleEditUser(user.id)
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="technician">Técnico</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Usuários ({users?.length || 0})</h3>
        <Button onClick={() => navigate('/?section=users&action=new')}>
          Novo Usuário
        </Button>
      </div>

      <DataTable columns={columns} data={users || []} actions={actions} />
    </div>
  );
};