import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';

const AdminConsole = () => {
  const { user, profile, profileLoading } = useAuth();

  console.log('AdminConsole - Estado atual:', { user: !!user, profile, profileLoading });

  // Verificar se o usuário é admin
  if (!user) {
    console.log('AdminConsole - Usuário não autenticado, redirecionando para /auth');
    return <Navigate to="/auth" replace />;
  }

  // Aguardar carregamento do perfil
  if (profileLoading) {
    console.log('AdminConsole - Carregando perfil...');
    return <div>Carregando...</div>;
  }

  if (profile?.role !== 'admin') {
    console.log('AdminConsole - Usuário não é admin, role:', profile?.role);
    return <Navigate to="/" replace />;
  }

  console.log('AdminConsole - Usuário admin verificado, renderizando dashboard');
  return <AdminDashboard />;
};

export default AdminConsole;