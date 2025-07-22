import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// Layout components
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";

// Auth components
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import UserOnlyRoute from "@/components/Auth/UserOnlyRoute";

// Page components
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import SetPassword from "@/pages/SetPassword";
import NotFound from "@/pages/NotFound";
import UserPortal from "@/pages/UserPortal";

// Management components
import RequisicoesManagement from "@/components/Requisicoes/RequisicoesManagement";
import IncidentesManagement from "@/components/Incidentes/IncidentesManagement";
import { ProblemasManagement } from "@/components/Problemas/ProblemasManagement";
import UserManagement from "@/components/Users/UserManagement";
import GroupManagement from "@/components/Groups/GroupManagement";
import ClientManagement from "@/components/Clients/ClientManagement";
import SLAManagement from "@/components/SLAs/SLAManagement";
import CategoriaManagement from "@/components/Categorias/CategoriaManagement";
import CMDBDashboard from "@/components/CMDB/CMDBDashboard";
import AtivoManagement from "@/components/Ativos/AtivoManagement";
import { LocalizacaoManagement } from "@/components/Localizacoes/LocalizacaoManagement";
import FabricanteManagement from "@/components/Fabricantes/FabricanteManagement";
import { FornecedorManagement } from "@/components/Fornecedores/FornecedorManagement";
import { ContratoManagement } from "@/components/Contratos/ContratoManagement";
import KnowledgeBase from "@/components/Knowledge/KnowledgeBase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/set-password" element={<SetPassword />} />
          
          <Route path="/user-portal" element={
            <UserOnlyRoute>
              <UserPortal />
            </UserOnlyRoute>
          } />

          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-50">
                <Sidebar 
                  isOpen={true}
                  onClose={() => {}}
                  activeModule=""
                  onModuleChange={() => {}}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header 
                    onMenuClick={() => {}}
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                  />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/solicitacoes" element={<RequisicoesManagement />} />
                      <Route path="/incidentes" element={<IncidentesManagement />} />
                      <Route path="/problemas" element={<ProblemasManagement />} />
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/groups" element={<GroupManagement />} />
                      <Route path="/clients" element={<ClientManagement />} />
                      <Route path="/slas" element={<SLAManagement />} />
                      <Route path="/categorias" element={<CategoriaManagement />} />
                      <Route path="/cmdb" element={<CMDBDashboard />} />
                      <Route path="/ativos" element={<AtivoManagement />} />
                      <Route path="/localizacoes" element={<LocalizacaoManagement />} />
                      <Route path="/fabricantes" element={<FabricanteManagement />} />
                      <Route path="/fornecedores" element={<FornecedorManagement />} />
                      <Route path="/contratos" element={<ContratoManagement />} />
                      <Route path="/knowledge" element={<KnowledgeBase />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
