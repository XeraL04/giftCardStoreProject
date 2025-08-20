import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PendingPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Destructure data from navigation state
  const { order, paymentInstructions, paymentReferenceCode, paymentDueDate, whatsappLink } = state || {};

  useEffect(() => {
    // If no state is provided, redirect user back to cart
    if (!order) {
      navigate('/cart');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <main className="max-w-3xl mx-auto mt-16 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Payment Pending</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your order. Please follow the instructions below to complete your payment.
      </p>

      {/* Order Reference */}
      <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <div className="text-sm text-gray-500">Order Reference Code</div>
        <div className="text-xl font-bold text-blue-700">{paymentReferenceCode}</div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
        <div className="text-sm text-gray-500 mb-1">Payment Instructions</div>
        <p className="text-gray-800 whitespace-pre-line">{paymentInstructions}</p>
      </div>

      {/* Due Date */}
      <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border border-yellow-100">
        <div className="text-sm text-gray-500 mb-1">Payment Due By</div>
        <p className="text-lg font-semibold text-yellow-800">
          {new Date(paymentDueDate).toLocaleString()}
        </p>
        <p className="text-sm text-yellow-600 mt-1">
          Please complete your payment before this deadline to avoid order cancellation.
        </p>
      </div>

      {/* WhatsApp Contact Button */}
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center mb-8 w-full px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow hover:bg-green-600 transition"
        >
          💬 Contact Us on WhatsApp
        </a>
      )}

      {/* Next Steps */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <Link
          to="/orders"
          className="flex-1 text-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:shadow-lg hover:from-green-600 hover:to-emerald-600 transition"
        >
          Go to My Orders
        </Link>
        <Link
          to="/shop"
          className="flex-1 text-center px-6 py-3 rounded-full bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
