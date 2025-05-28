import React from 'react';
import { Bell, User, Search, Menu, PanelLeftClose, PanelLeft, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
interface HeaderProps {
  onMenuClick: () => void;
  currentClient?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isSidebarOpen?: boolean;
  onCloseSidebar?: () => void;
}
const Header = ({
  onMenuClick,
  currentClient = "TechCorp",
  isCollapsed,
  onToggleCollapse,
  isSidebarOpen = false,
  onCloseSidebar
}: HeaderProps) => {
  const {
    profile,
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    const {
      error
    } = await signOut();
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
  return <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
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
            {currentClient}
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
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">SLA em risco</p>
                <p className="text-xs text-gray-600">Ticket #INC001234 - 2h restantes</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Novo ticket atribuído</p>
                <p className="text-xs text-gray-600">REQ001235 - Acesso ao sistema</p>
              </div>
            </DropdownMenuItem>
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
    </header>;
};
export default Header;