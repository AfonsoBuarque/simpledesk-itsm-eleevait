
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertTriangle } from 'lucide-react';

interface UserOnlyRouteProps {
  children: React.ReactNode;
}

const UserOnlyRoute = ({ children }: UserOnlyRouteProps) => {
  const { user, profile, loading, error } = useAuth();

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

  console.log('UserOnlyRoute - Verificando perfil:', profile);
  
  if (profile && profile.role !== 'user') {
    console.log('Redirecionando para home - usuário não é comum');
    return <Navigate to="/" replace />;
  }

  console.log('Permitindo acesso ao portal de usuário');
  return <>{children}</>;
};

export default UserOnlyRoute;
