
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading, error } = useAuth();

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

    // Redirecionar usuários com função "user" para o portal
    console.log('Verificando redirecionamento - Perfil:', profile);
    
    if (profile && profile.role === 'user') {
      console.log('Redirecionando para portal - usuário comum');
      return <Navigate to="/portal" replace />;
    }

    // Permitir acesso apenas para usuários que não são "user" (admin, technician, etc.)
    console.log('Permitindo acesso à área administrativa');
    return <>{children}</>;
  }, [loading, user, profile, children]);

  return renderContent;
};

export default ProtectedRoute;
