
import React, { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  console.log('🔒 ProtectedRoute component rendering...');
  
  const { user, loading, profile } = useAuth();
  
  const authState = useMemo(() => ({
    hasUser: !!user,
    userId: user?.id,
    loading,
    hasProfile: !!profile,
    profileRole: profile?.role
  }), [user, loading, profile]);
  
  console.log('🔒 ProtectedRoute state:', authState);

  useEffect(() => {
    console.log('🔒 ProtectedRoute useEffect - auth state changed:', { 
      user: !!user, 
      loading, 
      profile: !!profile 
    });
  }, [user, loading, profile]);

  if (loading) {
    console.log('⏳ ProtectedRoute - still loading, showing spinner...');
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
    console.log('🚫 ProtectedRoute - no user, redirecting to auth...');
    return <Navigate to="/auth" replace />;
  }

  // Check if user has admin/manager/technician role
  if (profile && !['admin', 'manager', 'technician'].includes(profile.role || '')) {
    console.log('🚫 ProtectedRoute - user role not allowed:', profile.role, 'redirecting to portal...');
    return <Navigate to="/portal" replace />;
  }

  console.log('✅ ProtectedRoute - user authorized, rendering children...');
  return <>{children}</>;
};

export default ProtectedRoute;
