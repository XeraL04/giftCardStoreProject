// src/layouts/RootLayoutSwitcher.tsx
import { Outlet, useLocation } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import AuthenticatedLayout from './AuthenticatedLayout';
import { AdminLayout } from './AdminLayout';
import { useAuthStore } from '../app/store';

export default function RootLayoutSwitcher() {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // --- Layout & Redirection Logic ---

  // Case 1: Admin user on an admin path
  if (isAuthenticated && isAdmin && location.pathname.startsWith('/admin')) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  // Case 2: Authenticated user (but not on an admin path)
  if (isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <Outlet />
      </AuthenticatedLayout>
    );
  }

  // Case 3: All other cases (public routes)
  // This also handles unauthorized access to admin pages (e.g., redirecting non-admins)
  // The AdminRoute component's redirection logic is now handled here.
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}