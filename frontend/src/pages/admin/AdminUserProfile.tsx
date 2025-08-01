import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';

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
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

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
    try {
      const res = await api.put<User>(`/auth/users/${id}`, {
        name,
        email,
        phoneNumber,
        role,
      });
      setUser(res.data);
      setEditing(false);
      alert('User updated successfully');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading user details...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!user) return <div className="p-6 text-center">User not found.</div>;

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 underline hover:text-blue-800"
      >
        &larr; Back to Users List
      </button>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          {editing ? (
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          ) : (
            <p>{user.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          {editing ? (
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          {editing ? (
            <input
              type="tel"
              className="w-full border rounded px-3 py-2"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          ) : (
            <p>{user.phoneNumber || '-'}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Role</label>
          {editing ? (
            <select
              className="w-full border rounded px-3 py-2"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <p className="capitalize">{user.role}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </main>
  );
}
