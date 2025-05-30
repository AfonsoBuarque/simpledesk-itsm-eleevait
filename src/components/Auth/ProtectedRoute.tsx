
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  
  console.log('ProtectedRoute - Auth state:', {user, profile, loading});

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

    // Redirecionar usuários com função "user" para o portal
    if (profile.role === 'user') {
      return <Navigate to="/portal" replace />;
    }

    // Permitir acesso para usuários que NÃO são "user" (admin, technician, etc.)
    // Estes devem acessar a área administrativa
    return <>{children}</>;
  }, [loading, user, profile, children]);

  return renderContent;
};

export default ProtectedRoute;
