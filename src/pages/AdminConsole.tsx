import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';

const AdminConsole = () => {
  const { user } = useAuth();

  // Verificar se o usuário é admin
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
};

export default AdminConsole;