import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import { Loader2 } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';
import RequisicoesManagement from '@/components/Requisicoes/RequisicoesManagement';

const Index: React.FC = () => {
  const { loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(true);

  // Redirecionar todos os usuários para o portal
  useEffect(() => {
    if (!authLoading) {
      setLocalLoading(false);
    }
    
    if (!authLoading && user) {
      console.log('Index - Redirecionando usuário para portal');
      navigate('/portal', { replace: true });
    } else if (!authLoading && !user) {
      console.log('Index - Usuário não autenticado, redirecionando para login');
      navigate('/auth', { replace: true }); 
    }
  }, [authLoading, user, navigate]);

  // Forçar carregamento para terminar após 8 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 3000);

    // Se o loading do auth terminar, atualizar o estado local
    if (!authLoading && user) {
      setLocalLoading(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [authLoading]);

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
    setIsSidebarOpen(false); // Close mobile sidebar after selection
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardOverview />;
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

  if (localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium text-gray-900">Inicializando o sistema...</p>
          <p className="text-sm text-gray-500">Isso pode levar alguns instantes</p>
          <button 
            onClick={() => setLocalLoading(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continuar mesmo assim
          </button>
        </div>
      </div>
    );
  }

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