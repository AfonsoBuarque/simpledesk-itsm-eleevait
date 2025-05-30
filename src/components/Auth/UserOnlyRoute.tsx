import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';

interface UserOnlyRouteProps {
  children: React.ReactNode;
}

const UserOnlyRoute = ({ children }: UserOnlyRouteProps) => {
  const { user, profile, loading } = useAuth();
  console.log('UserOnlyRoute - Auth state:', { user, profile, loading });

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
    console.log('UserOnlyRoute - No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role !== 'user') {
    console.log('UserOnlyRoute - User role is not "user", redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('UserOnlyRoute - User has "user" role, showing portal content');
  return <>{children}</>;
};

export default UserOnlyRoute;