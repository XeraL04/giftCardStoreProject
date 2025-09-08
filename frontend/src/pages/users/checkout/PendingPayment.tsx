import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PendingPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    order,
    paymentInstructions,
    paymentDueDate,
    whatsappLink,
  } = state || {};

  useEffect(() => {
    if (!order) {
      navigate('/cart');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <main className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto mt-10 sm:mt-16 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl px-4 py-8 sm:p-8">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 text-center">
        Payment Pending
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Thank you for your order. Please follow the instructions below to complete your payment.
      </p>

      {/* Payment Instructions */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
        <div className="text-sm text-gray-500 mb-1">Payment Instructions</div>
        <p className="text-gray-800 whitespace-pre-line text-sm sm:text-base">{paymentInstructions}</p>
      </div>

      {/* Due Date */}
      <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border border-yellow-100 text-center">
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
          className="block text-center mb-8 w-full px-6 py-3 bg-green-500 text-white text-base sm:text-lg font-semibold rounded-full shadow hover:bg-green-600 transition"
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
