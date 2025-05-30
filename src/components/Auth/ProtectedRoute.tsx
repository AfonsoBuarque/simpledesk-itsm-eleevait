
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoute - Auth state:', {user, loading});

  const renderContent = useMemo(() => {
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
      console.log('ProtectedRoute - Usuário não autenticado, redirecionando para login');
      return <Navigate to="/auth" replace />;
    }

    // Permitir acesso ao conteúdo protegido
    console.log('ProtectedRoute - Usuário autenticado, permitindo acesso');
    return <>{children}</>;
  }, [loading, user]);

  return renderContent;
};

export default ProtectedRoute;
