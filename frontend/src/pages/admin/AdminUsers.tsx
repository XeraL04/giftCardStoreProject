import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { ArrowUpOnSquareIcon, TrashIcon, EyeIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/solid';

export type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get<User[]>('/auth/users')
      .then((res) => {
        setUsers(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load users.');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change user role to "${newRole}"?`)) return;

    setUpdatingUserId(userId);
    try {
      await api.put(`/auth/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user.');
    }
    setUpdatingUserId(null);
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm(`Delete this user permanently?`)) return;

    setDeletingUserId(userId);
    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user.');
    }
    setDeletingUserId(null);
  };

  const viewUserProfile = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-slate-900 text-center sm:text-left">
        User Management
      </h1>

      {loading && (
        <p className="text-center py-8 text-gray-500">Loading users...</p>
      )}
      {error && (
        <p className="text-center py-8 text-red-600 font-medium">{error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-blue-50 shadow-inner">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-fuchsia-50 text-slate-700">
                <th className="px-3 py-3 text-left font-semibold">Name</th>
                <th className="px-3 py-3 text-left font-semibold">Email</th>
                <th className="px-3 py-3 text-left font-semibold">Phone</th>
                <th className="px-3 py-3 text-left font-semibold">Role</th>
                <th className="px-3 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`${
                      idx % 2 === 0 ? 'bg-white/60' : 'bg-white/40'
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-3 font-medium whitespace-nowrap">{user.name}</td>
                    <td className="p-3 whitespace-normal break-words">{user.email}</td>
                    <td className="p-3 whitespace-normal break-words">{user.phoneNumber || '-'}</td>
                    <td className="p-3 capitalize font-semibold whitespace-nowrap">{user.role}</td>
                    <td className="p-3 flex flex-wrap gap-2">
                      <button
                        disabled={updatingUserId === user._id}
                        onClick={() => toggleRole(user._id, user.role)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow transition ${
                          user.role === 'admin'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                            : 'bg-gradient-to-r from-blue-500 to-fuchsia-500 hover:from-blue-600 hover:to-fuchsia-600'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <ArrowDownOnSquareIcon className="w-4 h-4" />
                        ) : (
                          <ArrowUpOnSquareIcon className="w-4 h-4" />
                        )}
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>

                      <button
                        disabled={deletingUserId === user._id}
                        onClick={() => deleteUser(user._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium shadow hover:from-red-600 hover:to-red-700 transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>

                      <button
                        onClick={() => viewUserProfile(user._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-blue-600 border border-blue-200 text-xs font-medium shadow hover:bg-blue-50 transition"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-gray-500 bg-white/50 whitespace-normal break-words"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
