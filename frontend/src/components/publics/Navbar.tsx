import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../app/store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const user = useAuthStore(state => state.user);
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50
      bg-white/80 backdrop-blur-lg border border-blue-100
      shadow-lg rounded-2xl transition-shadow duration-300 hover:shadow-2xl
      w-[92vw] max-w-7xl md:w-[80vw]"
    >
      <div className="flex justify-between items-center py-3 px-5 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600 drop-shadow-sm"
        >
          ArcVerse
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-blue-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <motion.div
            initial={false}
            animate={open ? "open" : "closed"}
            className="w-7 h-7 relative"
          >
            <motion.span
              className="absolute left-0 top-1/2 block h-0.5 w-7 bg-blue-600"
              variants={{
                closed: { rotate: 0, y: "-50%" },
                open: { rotate: 45, y: "-50%" }
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute left-0 top-1/2 block h-0.5 w-7 bg-blue-600"
              variants={{
                closed: { opacity: 1, y: "-50%" },
                open: { opacity: 0 }
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute left-0 top-1/2 block h-0.5 w-7 bg-blue-600"
              variants={{
                closed: { rotate: 0, y: "-50%" },
                open: { rotate: -45, y: "-50%" }
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </button>

        {/* Menu */}
        <AnimatePresence>
          {(open || window.innerWidth >= 768) && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`absolute md:static top-full left-0 w-full md:w-auto
              bg-white/95 md:bg-transparent shadow-lg md:shadow-none 
              rounded-b-2xl md:rounded-none border-t md:border-none
              md:flex md:items-center md:space-x-7
              ${open ? "block" : "hidden"}`}
            >
              {user ? (
                <div className="flex flex-col md:flex-row items-center md:space-x-7 py-6 md:py-0 px-6 md:px-0">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white font-semibold shadow-md"
                          : "text-blue-700 hover:text-fuchsia-600 hover:bg-blue-50"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  {user.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md"
                            : "text-blue-700 hover:text-purple-600 hover:bg-blue-50"
                        }`
                      }
                    >
                      Admin
                    </NavLink>
                  )}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-fuchsia-500 to-blue-600 text-white font-semibold shadow-md"
                          : "text-blue-700 hover:text-fuchsia-600 hover:bg-blue-50"
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:space-x-5 py-6 md:py-0 items-center px-6 md:px-0">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md"
                          : "text-blue-700 hover:text-blue-500 hover:bg-blue-50"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white font-semibold shadow-md"
                          : "text-blue-700 hover:text-fuchsia-600 hover:bg-blue-50"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
