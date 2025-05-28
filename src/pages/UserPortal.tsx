
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserPortalForm } from '@/components/UserPortal/UserPortalForm';

const UserPortal = () => {
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-blue-600">Portal de Requisições</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Olá, {profile?.full_name || 'Usuário'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Abrir Nova Requisição
          </h2>
          <p className="text-lg text-gray-600">
            Use este formulário para solicitar serviços ou suporte técnico
          </p>
        </div>

        <UserPortalForm />

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-medium text-blue-900 mb-2">Informações Importantes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Suas requisições serão analisadas pela equipe responsável</li>
              <li>• Você receberá atualizações sobre o status da sua solicitação</li>
              <li>• Para urgências críticas, entre em contato diretamente com o suporte</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPortal;
