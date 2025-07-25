import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';

const AdminConsole = () => {
  const { user, profile, profileLoading } = useAuth();

  // Verificar se o usuário é admin
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Aguardar carregamento do perfil
  if (profileLoading) {
    return <div>Carregando...</div>;
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
};

export default AdminConsole;