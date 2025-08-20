import { useEffect, useState } from 'react';
import api from '../../api/client';

type User = { _id: string; name: string; email: string };
type GiftCard = { _id: string; brand: string };
type PaymentProof = { url?: string; transactionId?: string };
type Order = {
  _id: string;
  user: User;
  giftCard: GiftCard;
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
  status: string;
  paymentStatus: 'pending_payment' | 'payment_review' | 'paid' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'baridimob' | 'online' | 'whatsapp';
  paymentReferenceCode?: string;
  paymentProof?: PaymentProof;
};

interface GiftCardApiResponse {
  totalGiftCards: number;
  totalPages: number;
  currentPage: number;
  giftCards: GiftCard[];
}

export default function AdminSales() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [users, setUsers] = useState<User[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [giftCardFilter, setGiftCardFilter] = useState('');
  const [referenceCodeFilter, setReferenceCodeFilter] = useState('');

  const ORDERS_PER_PAGE = 10;
  const backendURL = 'http://localhost:5000'; // update for prod

  useEffect(() => {
    fetchUsers();
    fetchGiftCards();
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, startDate, endDate, userFilter, giftCardFilter, referenceCodeFilter]);

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
      if (referenceCodeFilter.trim()) params.append('referenceCode', referenceCodeFilter.trim());

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

  async function handleVerify(orderId: string, status: 'approved' | 'rejected') {
    try {
      await api.put(`/orders/verify-payment/${orderId}`, { status });
      alert(`Payment ${status}`);
      fetchOrders(page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    }
  }

  async function handleProofUpload(file: File, orderId: string) {
    try {
      const formData = new FormData();
      formData.append('proof', file);
      await api.post(`/orders/upload-proof/${orderId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Proof uploaded successfully');
      fetchOrders(page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900">Sales and Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">User</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">Gift Card</label>
          <select
            value={giftCardFilter}
            onChange={(e) => setGiftCardFilter(e.target.value)}
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Gift Cards</option>
            {giftCards.map((card) => (
              <option key={card._id} value={card._id}>
                {card.brand}
              </option>
            ))}
          </select>
        </div>

        {/* NEW Reference Code filter */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-700">Reference Code</label>
          <input
            type="text"
            value={referenceCodeFilter}
            onChange={(e) => setReferenceCodeFilter(e.target.value)}
            placeholder="e.g. ORD-20250813113440-6464"
            className="px-4 py-2 border border-blue-100 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="self-end">
          <button
            onClick={() => {
              setPage(1);
              fetchOrders(1);
            }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow hover:from-blue-600 hover:to-fuchsia-600 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {loading && <p className="text-center py-8">Loading orders...</p>}
      {error && <p className="text-center py-8 text-red-600">{error}</p>}
      {!loading && orders.length === 0 && <p className="text-center py-8 text-gray-500">No orders found.</p>}

      {!loading && orders.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-fuchsia-50">
                  <th className="p-3 text-left">User</th>
                  <th className="p-3">Gift Card</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Purchased</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3">Proof</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr key={o._id} className={`${idx % 2 === 0 ? 'bg-white/60' : 'bg-white/40'} hover:bg-blue-50`}>
                    <td className="p-3">
                      {o.user.name}
                      <div className="text-xs text-gray-500">{o.user.email}</div>
                      {o.paymentReferenceCode && (
                        <div className="text-xs text-gray-400 mt-1">
                          Ref: {o.paymentReferenceCode}
                        </div>
                      )}
                    </td>
                    <td className="p-3">{o.giftCard.brand}</td>
                    <td className="p-3">{o.quantity}</td>
                    <td className="p-3 font-semibold text-green-600">${o.totalPrice.toFixed(2)}</td>
                    <td className="p-3">{new Date(o.purchasedAt).toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          o.paymentStatus === 'pending_payment'
                            ? 'bg-yellow-100 text-yellow-800'
                            : o.paymentStatus === 'payment_review'
                            ? 'bg-blue-100 text-blue-800'
                            : o.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                      <div className="text-xs text-gray-500">{o.paymentMethod}</div>
                    </td>
                    <td className="p-3">
                      {o.paymentProof?.url ? (
                        <a
                          href={
                            o.paymentProof.url.startsWith('/uploads')
                              ? backendURL + o.paymentProof.url
                              : o.paymentProof.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Proof
                        </a>
                      ) : (
                        <>
                          <span className="text-gray-400 block mb-1">No proof</span>
                          <input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleProofUpload(e.target.files[0], o._id);
                              }
                            }}
                            className="text-xs"
                          />
                        </>
                      )}
                      {o.paymentProof?.transactionId && (
                        <div className="text-xs">TX: {o.paymentProof.transactionId}</div>
                      )}
                    </td>
                    <td className="p-3">
                      {o.paymentStatus === 'payment_review' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleVerify(o._id, 'approved')}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerify(o._id, 'rejected')}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:from-red-600 hover:to-rose-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
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
                className="px-3 py-1 rounded-full border text-sm disabled:opacity-50 hover:bg-blue-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
