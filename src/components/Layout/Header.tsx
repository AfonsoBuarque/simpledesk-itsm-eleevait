
import React, { useEffect, useState } from 'react';
import { Bell, User, Search, Menu, PanelLeftClose, PanelLeft, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  onMenuClick: () => void;
  currentClient?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isSidebarOpen?: boolean;
  onCloseSidebar?: () => void;
}

interface Notification {
  id: string;
  titulo: string;
  numero: string;
  status: string;
  prioridade: string;
  criado_em: string;
}

const Header = ({
  onMenuClick,
  currentClient = "TechCorp",
  isCollapsed,
  onToggleCollapse,
  isSidebarOpen = false,
  onCloseSidebar
}: HeaderProps) => {
  const { profile, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userClient, setUserClient] = useState<string>('');

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
      fetchUserClient();
    }
  }, [profile?.id]);

  const fetchUserClient = async () => {
    try {
      console.log('Fetching user client for profile:', profile?.id);
      
      // Buscar dados do usuário diretamente da tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          client_id,
          clients:client_id (
            id,
            name
          )
        `)
        .eq('id', profile?.id)
        .single();

      console.log('User data result:', { userData, userError });

      if (userError) {
        console.error('Error fetching user data:', userError);
        setUserClient('Não informado');
        return;
      }

      // Se tem client_id e dados do cliente
      if (userData?.clients) {
        setUserClient(userData.clients.name);
      } else if (userData?.client_id) {
        // Fallback: buscar cliente separadamente se a query com join falhou
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('name')
          .eq('id', userData.client_id)
          .single();

        if (clientData && !clientError) {
          setUserClient(clientData.name);
        } else {
          setUserClient('Cliente não encontrado');
        }
      } else {
        setUserClient('Sem cliente específico');
      }
    } catch (error) {
      console.error('Erro ao buscar cliente do usuário:', error);
      setUserClient('Erro ao carregar');
    }
  };

  const fetchNotifications = async () => {
    try {
      // Buscar grupos do usuário
      const { data: userGroups } = await supabase
        .from('user_groups')
        .select('group_id')
        .eq('user_id', profile?.id);

      const groupIds = userGroups?.map(ug => ug.group_id) || [];

      // Buscar tickets onde o usuário é atendente OU faz parte do grupo responsável
      const { data: tickets } = await supabase
        .from('solicitacoes')
        .select('id, titulo, numero, status, prioridade, criado_em')
        .or(`atendente_id.eq.${profile?.id},grupo_responsavel_id.in.(${groupIds.join(',')})`)
        .in('status', ['aberta', 'em_andamento', 'pendente'])
        .order('criado_em', { ascending: false })
        .limit(10);

      if (tickets) {
        setNotifications(tickets);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    }
  };

  const getNotificationText = (notification: Notification) => {
    if (notification.prioridade === 'critica') {
      return `Ticket crítico: ${notification.numero}`;
    }
    if (notification.status === 'aberta') {
      return `Novo ticket: ${notification.numero}`;
    }
    return `Ticket pendente: ${notification.numero}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle - shows X when sidebar is open, Menu when closed */}
        <Button variant="ghost" size="sm" onClick={isSidebarOpen && onCloseSidebar ? onCloseSidebar : onMenuClick} className="lg:hidden">
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        {/* Desktop collapse toggle */}
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="hidden lg:flex">
          {isCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-blue-600">SimpleDesk</h1>
          <Badge variant="secondary" className="text-xs">
            {userClient || 'Carregando...'}
          </Badge>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar tickets, artigos, CIs..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id}>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{getNotificationText(notification)}</p>
                    <p className="text-xs text-gray-600">{notification.titulo}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-600">Nenhuma notificação</p>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {profile?.full_name || 'Usuário'}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-600 font-normal">
              {profile?.role === 'admin' && 'Administrador'}
              {profile?.role === 'manager' && 'Gerente'}
              {profile?.role === 'technician' && 'Técnico'}
              {profile?.role === 'user' && 'Usuário'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
