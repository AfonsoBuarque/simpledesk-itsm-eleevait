
import React from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import TicketList from '@/components/Tickets/TicketList';
import SLADashboard from '@/components/SLA/SLADashboard';
import KnowledgeBase from '@/components/Knowledge/KnowledgeBase';
import CMDBDashboard from '@/components/CMDB/CMDBDashboard';
import ClientManagement from '@/components/Clients/ClientManagement';
import UserManagement from '@/components/Users/UserManagement';
import GroupManagement from '@/components/Groups/GroupManagement';
import FabricanteManagement from '@/components/Fabricantes/FabricanteManagement';
import { FornecedorManagement } from '@/components/Fornecedores/FornecedorManagement';
import { LocalizacaoManagement } from '@/components/Localizacoes/LocalizacaoManagement';
import { ContratoManagement } from '@/components/Contratos/ContratoManagement';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [activeModule, setActiveModule] = React.useState('dashboard');

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'tickets':
      case 'incidents':
        return <TicketList ticketType="incidents" />;
      case 'requests':
        return <TicketList ticketType="requests" />;
      case 'problems':
        return <TicketList ticketType="problems" />;
      case 'changes':
        return <TicketList ticketType="changes" />;
      case 'sla':
        return <SLADashboard />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'cmdb':
        return <CMDBDashboard />;
      case 'contratos':
        return <ContratoManagement />;
      case 'fornecedores':
        return <FornecedorManagement />;
      case 'fabricantes':
        return <FabricanteManagement />;
      case 'localizacao':
        return <LocalizacaoManagement />;
      case 'ativos':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Ativos</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Gestão de ativos em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'contacts':
      case 'users':
        return <UserManagement />;
      case 'groups':
        return <GroupManagement />;
      case 'clients':
        return <ClientManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Carregando ServiceMaster ITSM...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          onMenuClick={handleMenuClick}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
