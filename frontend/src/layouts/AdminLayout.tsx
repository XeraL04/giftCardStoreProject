// src/layouts/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto ml-64">
        {/* Render children if supplied, or use Outlet for nested routes */}
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
