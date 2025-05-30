import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  console.log('ProtectedRoute - Auth state:', { user, profile, loading });

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
      console.log('ProtectedRoute - No user, redirecting to /auth');
      return <Navigate to="/auth" replace />;
    }

    // Redirecionar usuários com função "user" para o portal
    if (profile?.role === 'user') {
      console.log('ProtectedRoute - User role is "user", redirecting to /portal');
      return <Navigate to="/portal" replace />;
    }

    console.log('ProtectedRoute - User has admin/tech role, showing admin content');
    // Permitir acesso apenas para usuários que não são "user" (admin, technician, etc.)
    return <>{children}</>;
  }, [loading, user, profile, children]);

  return renderContent;
};

export default ProtectedRoute;