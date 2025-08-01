import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../app/store';
import { useRef, useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/solid'

// Helper for first letter display
function getInitial(name?: string, email?: string) {
  if (name && name.length > 0) return name[0].toUpperCase();
  if (email && email.length > 0) return email[0].toUpperCase();
  return '?';
}

export function AuthNavbar() {
  const { user, setUser } = useAuthStore();
  const cartItems = useCartStore(state => state.items);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Calculate total quantity in cart
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow px-4 py-3 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-xl text-blue-600">
          GiftShop
        </Link>

        {/* Navigation Links */}
        <div className='flex '>

          <Link
            to="/dashboard"
            className="block px-4 py-2 hover:bg-indigo-50 text-gray-700 text-sm"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/shop"
            className="block px-4 py-2 hover:bg-indigo-50 text-gray-700 text-sm"
            onClick={() => setOpen(false)}
          >
            Shop
          </Link>
        </div>

        <div className="flex items-center gap-5">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center focus:outline-none"
            aria-label="Shopping cart"
          >
            <ShoppingCartIcon className="size-6 text-blue-500" />
            {totalQuantity > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="focus:outline-none"
              onClick={() => setOpen(o => !o)}
              aria-label="User menu"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow hover:ring-2 hover:ring-indigo-500 transition">
                {getInitial(user?.name, user?.email)}
              </div>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-30">
                <div className="px-4 py-2 text-gray-700 border-b text-sm">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                </div>

                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-indigo-50 text-gray-700 text-sm"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
