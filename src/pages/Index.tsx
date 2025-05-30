
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import KnowledgeBase from '@/components/Knowledge/KnowledgeBase';
import CMDBDashboard from '@/components/CMDB/CMDBDashboard';
import AtivoManagement from '@/components/Ativos/AtivoManagement';
import { ContratoManagement } from '@/components/Contratos/ContratoManagement';
import FabricanteManagement from '@/components/Fabricantes/FabricanteManagement';
import { FornecedorManagement } from '@/components/Fornecedores/FornecedorManagement';
import { LocalizacaoManagement } from '@/components/Localizacoes/LocalizacaoManagement';
import UserManagement from '@/components/Users/UserManagement';
import GroupManagement from '@/components/Groups/GroupManagement';
import ClientManagement from '@/components/Clients/ClientManagement';
import CategoriaManagement from '@/components/Categorias/CategoriaManagement';
import SolicitacaoManagement from '@/components/Solicitacoes/SolicitacaoManagement';
import RequisicoesManagement from '@/components/Requisicoes/RequisicoesManagement';

const Index: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  console.log('📄 Index component rendering with activeItem:', activeItem);

  useEffect(() => {
    console.log('🔄 Index component mounted');
    return () => {
      console.log('🔄 Index component unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('🎯 Active item changed to:', activeItem);
  }, [activeItem]);

  const handleMenuItemClick = (item: string) => {
    console.log('🖱️ Menu item clicked:', item);
    setActiveItem(item);
    setIsSidebarOpen(false); // Close mobile sidebar after selection
  };

  const renderContent = () => {
    console.log('🎨 Rendering content for:', activeItem);
    
    try {
      switch (activeItem) {
        case 'dashboard':
          console.log('📊 Loading Dashboard...');
          return <DashboardOverview />;
        case 'knowledge':
          console.log('📚 Loading Knowledge Base...');
          return <KnowledgeBase />;
        case 'cmdb':
          console.log('🗃️ Loading CMDB...');
          return <CMDBDashboard />;
        case 'ativos':
          console.log('💼 Loading Ativos...');
          return <AtivoManagement />;
        case 'contratos':
          console.log('📋 Loading Contratos...');
          return <ContratoManagement />;
        case 'fabricantes':
          console.log('🏭 Loading Fabricantes...');
          return <FabricanteManagement />;
        case 'fornecedores':
          console.log('🤝 Loading Fornecedores...');
          return <FornecedorManagement />;
        case 'localizacao':
          console.log('📍 Loading Localizacao...');
          return <LocalizacaoManagement />;
        case 'users':
          console.log('👥 Loading Users...');
          return <UserManagement />;
        case 'groups':
          console.log('👪 Loading Groups...');
          return <GroupManagement />;
        case 'clients':
          console.log('🏢 Loading Clients...');
          return <ClientManagement />;
        case 'categoria':
          console.log('🏷️ Loading Categorias...');
          return <CategoriaManagement />;
        case 'solicitacoes':
          console.log('📝 Loading Solicitações...');
          return <SolicitacaoManagement />;
        case 'requests':
          console.log('🎫 Loading Requisições...');
          return <RequisicoesManagement />;
        default:
          console.log('🔄 Loading default Dashboard...');
          return <DashboardOverview />;
      }
    } catch (error) {
      console.error('💥 Error rendering content for', activeItem, ':', error);
      return <div className="p-4 text-red-500">Erro ao carregar componente: {error.message}</div>;
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
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
