
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface UserOnlyRouteProps {
  children: React.ReactNode;
}

const UserOnlyRoute = ({ children }: UserOnlyRouteProps) => {
  const { user, profile, loading } = useAuth();

  console.log('UserOnlyRoute - Auth state:', {user, loading});

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar se o perfil foi carregado
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Redirecionar usuários que NÃO são "user" para a área administrativa
  if (profile.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  // Permitir acesso apenas para usuários com role "user"
  return <>{children}</>;
};

export default UserOnlyRoute;
