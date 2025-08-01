import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';

// Updated type definition to explicitly allow `giftCard` to be null
// if it fails to populate or the referenced GiftCard is missing.
type Order = {
  _id: string;
  giftCard: { // This now represents a _populated_ gift card object
    _id: string;
    brand: string;
    value: number;
    imageUrl?: string; // Still optional within the populated object
    price: number;
  } | null; // <-- Crucial: giftCard itself can be null if not found/populated
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
  status: string;
  code?: string;
};

// Props for the detail modal
type OrderDetailModalProps = {
  order: Order | null;
  onClose: () => void;
};

function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
      aria-modal="true" role="dialog"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded p-6 max-w-md w-full shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking modal content
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        {/* --- FIX FOR OrderDetailModal --- */}
        {order.giftCard ? ( // Check if giftCard is not null
          <>
            {order.giftCard.imageUrl && ( // Check if imageUrl exists before rendering img tag
              <img
                src={order.giftCard.imageUrl}
                alt={order.giftCard.brand}
                className="w-32 h-32 object-contain mb-4"
              />
            )}
            <p><strong>Brand:</strong> {order.giftCard.brand}</p>
            <p><strong>Value:</strong> ${order.giftCard.value}</p>
            <p><strong>Price:</strong> ${order.giftCard.price}</p>
          </>
        ) : (
          <p className="text-gray-500 mb-4">Gift Card details not available.</p>
        )}
        {/* --- END FIX --- */}

        <p><strong>Quantity:</strong> {order.quantity}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice}</p>
        <p><strong>Status:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
        <p><strong>Purchased At:</strong> {order.purchasedAt ? new Date(order.purchasedAt).toLocaleString() : 'N/A'}</p>
        {order.code && (
          <p className="mt-2">
            <strong>Code:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.code}</span>
          </p>
        )}
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 5;

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

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

    // It's crucial that your backend's /orders/me endpoint
    // correctly populates the 'giftCard' field, including 'imageUrl'.
    // e.g., .populate('giftCard', 'brand value price imageUrl')
    api.get(`/orders/me?${params.toString()}`) // Changed from /orders/me to /orders/myorders as per your routes
      .then(res => {
        // Assuming res.data contains { orders: [], totalPages: N }
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        setError(null);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [currentPage, startDate, endDate, sortField, sortOrder]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-4 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <p className="text-center py-12">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-4 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <p className="text-center py-12 text-red-600">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-4 bg-white rounded shadow text-center text-gray-600">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* Sorting and Date Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {/* Sort by fields */}
        <label className="flex items-center gap-2 text-sm">
          Sort by:
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value)}
            className="border rounded p-1"
          >
            <option value="purchasedAt">Purchase Date</option>
            <option value="totalPrice">Total Price</option>
            <option value="status">Status</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          Order:
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="border rounded p-1"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>

        {/* Start Date */}
        <label className="flex items-center gap-2 text-sm">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-1"
          />
        </label>

        {/* End Date */}
        <label className="flex items-center gap-2 text-sm">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-1"
          />
        </label>

        {(startDate || endDate) && (
          <button
            onClick={() => { setStartDate(''); setEndDate(''); }}
            className="ml-auto text-sm text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Orders List */}
      <ul className="space-y-6">
        {orders.map(order => (
          <li
            key={order._id}
            className="border rounded p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedOrder(order)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => { if(e.key === 'Enter') setSelectedOrder(order); }}
          >
            {/* --- FIX FOR OrdersListPage MAIN LISTING --- */}
            {order.giftCard ? ( // Check if giftCard is not null
              <>
                {order.giftCard.imageUrl && ( // Check if imageUrl exists before rendering img tag
                  <img
                    src={order.giftCard.imageUrl}
                    alt={order.giftCard.brand}
                    className="w-24 h-24 object-contain rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="text-xl font-semibold">{order.giftCard.brand} Gift Card</div>
                  <div className="text-gray-600">Value: ${order.giftCard.value}</div>
                </div>
              </>
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 text-center">
                Gift Card<br/>Not Found
              </div>
            )}
            {/* --- END FIX --- */}

            <div className="flex-1">
              {/* Other details, potentially including gift card details that are always present or also safely accessed */}
              <div className="text-gray-700">Quantity: {order.quantity}</div>
              <div className="text-gray-700">
                Purchased: {order.purchasedAt ? new Date(order.purchasedAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="mt-1">
                Status: <span className={`${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.code && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded shadow-sm select-all">{order.code}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(order.code || '');
                      // Replace alert with toast if you have a notification system
                      alert('Gift card code copied to clipboard!');
                    }}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Copy Code
                  </button>
                </div>
              )}
            </div>
            {order.giftCard && ( // Only show "View Gift Card" if giftCard is available
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/giftcards/${order.giftCard?._id}`); // Use optional chaining just in case
                }}
                className="mt-2 sm:mt-0 px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition whitespace-nowrap"
              >
                View Gift Card
              </button>
            )}
          </li>
        ))}
      </ul>


      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="mt-6 flex justify-center items-center gap-2" aria-label="Pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'}`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded border ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'}`}
          >
            Next
          </button>
        </nav>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}