import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardDocumentIcon } from '@heroicons/react/24/solid';

import OrderDetailModal from '../../components/users/OrderDetailModal';
import api from '../../api/client';

type PaymentProof = {
  url?: string;
  transactionId?: string;
};

type Order = {
  _id: string;
  giftCard: {
    _id: string;
    brand: string;
    value: number;
    imageUrl?: string;
    price: number;
  } | null;
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
  status: string;
  code?: string;

  // NEW FIELDS
  paymentStatus: 'pending_payment' | 'payment_review' | 'paid' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'baridimob' | 'online';
  paymentProof?: PaymentProof;
};





const ITEMS_PER_PAGE = 5;

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState('purchasedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', ITEMS_PER_PAGE.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (sortField) params.append('sort', sortField);
    if (sortOrder) params.append('order', sortOrder);

    setLoading(true);
    api
      .get(`/orders/me?${params}`)
      .then((res) => {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        setError(null);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [currentPage, startDate, endDate, sortField, sortOrder]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-12 p-6 bg-white/80 backdrop-blur-md border border-blue-50 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-900">My Orders</h1>

        {/* Filters */}
        <div className="mb-8 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort Field */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Sort By:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="purchasedAt">Purchase Date</option>
                <option value="totalPrice">Total Price</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Order:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-blue-100 rounded-xl px-3 py-2 text-sm bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-blue-100 rounded-xl px-3 py-2 text-sm bg-white"
              />
            </div>

            {/* Clear Filters Button */}
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="ml-auto text-sm text-blue-600 hover:text-fuchsia-500 font-medium"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* State Messages */}
        {loading && <p className="text-center py-8">Loading your orders...</p>}
        {error && <p className="text-center py-8 text-red-600">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-center py-8 text-gray-500">You have no orders yet.</p>
        )}

        {/* Orders List */}
        <ul className="space-y-6">
          {orders.map((order) => (
            <li
              key={order._id}
              className="group flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-blue-50 shadow hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              {order.giftCard ? (
                <>
                  {order.giftCard.imageUrl && (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full ring-2 ring-blue-100 group-hover:ring-blue-300">
                      <img
                        src={order.giftCard.imageUrl}
                        alt={order.giftCard.brand}
                        className="h-14 w-14 object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-lg font-bold text-slate-900">{order.giftCard.brand} Gift Card</div>
                    <div className="text-gray-500 text-sm">Value: ${order.giftCard.value}</div>
                  </div>
                </>
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 text-center">
                  Gift Card<br />Not Found
                </div>
              )}

              <div className="flex-1 text-sm text-slate-700">
                <div>Quantity: {order.quantity}</div>
                <div>Purchased: {new Date(order.purchasedAt).toLocaleDateString()}</div>
                <div className="mt-1">
                  Status:{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                {order.code && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded select-all">{order.code}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(order.code || '');
                        alert('Gift card code copied!');
                      }}
                      className="text-blue-500 hover:text-fuchsia-500 text-xs flex items-center gap-1"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" /> Copy
                    </button>
                  </div>
                )}
              </div>
              {order.giftCard && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/giftcards/${order.giftCard?._id}`);
                  }}
                  className="mt-2 sm:mt-0 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600 transition"
                >
                  View Gift Card
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-full text-sm border ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-full text-sm border ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
}
