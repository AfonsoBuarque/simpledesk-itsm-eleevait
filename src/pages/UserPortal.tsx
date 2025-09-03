import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, LogOut, BarChart3, Plus, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useClientContext } from '@/contexts/ClientContext';
import { UserPortalForm } from '@/components/UserPortal/UserPortalForm';
import UserPortalDashboard from '@/components/UserPortal/UserPortalDashboard';
import { UserTicketsList } from '@/components/UserPortal/UserTicketsList';
import { KnowledgeBaseSearch } from '@/components/UserPortal/KnowledgeBaseSearch';
import { NovaRequisicaoModal } from '@/components/UserPortal/NovaRequisicaoModal';

const UserPortal = () => {
  const { signOut, profile } = useAuth();
  const { currentClientName, loading: clientLoading } = useClientContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNovaRequisicaoModalOpen, setIsNovaRequisicaoModalOpen] = useState(false);

  // Removido: Log de role do usuário logado (apenas este!)
  // if (profile) {
  //   console.log('[UserPortal] Usuário logado:', profile);
  // }

  // Atualizar: garantir redirecionamento para /auth após logout
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const handleNovaRequisicaoClick = () => {
    setIsNovaRequisicaoModalOpen(true);
  };

  const handleAdminClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-fade-in relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-right bg-contain opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/logos/images/fundo_apresentacao_eleeva.png)',
          backgroundPosition: 'right center',
          backgroundSize: 'auto 100%'
        }}
      />
      {/* Header moderno */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-20 transition-all duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
                <img src="/logos/logo_Aruan_header.png" alt="Aruan Logo" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Portal de Auto Atendimento
                </h1>
                <p className="text-xs text-gray-500">Sistema de Atendimento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  <span className="gradient-heading">{profile?.full_name || 'Usuário'}</span>
                </p>
                <p className="text-xs text-gray-500">{currentClientName || 'Cliente'}</p>
              </div>
              
              {/* Link para Administração - apenas para admin ou client_admin */}
              {(profile?.role === 'admin' || profile?.role === 'client_admin') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdminClick}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Administração</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut} 
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10" style={{ '--tw-animation-delay': '0.1s' } as React.CSSProperties}>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in" style={{ '--tw-animation-delay': '0.2s' } as React.CSSProperties}>
          <div>
            <h2 className="text-3xl font-bold gradient-heading mb-2">
              Bem-vindo ao seu Portal
            </h2>
            <p className="text-lg text-gray-600">
              Gerencie suas requisições e acompanhe o status dos seus chamados
            </p>
          </div>
          
          <Button
            onClick={handleNovaRequisicaoClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-6 py-3 hover:translate-y-[-2px]"
          >
            <Plus className="h-5 w-5" />
            Nova Requisição
          </Button>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ '--tw-animation-delay': '0.3s' } as React.CSSProperties}>
          <div 
            onClick={handleNovaRequisicaoClick}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Nova Requisição</h3>
            </div>
            <p className="text-sm text-blue-700">Abrir uma nova solicitação de serviço</p>
          </div>

          <div 
            onClick={() => setActiveTab('tickets')}
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-green-900">Meus Tickets</h3>
            </div>
            <p className="text-sm text-green-700">Acompanhar status das solicitações</p>
          </div>

          <div 
            onClick={() => setActiveTab('knowledge')}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900">Base de Conhecimento</h3>
            </div>
            <p className="text-sm text-purple-700">Buscar soluções e tutoriais</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-in" style={{ '--tw-animation-delay': '0.4s' } as React.CSSProperties}>
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-white/50 backdrop-blur-sm border shadow-sm rounded-xl overflow-hidden">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              <AlertTriangle className="h-4 w-4" />
              Meus Tickets
            </TabsTrigger>
            <TabsTrigger 
              value="knowledge" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
            >
              <Settings className="h-4 w-4" />
              Ajuda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <UserPortalDashboard />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <UserTicketsList />
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <KnowledgeBaseSearch />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Nova Requisição */}
      <NovaRequisicaoModal 
        isOpen={isNovaRequisicaoModalOpen}
        onClose={() => setIsNovaRequisicaoModalOpen(false)}
      />
    </div>
  );
};

export default UserPortal;
