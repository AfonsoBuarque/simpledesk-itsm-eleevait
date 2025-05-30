
import React, { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, profile } = useAuth();
  
  const authState = useMemo(() => ({
    hasUser: !!user,
    userId: user?.id,
    loading,
    hasProfile: !!profile,
    profileRole: profile?.role
  }), [user, loading, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-600">Carregando aplicação...</div>
          <div className="text-sm text-gray-500 mt-2">Aguarde um momento</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has admin/manager/technician role
  if (profile && !['admin', 'manager', 'technician'].includes(profile.role || '')) {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
