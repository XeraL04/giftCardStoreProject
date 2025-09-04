import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../app/store';
import { useRef, useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

function getInitial(name?: string, email?: string) {
  if (name && name.length > 0) return name[0].toUpperCase();
  if (email && email.length > 0) return email[0].toUpperCase();
  return '?';
}

export function AuthNavbar() {
  const { user, setUser } = useAuthStore();
  const cartItems = useCartStore(state => state.items);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 
      w-[90vw] md:w-[80vw] 
      bg-white/80 backdrop-blur-lg border border-blue-100 
      shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl"
    >
      <div className="flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600"
        >
          ArcVerse
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">
            Shop
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-blue-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center group" aria-label="Shopping cart">
            <ShoppingCartIcon className="w-6 h-6 text-blue-600 group-hover:text-fuchsia-500 transition" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-3 px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full shadow">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="focus:outline-none"
              onClick={() => setDropdownOpen(o => !o)}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow hover:ring-2 hover:ring-fuchsia-400 transition">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || 'User Avatar'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitial(user?.name, user?.email)
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-blue-100 rounded-xl shadow-lg py-2 z-30">
                <div className="px-4 py-3 border-b border-blue-50">
                  <div className="font-medium text-slate-900 truncate">{user?.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu with Framer Motion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-blue-50 bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-inner"
          >
            <div className="flex flex-col px-4 py-3 space-y-2">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
