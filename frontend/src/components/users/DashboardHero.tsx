import { useAuthStore } from '../../app/store';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export function DashboardHero() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600 anime-gradient py-20 mb-10 rounded-3xl shadow-lg text-white text-center">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-16 w-72 h-72 bg-fuchsia-400/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center">
        {/* Avatar/Icon */}
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shadow-lg ring-2 ring-white/30 mb-6">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'User Avatar'}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="w-14 h-14 text-white/90" />
          )}
        </div>

        {/* Welcome text */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 drop-shadow">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-lg text-blue-100 mb-6">
          Manage your profile, view your latest orders, and explore new offers.
        </p>

        {/* Optional quick action */}
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-blue-50 hover:text-fuchsia-600 transition-all"
        >
          View Profile
        </button>
      </div>
    </section>
  );
}
