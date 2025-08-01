import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';

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

  // Update user role (promote or demote)
  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change user role to "${newRole}"?`)) return;

    setUpdatingUserId(userId);
    try {
      await api.put(`/auth/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      alert(`User role updated to ${newRole}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user.');
    }
    setUpdatingUserId(null);
  };

  // Delete User
  const deleteUser = async (userId: string) => {
    if (!window.confirm(`Are you sure you want to delete this user? This action cannot be undone.`)) return;

    setDeletingUserId(userId);
    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert('User deleted successfully.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user.');
    }
    setDeletingUserId(null);
  };

  // View User Profile - navigate to profile page or open modal
  const viewUserProfile = (userId: string) => {
    // Assuming you have a profile page for users at /admin/users/:id or similar
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b border-gray-300">Name</th>
                <th className="p-3 text-left border-b border-gray-300">Email</th>
                <th className="p-3 text-left border-b border-gray-300">Phone</th>
                <th className="p-3 text-left border-b border-gray-300">Role</th>
                <th className="p-3 text-left border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-300">{user.name}</td>
                  <td className="p-3 border-b border-gray-300">{user.email}</td>
                  <td className="p-3 border-b border-gray-300">{user.phoneNumber || '-'}</td>
                  <td className="p-3 border-b border-gray-300 capitalize">{user.role}</td>
                  <td className="p-3 border-b border-gray-300 flex gap-2">
                    <button
                      disabled={updatingUserId === user._id}
                      onClick={() => toggleRole(user._id, user.role)}
                      className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                    <button
                      disabled={deletingUserId === user._id}
                      onClick={() => deleteUser(user._id)}
                      className="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => viewUserProfile(user._id)}
                      className="text-sm px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
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
