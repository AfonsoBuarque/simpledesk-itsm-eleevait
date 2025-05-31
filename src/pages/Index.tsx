
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
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

const Index = () => {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Redirecionar usuários não autenticados para /portal
  if (!loading && !user) {
    return <Navigate to="/portal" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'incidents':
      case 'requests':
      case 'problems':
      case 'changes':
        return <TicketList ticketType={activeModule} />;
      case 'knowledge':
        return <KnowledgeBase />;
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
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
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
    </div>
  );
};

export default Index;
