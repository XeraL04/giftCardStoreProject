import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../app/store';
import { useState } from 'react';

export function Navbar() {
  const user = useAuthStore(state => state.user);
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 
      bg-white/80 backdrop-blur-lg border border-blue-100 
      shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center py-4 px-6 max-w-7xl mx-auto w-[90vw] md:w-[80vw]">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600 drop-shadow-sm"
        >
          ArcVerse
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="block md:hidden text-blue-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Menu */}
        <div
          className={`absolute md:static top-full left-0 w-full md:w-auto 
          bg-white/95 md:bg-transparent shadow-lg md:shadow-none rounded-b-2xl md:rounded-none border-t md:border-none
          transition-all ${open ? 'block' : 'hidden'} md:flex md:items-center`}
        >
          {user ? (
            <div className="flex flex-col md:flex-row items-center md:space-x-7 py-6 md:py-0">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white font-semibold'
                      : 'text-blue-700 hover:text-fuchsia-600 hover:bg-blue-50'
                  }`
                }
              >
                Dashboard
              </NavLink>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold'
                        : 'text-blue-700 hover:text-purple-600 hover:bg-blue-50'
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-500 to-blue-600 text-white font-semibold'
                      : 'text-blue-700 hover:text-fuchsia-600 hover:bg-blue-50'
                  }`
                }
              >
                Profile
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:space-x-5 py-6 md:py-0 items-center">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold'
                      : 'text-blue-700 hover:text-blue-500 hover:bg-blue-50'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white font-semibold'
                      : 'text-blue-700 hover:text-fuchsia-600 hover:bg-blue-50'
                  }`
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
