import React, { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import KnowledgeBase from '@/components/Knowledge/KnowledgeBase';
import SLADashboard from '@/components/SLA/SLADashboard';
import CMDBDashboard from '@/components/CMDB/CMDBDashboard';
import AtivoManagement from '@/components/Ativos/AtivoManagement';
import { ContratoManagement } from '@/components/Contratos/ContratoManagement';
import FabricanteManagement from '@/components/Fabricantes/FabricanteManagement';
import { FornecedorManagement } from '@/components/Fornecedores/FornecedorManagement';
import { LocalizacaoManagement } from '@/components/Localizacoes/LocalizacaoManagement';
import UserManagement from '@/components/Users/UserManagement';
import GroupManagement from '@/components/Groups/GroupManagement';
import ClientManagement from '@/components/Clients/ClientManagement';
import SLAManagement from '@/components/SLAs/SLAManagement';
import CategoriaManagement from '@/components/Categorias/CategoriaManagement';
import SolicitacaoManagement from '@/components/Solicitacoes/SolicitacaoManagement';
import RequisicoesManagement from '@/components/Requisicoes/RequisicoesManagement';

const Index: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
    setIsSidebarOpen(false); // Close mobile sidebar after selection
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'sla':
        return <SLADashboard />;
      case 'knowledge':
        return <KnowledgeBase />;
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
      case 'users':
        return <UserManagement />;
      case 'groups':
        return <GroupManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'sla-config':
        return <SLAManagement />;
      case 'categoria':
        return <CategoriaManagement />;
      case 'solicitacoes':
        return <SolicitacaoManagement />;
      case 'requests':
        return <RequisicoesManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeModule={activeItem}
        onModuleChange={handleMenuItemClick}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
