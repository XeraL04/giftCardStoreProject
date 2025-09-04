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

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [giftCardFilter, setGiftCardFilter] = useState('');
  const [referenceCodeFilter, setReferenceCodeFilter] = useState('');

  const ORDERS_PER_PAGE = 10;
  const backendURL = 'http://localhost:5000'; // Update for production

  useEffect(() => {
    fetchUsers();
    fetchGiftCards();
  }, []);

  useEffect(() => {
    fetchOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="max-w-full mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
        Sales and Orders
      </h1>

      {/* Filters */}
      <form
        onSubmit={e => {
          e.preventDefault();
          setPage(1);
          fetchOrders(1);
        }}
        className="flex flex-wrap gap-4 mb-6 justify-center sm:justify-start"
      >
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col min-w-[150px]">
          <label className="mb-1 text-sm font-medium text-gray-700">User</label>
          <select
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col min-w-[150px]">
          <label className="mb-1 text-sm font-medium text-gray-700">Gift Card</label>
          <select
            value={giftCardFilter}
            onChange={e => setGiftCardFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Gift Cards</option>
            {giftCards.map(card => (
              <option key={card._id} value={card._id}>
                {card.brand}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col min-w-[150px]">
          <label className="mb-1 text-sm font-medium text-gray-700">Reference Code</label>
          <input
            type="text"
            value={referenceCodeFilter}
            onChange={e => setReferenceCodeFilter(e.target.value)}
            placeholder="e.g. ORD-20250813113440-1234"
            className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-center py-10 text-gray-600">Loading orders...</p>
      )}
      {error && (
        <p className="text-center py-10 text-red-600 font-semibold">{error}</p>
      )}
      {!loading && orders.length === 0 && (
        <p className="text-center py-10 text-gray-500">No orders found.</p>
      )}

      {/* Orders Table */}
      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700">
              <tr>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Gift Card</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-center">Total</th>
                <th className="px-3 py-2 text-left">Purchased</th>
                <th className="px-3 py-2 text-left">Payment Status</th>
                <th className="px-3 py-2 text-left">Proof</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr
                  key={o._id}
                  className={(idx % 2 === 0 ? 'bg-white' : 'bg-gray-50') + ' hover:bg-blue-50'}
                >
                  <td className="px-3 py-2 whitespace-normal break-words max-w-xs">
                    <div className="font-semibold">{o.user.name}</div>
                    <div className="text-gray-500 text-xs break-words">{o.user.email}</div>
                    {o.paymentReferenceCode && (
                      <div className="text-gray-400 text-xs mt-1 break-words">Ref: {o.paymentReferenceCode}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-normal break-words max-w-xs">{o.giftCard.brand}</td>
                  <td className="px-3 py-2 text-center">{o.quantity}</td>
                  <td className="px-3 py-2 text-center font-semibold text-green-600">${o.totalPrice.toFixed(2)}</td>
                  <td className="px-3 py-2 whitespace-normal break-words max-w-xs">{new Date(o.purchasedAt).toLocaleString()}</td>
                  <td className="px-3 py-2">
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
                    <div className="text-xs">{o.paymentMethod}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-normal break-words max-w-xs">
                    {o.paymentProof?.url ? (
                      <a
                        href={
                          o.paymentProof.url.startsWith('/uploads')
                            ? backendURL + o.paymentProof.url
                            : o.paymentProof.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-words"
                      >
                        View Proof
                      </a>
                    ) : (
                      <>
                        <span className="text-gray-400 block mb-1">No proof</span>
                        <input
                          type="file"
                          className="text-xs"
                          onChange={e => {
                            if (!e.target.files) return;
                            const file = e.target.files[0];
                            if (file) {
                              handleProofUpload(file, o._id);
                            }
                          }}
                        />
                      </>
                    )}
                    {o.paymentProof?.transactionId && (
                      <div className="text-xs">TX: {o.paymentProof.transactionId}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-normal break-words max-w-xs">
                    {o.paymentStatus === 'payment_review' && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleVerify(o._id, 'approved')}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium shadow hover:from-green-600 hover:to-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(o._id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-medium shadow hover:from-red-600 hover:to-rose-700 transition"
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-6 flex flex-wrap justify-center gap-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded-full border text-sm disabled:opacity-50 hover:bg-blue-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded-full border text-sm ${
                page === idx + 1 ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'
              }`}
            >
              {idx + 1}
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
    </div>
  );
}
