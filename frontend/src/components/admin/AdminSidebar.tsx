// src/components/admin/AdminSidebar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const navItems = [
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/giftcards', label: 'Gift Cards' },
    { path: '/admin/sales', label: 'Sales' },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex flex-col flex-1 p-4 space-y-2">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`block px-3 py-2 rounded ${
              location.pathname.startsWith(path)
                ? 'bg-gray-700 font-semibold'
                : 'hover:bg-gray-700'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto mb-6 mx-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </aside>
  );
}
