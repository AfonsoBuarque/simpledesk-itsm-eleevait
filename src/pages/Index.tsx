
import React from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import TicketList from '@/components/Tickets/TicketList';
import SLADashboard from '@/components/SLA/SLADashboard';
import KnowledgeBase from '@/components/Knowledge/KnowledgeBase';
import CMDBDashboard from '@/components/CMDB/CMDBDashboard';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeModule, setActiveModule] = React.useState('dashboard');

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
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
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={handleMenuClick} />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
