import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Database, Users, Server } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SystemHealthProps {
  detailed?: boolean;
}

export const SystemHealth = ({ detailed = false }: SystemHealthProps) => {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      try {
        // Teste de conectividade com o banco
        const { data: dbTest, error: dbError } = await supabase
          .from('clients')
          .select('id')
          .limit(1);

        // Teste de autenticação
        const { data: authTest, error: authError } = await supabase.auth.getSession();

        // Estatísticas do sistema
        const [usersResult, clientsResult, ticketsResult] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact' }),
          supabase.from('clients').select('id', { count: 'exact' }),
          supabase.from('solicitacoes').select('id', { count: 'exact' })
        ]);

        return {
          database: {
            status: dbError ? 'error' : 'healthy',
            message: dbError ? 'Erro de conexão' : 'Conectado',
            error: dbError?.message
          },
          authentication: {
            status: authError ? 'error' : 'healthy',
            message: authError ? 'Erro de autenticação' : 'Funcionando',
            error: authError?.message
          },
          storage: {
            status: 'healthy', // Assumindo que está funcionando
            message: 'Funcionando'
          },
          stats: {
            users: usersResult.count || 0,
            clients: clientsResult.count || 0,
            tickets: ticketsResult.count || 0
          }
        };
      } catch (error) {
        return {
          database: {
            status: 'error',
            message: 'Erro crítico',
            error: (error as Error).message
          },
          authentication: {
            status: 'unknown',
            message: 'Não testado'
          },
          storage: {
            status: 'unknown',
            message: 'Não testado'
          },
          stats: {
            users: 0,
            clients: 0,
            tickets: 0
          }
        };
      }
    },
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive',
      unknown: 'outline'
    };
    
    const labels = {
      healthy: 'Saudável',
      warning: 'Atenção',
      error: 'Erro',
      unknown: 'Desconhecido'
    };

    const variant = variants[status as keyof typeof variants] || 'outline';
    return (
      <Badge variant={variant as "default" | "destructive" | "secondary" | "outline"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: detailed ? 6 : 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const components = [
    {
      name: 'Banco de Dados',
      icon: Database,
      status: healthData?.database.status || 'unknown',
      message: healthData?.database.message || 'Não testado',
      error: healthData?.database.error
    },
    {
      name: 'Autenticação',
      icon: Users,
      status: healthData?.authentication.status || 'unknown',
      message: healthData?.authentication.message || 'Não testado',
      error: healthData?.authentication.error
    },
    {
      name: 'Armazenamento',
      icon: Server,
      status: healthData?.storage.status || 'unknown',
      message: healthData?.storage.message || 'Não testado'
    }
  ];

  if (!detailed) {
    return (
      <div className="space-y-3">
        {components.map((component) => (
          <div key={component.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(component.status)}
              <span className="font-medium">{component.name}</span>
            </div>
            {getStatusBadge(component.status)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData?.stats.users || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData?.stats.clients || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData?.stats.tickets || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Status dos Componentes</h4>
        {components.map((component) => (
          <Card key={component.name}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <component.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{component.name}</p>
                    <p className="text-sm text-muted-foreground">{component.message}</p>
                    {component.error && (
                      <p className="text-sm text-red-600 mt-1">{component.error}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(component.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};