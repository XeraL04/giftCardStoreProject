import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAuthStore } from "../../app/store";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      path: "/admin/users",
      label: "Users",
      icon: <UserGroupIcon className="w-5 h-5" />,
    },
    {
      path: "/admin/giftcards",
      label: "Gift Cards",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
    {
      path: "/admin/sales",
      label: "Sales",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white/90 backdrop-blur-md border border-blue-100 shadow-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Open sidebar menu"
      >
        <Bars3Icon className="w-6 h-6 text-blue-600" />
      </button>

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 
          bg-white/90 backdrop-blur-md border-r border-blue-100 shadow-lg 
          flex flex-col overflow-y-auto
          transform transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        aria-label="Admin Sidebar"
      >
        {/* Close button on mobile */}
        <div className="flex justify-between items-center p-6 border-b border-blue-50 lg:hidden">
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600">
            Admin Panel
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Close sidebar menu"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Top Brand for desktop */}
        <div className="hidden p-6 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600 border-b border-blue-50 lg:block">
          Admin Panel
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-lg"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {icon}
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-50">
          <button
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:shadow-lg hover:from-red-600 hover:to-red-700 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
