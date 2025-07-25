import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, UserPlus, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface ClientsOverviewProps {
  showAll?: boolean;
}

export const ClientsOverview = ({ showAll = true }: ClientsOverviewProps) => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const { data: clients, isLoading, refetch } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          users:users(count)
        `)
        .order('created_at', { ascending: false })
        .limit(showAll ? 100 : 5);

      if (error) throw error;
      return data;
    }
  });

  const handleViewClient = (clientId: string) => {
    setSelectedClient(clientId);
    // Aqui você pode implementar uma modal ou navegação para detalhes do cliente
    toast({
      title: "Visualizar Cliente",
      description: `Implementar detalhes do cliente ${clientId}`,
    });
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/?section=clients&action=edit&id=${clientId}`);
  };

  const handleManageUsers = (clientId: string) => {
    navigate(`/?section=users&filter=client:${clientId}`);
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome do Cliente',
      render: (client: any) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{client.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'status',
      header: 'Status',
      render: (client: any) => (
        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
          {client.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'users',
      header: 'Usuários',
      render: (client: any) => (
        <Badge variant="outline">
          {client.users?.[0]?.count || 0} usuários
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Data de Criação',
      render: (client: any) => {
        const date = new Date(client.created_at);
        return date.toLocaleDateString('pt-BR');
      },
    },
  ];

  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      label: 'Visualizar',
      onClick: (client: any) => handleViewClient(client.id)
    },
    {
      icon: <Edit className="h-4 w-4" />,
      label: 'Editar',
      onClick: (client: any) => handleEditClient(client.id)
    },
    {
      icon: <UserPlus className="h-4 w-4" />,
      label: 'Gerenciar Usuários',
      onClick: (client: any) => handleManageUsers(client.id)
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: showAll ? 10 : 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!showAll) {
    // Versão resumida para o dashboard
    return (
      <div className="space-y-3">
        {clients?.slice(0, 5).map((client) => (
          <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                {client.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => handleViewClient(client.id)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {clients && clients.length > 5 && (
          <Button variant="outline" className="w-full" onClick={() => navigate('/admin')}>
            Ver todos os clientes
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Clientes ({clients?.length || 0})</h3>
        <Button onClick={() => navigate('/?section=clients&action=new')}>
          Novo Cliente
        </Button>
      </div>
      <DataTable columns={columns} data={clients || []} actions={actions} />
    </div>
  );
};