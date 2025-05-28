
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, LogOut, BarChart3, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserPortalForm } from '@/components/UserPortal/UserPortalForm';
import UserPortalDashboard from '@/components/UserPortal/UserPortalDashboard';
import { NovaRequisicaoModal } from '@/components/UserPortal/NovaRequisicaoModal';

const UserPortal = () => {
  const { signOut, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNovaRequisicaoModalOpen, setIsNovaRequisicaoModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNovaRequisicaoClick = () => {
    setIsNovaRequisicaoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header moderno */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Portal de Requisições
                </h1>
                <p className="text-xs text-gray-500">Sistema de Atendimento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">Cliente</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao seu Portal
            </h2>
            <p className="text-lg text-gray-600">
              Gerencie suas requisições e acompanhe o status dos seus chamados
            </p>
          </div>
          
          <Button
            onClick={handleNovaRequisicaoClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-6 py-3"
          >
            <Plus className="h-5 w-5" />
            Nova Requisição
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/50 backdrop-blur-sm border shadow-sm">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="nova-requisicao"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Formulário Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <UserPortalDashboard />
          </TabsContent>

          <TabsContent value="nova-requisicao" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Formulário Manual de Requisição
              </h3>
              <p className="text-gray-600">
                Use este formulário se preferir preencher diretamente na página
              </p>
            </div>

            <UserPortalForm />

            {/* Footer Info */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Informações Importantes
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium">•</span>
                    Suas requisições serão analisadas pela equipe responsável
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium">•</span>
                    Você receberá atualizações sobre o status da sua solicitação
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-medium">•</span>
                    Para urgências críticas, entre em contato diretamente com o suporte
                  </li>
                </ul>
              </div>
            </div>
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
