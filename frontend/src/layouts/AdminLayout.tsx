import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main
        className="
          flex-1 overflow-auto 
          p-4 sm:p-6 lg:p-8 
          lg:ml-64
        "
      >
        {/* Render children if supplied, or use Outlet for nested routes */}
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
