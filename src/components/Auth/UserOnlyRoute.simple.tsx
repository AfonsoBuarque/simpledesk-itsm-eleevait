import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface UserOnlyRouteProps {
  children: React.ReactNode;
}

const UserOnlyRoute = ({ children }: UserOnlyRouteProps) => {
  const { user, loading } = useAuth();
  const currentPath = window.location.pathname;

  console.log('UserOnlyRoute - Auth state:', {user, loading, currentPath});

  // Mostrar indicador de carregamento enquanto os dados de autenticação estão sendo carregados
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para a página de login se não estiver autenticado
  if (!user) {
    console.log('Usuário não autenticado, redirecionando para /auth');
    return <Navigate to="/auth" replace />;
  }

  // Se chegou aqui, o usuário está autenticado e pode acessar a rota
  console.log(`Permitindo acesso para usuário na rota ${currentPath}`);
  return <>{children}</>;
};

export default UserOnlyRoute;
