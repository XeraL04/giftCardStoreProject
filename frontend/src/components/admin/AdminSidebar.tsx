import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store';
import { UserGroupIcon, CreditCardIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const navItems = [
    { path: '/admin/users', label: 'Users', icon: <UserGroupIcon className="w-5 h-5" /> },
    { path: '/admin/giftcards', label: 'Gift Cards', icon: <CreditCardIcon className="w-5 h-5" /> },
    { path: '/admin/sales', label: 'Sales', icon: <ChartBarIcon className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-md border-r border-blue-100 shadow-lg flex flex-col">
      {/* Top Brand */}
      <div className="p-6 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600 border-b border-blue-50">
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
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
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
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:shadow-lg hover:from-red-600 hover:to-red-700 transition"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
