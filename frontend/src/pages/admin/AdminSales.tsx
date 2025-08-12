import { useEffect, useState } from 'react';
import api from '../../api/client';

type User = { _id: string; name: string; email: string };
type GiftCard = { _id: string; brand: string };
type Order = {
  _id: string;
  user: User;
  giftCard: GiftCard;
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
  status: string;
};

interface GiftCardApiResponse {
  totalGiftCards: number;
  totalPages: number;
  currentPage: number;
  giftCards: GiftCard[];
}

export default function AdminSales() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [users, setUsers] = useState<User[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [giftCardFilter, setGiftCardFilter] = useState('');

  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
    fetchGiftCards();
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, startDate, endDate, userFilter, giftCardFilter]);

  async function fetchUsers() {
    try {
      const res = await api.get<User[]>('/auth/users');
      setUsers(res.data);
    } catch {
      console.error('Failed to load users');
    }
  }

  async function fetchGiftCards() {
    try {
      const res = await api.get<GiftCardApiResponse>('/giftcards');
      setGiftCards(res.data.giftCards);
    } catch {
      console.error('Failed to load gift cards');
    }
  }

  async function fetchOrders(pageNum: number) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: ORDERS_PER_PAGE.toString(),
        sort: 'purchasedAt',
        order: 'desc',
      });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (userFilter) params.append('user', userFilter);
      if (giftCardFilter) params.append('giftCard', giftCardFilter);

      const res = await api.get<{
        orders: Order[];
        totalOrders: number;
        totalPages: number;
        currentPage: number;
      }>(`/orders?${params.toString()}`);

      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl">
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900">Sales and Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">User</label>
          <select
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">Gift Card</label>
          <select
            value={giftCardFilter}
            onChange={e => setGiftCardFilter(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Gift Cards</option>
            {giftCards.map(card => (
              <option key={card._id} value={card._id}>{card.brand}</option>
            ))}
          </select>
        </div>
        <div className="self-end">
          <button
            onClick={() => { setPage(1); fetchOrders(1); }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow hover:from-blue-600 hover:to-fuchsia-600 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table States */}
      {loading && <p className="text-center py-8">Loading orders...</p>}
      {error && <p className="text-center py-8 text-red-600">{error}</p>}
      {!loading && orders.length === 0 && (
        <p className="text-center py-8 text-gray-500">No orders found.</p>
      )}

      {/* Orders Table */}
      {!loading && orders.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-fuchsia-50">
                  <th className="p-3 text-left font-semibold">User</th>
                  <th className="p-3 text-left font-semibold">Gift Card</th>
                  <th className="p-3 text-left font-semibold">Quantity</th>
                  <th className="p-3 text-left font-semibold">Total Price</th>
                  <th className="p-3 text-left font-semibold">Purchased At</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`${idx % 2 === 0 ? 'bg-white/60' : 'bg-white/40'} hover:bg-blue-50 transition`}
                  >
                    <td className="p-3 font-medium">
                      {order.user.name}
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="p-3">{order.giftCard.brand}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3 font-semibold text-green-600">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-3">{new Date(order.purchasedAt).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex justify-center gap-2" aria-label="Pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded-full border text-sm disabled:opacity-50 hover:bg-blue-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    p === page ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-full border text-sm disabled:opacity-50 hover:bg-blue-50"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
