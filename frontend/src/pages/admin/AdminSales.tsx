import { useEffect, useState } from 'react';
import api from '../../api/client';

type User = { _id: string; name: string; email: string; };
type GiftCard = { _id: string; brand: string; };
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

  // Filters state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [giftCardFilter, setGiftCardFilter] = useState<string>('');

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
      const res = await api.get<User[]>('/auth/users'); // Admin-only
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users for filter');
    }
  }

  async function fetchGiftCards() {
    try {
      // Use the new interface to correctly type the API response
      const res = await api.get<GiftCardApiResponse>('/giftcards');

      // Access the giftCards array from the response object
      setGiftCards(res.data.giftCards);
    } catch (err) {
      console.error('Failed to load gift cards for filter');
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
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">

      <h1 className="text-3xl font-bold mb-6">Sales and Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">User</label>
          <select
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Gift Card</label>
          <select
            value={giftCardFilter}
            onChange={e => setGiftCardFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Gift Cards</option>
            {giftCards.map(card => (
              <option key={card._id} value={card._id}>{card.brand}</option>
            ))}
          </select>
        </div>

        <div className="self-end">
          <button
            onClick={() => {
              setPage(1);  // Reset to first page on filter change
              fetchOrders(1);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-500">No orders found.</p>
      )}

      {!loading && orders.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b border-gray-300 text-left">User</th>
                  <th className="p-3 border-b border-gray-300 text-left">Gift Card</th>
                  <th className="p-3 border-b border-gray-300 text-left">Quantity</th>
                  <th className="p-3 border-b border-gray-300 text-left">Total Price</th>
                  <th className="p-3 border-b border-gray-300 text-left">Purchased At</th>
                  <th className="p-3 border-b border-gray-300 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-300">{order.user.name} <br /><small className="text-xs">{order.user.email}</small></td>
                    <td className="p-3 border-b border-gray-300">{order.giftCard.brand}</td>
                    <td className="p-3 border-b border-gray-300">{order.quantity}</td>
                    <td className="p-3 border-b border-gray-300">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-3 border-b border-gray-300">{new Date(order.purchasedAt).toLocaleString()}</td>
                    <td className="p-3 border-b border-gray-300 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-6 flex justify-center gap-2" aria-label="Pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded border ${pageNum === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
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
