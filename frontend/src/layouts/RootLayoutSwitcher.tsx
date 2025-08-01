// src/layouts/RootLayoutSwitcher.tsx
import { Outlet } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import AuthenticatedLayout from './AuthenticatedLayout';
import { useAuthStore } from '../app/store'; // Correct import path for your Zustand store

export default function RootLayoutSwitcher() {
  // Use your Zustand store to get the user object
  const { user } = useAuthStore();

  // Check if the user is authenticated (i.e., the user object is not null)
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <Outlet />
      </AuthenticatedLayout>
    );
  } else {
    return (
      <PublicLayout>
        <Outlet />
      </PublicLayout>
    );
  }
}