
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface UserOnlyRouteProps {
  children: React.ReactNode;
}

const UserOnlyRoute = ({ children }: UserOnlyRouteProps) => {
  const { user, loading, profile } = useAuth();

  console.log('UserOnlyRoute - Auth state:', {user, profile, loading});

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
    console.log('UserOnlyRoute - Usuário não autenticado, redirecionando para login');
    return <Navigate to="/auth" replace />;
  }

  console.log('UserOnlyRoute - Usuário autenticado, permitindo acesso');
  return <>{children}</>;
};

export default UserOnlyRoute;
