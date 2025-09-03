import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/worker" replace />;
  }

  const currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin',
  };

  return <AdminDashboard user={currentUser} onLogout={logout} />;
}