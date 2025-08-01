// src/features/dashboard/DashboardHero.tsx
import { useAuthStore } from '../../app/store';

export function DashboardHero() {
  const { user } = useAuthStore();
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-500 py-16 mb-8 rounded-b-lg shadow text-white text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Welcome back, {user?.name || "User"}!</h1>
      <p className="text-lg">Manage your profile and see your latest gift cards – all in one place.</p>
    </section>
  );
}
