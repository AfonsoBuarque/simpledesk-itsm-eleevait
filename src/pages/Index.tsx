import React, { useState } from 'react';
import { Layout } from '@/components/Layout/Sidebar';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import KnowledgeBase from '@/components/Knowledge/KnowledgeBase';
import SLADashboard from '@/components/SLA/SLADashboard';
import CMDBDashboard from '@/components/CMDB/CMDBDashboard';
import AtivoManagement from '@/components/Ativos/AtivoManagement';
import ContratoManagement from '@/components/Contratos/ContratoManagement';
import FabricanteManagement from '@/components/Fabricantes/FabricanteManagement';
import FornecedorManagement from '@/components/Fornecedores/FornecedorManagement';
import LocalizacaoManagement from '@/components/Localizacoes/LocalizacaoManagement';
import UserManagement from '@/components/Users/UserManagement';
import GroupManagement from '@/components/Groups/GroupManagement';
import ClientManagement from '@/components/Clients/ClientManagement';
import SLAManagement from '@/components/SLAs/SLAManagement';
import CategoriaManagement from '@/components/Categorias/CategoriaManagement';

const Index: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
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
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Layout onMenuItemClick={handleMenuItemClick}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
