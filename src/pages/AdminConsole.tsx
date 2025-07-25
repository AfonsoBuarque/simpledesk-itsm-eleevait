import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';

const AdminConsole = () => {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminConsole;