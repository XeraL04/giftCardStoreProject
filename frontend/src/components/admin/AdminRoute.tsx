import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const user = useAuthStore(state => state.user);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Logged in but not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized admin user; render children routes
  return <>{children}</>;
}