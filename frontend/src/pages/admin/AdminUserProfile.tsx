import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { ArrowLeftIcon, UserCircleIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
};

export default function AdminUserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get<User>(`/auth/users/${id}`)
      .then(res => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhoneNumber(res.data.phoneNumber || '');
        setRole(res.data.role);
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load user');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.put<User>(`/auth/users/${id}`, {
        name,
        email,
        phoneNumber,
        role,
      });
      setUser(res.data);
      setEditing(false);
      setSuccess('User updated successfully');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading user details...</div>;
  if (error && !user) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!user) return <div className="p-8 text-center text-gray-500">User not found.</div>;

  return (
    <main className="max-w-lg sm:max-w-xl lg:max-w-3xl mx-auto my-10 px-4 sm:px-6 py-8 bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-fuchsia-500 font-medium mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" /> Back to Users
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <UserCircleIcon className="w-10 h-10" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">User Profile</h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage user details and role</p>
        </div>
      </div>

      {/* Alerts */}
      {error && <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</p>}
      {success && <p className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">{success}</p>}

      {/* Profile form */}
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Name</label>
          {editing ? (
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          ) : (
            <p className="text-gray-800">{user.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Email</label>
          {editing ? (
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          ) : (
            <p className="text-gray-800">{user.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Phone Number</label>
          {editing ? (
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          ) : (
            <p className="text-gray-800">{user.phoneNumber || '-'}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Role</label>
          {editing ? (
            <select
              className="w-full px-4 py-2 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-start">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:shadow-lg hover:from-green-600 hover:to-emerald-600 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="w-full sm:w-auto px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600 transition"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>
    </main>
  );
}
