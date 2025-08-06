import React, { useEffect, useState } from 'react';
import { Bell, User, Search, Menu, PanelLeftClose, PanelLeft, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const [clientLoading, setClientLoading] = useState<boolean>(false);

  // NOVO: Buscar nome do cliente real do usuário logado
  useEffect(() => {
    const fetchAndSetClient = async () => {
      if (!profile?.id) {
        setUserClient('');
        return;
      }
      setClientLoading(true);
      try {
        // Buscar usuário na tabela users (para pegar o client_id)
        const { data: userDb } = await supabase
          .from('users')
          .select('client_id')
          .eq('id', profile.id)
          .maybeSingle();
        if (userDb?.client_id) {
          // Buscar nome do cliente na tabela clients
          const { data: clientDb } = await supabase
            .from('clients')
            .select('name')
            .eq('id', userDb.client_id)
            .maybeSingle();
          if (clientDb?.name) {
            setUserClient(clientDb.name);
          } else {
            setUserClient('Cliente não encontrado');
          }
        } else {
          setUserClient('Sem cliente');
        }
      } catch (e) {
        setUserClient('Erro ao buscar cliente');
      }
      setClientLoading(false);
    };

    fetchAndSetClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
    }
  }, [profile?.id]);

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
      // Para erros reais de logout, mostrar mensagem de erro
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
    // Redirecionamento forçado para tela de login (login) após logout
    window.location.replace("/auth");
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
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
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
          <h1 className="text-xl font-bold text-blue-600">Vertice Aruan</h1>
          <Badge variant="secondary" className="text-xs">
            {clientLoading ? 'Carregando...' : userClient || 'Sem cliente'}
          </Badge>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar tickets, artigos, CIs..." className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors" />
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
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=random`} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {profile?.full_name || 'Usuário'}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-600 font-normal">
              {profile?.role === 'admin' && 'Administrador'}
              {profile?.role === 'client_admin' && 'Admin do Cliente'}
              {profile?.role === 'manager' && 'Gerente'}
              {profile?.role === 'technician' && <Badge variant="outline" className="ml-1">Técnico</Badge>}
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
