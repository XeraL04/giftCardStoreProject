import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../app/store';
import { useState } from 'react';

export function Navbar() {
  const user = useAuthStore(state => state.user);
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow mb-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-xl font-bold text-blue-600">
          GiftShop
        </Link>

        <button
          className="block md:hidden text-blue-600 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className={`md:flex md:items-center ${open ? 'block' : 'hidden'}`}>
          {user ? (
            <div className="flex items-center space-x-6">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800'
                }
              >
                Dashboard
              </NavLink>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800'
                  }
                >
                  Admin
                </NavLink>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800'
                }
              >
                Profile
              </NavLink>
              {/* Add a logout button or dropdown here if you want */}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:space-x-4">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800'
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800'
                }
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
