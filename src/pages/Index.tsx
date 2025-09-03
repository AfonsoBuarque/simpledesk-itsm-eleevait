import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { PageLoading } from '@/components/ui/page-loading';
import { usePageTransition } from '@/hooks/usePageTransition';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import TicketList from '@/components/Tickets/TicketList';
import KnowledgeBase from '@/components/Knowledge/KnowledgeBase';
import UserManagement from '@/components/Users/UserManagement';
import GroupManagement from '@/components/Groups/GroupManagement';
import ProfileManagement from '@/components/Profiles/ProfileManagement';
import ClientManagement from '@/components/Clients/ClientManagement';
import CategoriaManagement from '@/components/Categorias/CategoriaManagement';
import RequisicoesManagement from '@/components/Requisicoes/RequisicoesManagement';
import SolicitacaoManagement from '@/components/Solicitacoes/SolicitacaoManagement';
import CMDBDashboard from '@/components/CMDB/CMDBDashboard';
import AtivoManagement from '@/components/Ativos/AtivoManagement';
import { ContratoManagement } from '@/components/Contratos/ContratoManagement';
import FabricanteManagement from '@/components/Fabricantes/FabricanteManagement';
import { FornecedorManagement } from '@/components/Fornecedores/FornecedorManagement';
import { LocalizacaoManagement } from '@/components/Localizacoes/LocalizacaoManagement';
import SLAManagement from '@/components/SLAs/SLAManagement';
import { ChatBot } from '@/components/ChatBot/ChatBot';
import { WebhookTest } from '@/components/WebhookTest';
import IncidentesManagement from '@/components/Incidentes/IncidentesManagement';
import ProblemasManagement from '@/components/Problemas/ProblemasManagement';
import MudancasManagement from '@/components/Mudancas/MudancasManagement';
import ReportsManagement from '@/components/Reports/ReportsManagement';

const Index = () => {
  const { user, profile, loading, profileLoading } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isLoading: isTransitioning, loadingMessage, startTransition, endTransition } = usePageTransition();

  // Redirecionar usuários não autenticados para /portal
  if (!loading && !user) {
    return <Navigate to="/portal" replace />;
  }

  // Aguardar carregamento do perfil para verificar role
  if (loading || profileLoading) {
    return <PageLoading message="Autenticando..." />;
  }

  // Redirecionar usuários com role "user" para /portal
  if (profile?.role === 'user') {
    return <Navigate to="/portal" replace />;
  }

  const handleModuleChange = (module: string) => {
    if (module === activeModule) return;
    
    // Mapear módulos para mensagens de loading personalizadas
    const loadingMessages: { [key: string]: string } = {
      'dashboard': 'Carregando Dashboard...',
      'incidents': 'Carregando Incidentes...',
      'requests': 'Carregando Requisições...',
      'problems': 'Carregando Problemas...',
      'changes': 'Carregando Mudanças...',
      'knowledge': 'Carregando Base de Conhecimento...',
      'reports': 'Carregando Relatórios...',
      'users': 'Carregando Usuários...',
      'groups': 'Carregando Grupos...',
      'profiles': 'Carregando Perfis...',
      'clients': 'Carregando Clientes...',
      'categoria': 'Carregando Categorias...',
      'sla': 'Carregando SLAs...',
      'solicitacoes': 'Carregando Solicitações...',
      'cmdb': 'Carregando CMDB...',
      'ativos': 'Carregando Ativos...',
      'contratos': 'Carregando Contratos...',
      'fabricantes': 'Carregando Fabricantes...',
      'fornecedores': 'Carregando Fornecedores...',
      'localizacao': 'Carregando Localizações...'
    };

    startTransition(loadingMessages[module] || 'Carregando...');
    setActiveModule(module);
    
    // Simular tempo de carregamento para permitir que o componente seja renderizado
    setTimeout(() => {
      endTransition();
    }, 500);
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <div>
            <DashboardOverview />
            <div className="mt-6">
              <WebhookTest />
            </div>
          </div>
        );
      case 'admin':
        // Redirecionar para a página do console administrativo
        window.location.href = '/admin';
        return null;
      case 'incidents':
        return <IncidentesManagement />;
      case 'requests':
        return <RequisicoesManagement />;
      case 'problems':
        return <ProblemasManagement />;
      case 'changes':
        return <MudancasManagement />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'reports':
        return <ReportsManagement />;
      case 'users':
        return <UserManagement />;
      case 'groups':
        return <GroupManagement />;
      case 'profiles':
        return <ProfileManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'categoria':
        return <CategoriaManagement />;
      case 'sla':
        return <SLAManagement />;
      case 'solicitacoes':
        return <SolicitacaoManagement />;
      case 'cmdb':
        return <CMDBDashboard />;
      case 'ativos':
        return <AtivoManagement />;
      case 'contratos':
        return <ContratoManagement />;
      case 'fabricantes':
        return <FabricanteManagement />;
      case 'fornecedores':
        return <FornecedorManagement />;
      case 'localizacao':
        return <LocalizacaoManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="h-screen min-h-screen bg-gray-50 flex w-full overflow-hidden">
        <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Chat Bot */}
      <ChatBot />
      
      {/* Page Loading Overlay */}
      {isTransitioning && <PageLoading message={loadingMessage} />}
    </div>
  );
};

export default Index;
