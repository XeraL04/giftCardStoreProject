import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function CheckoutSuccess() {
  const location = useLocation();
  const orders = location.state?.orders || [];

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-xl text-white p-8 flex flex-col items-center text-center">
        <CheckCircleIcon className="w-16 h-16 mb-4 text-white drop-shadow-lg" />
        <h1 className="text-4xl font-extrabold mb-2">Thank You for Your Purchase!</h1>
        <p className="text-green-50 max-w-lg">
          Your payment was successfully processed. Enjoy your gift cards instantly!
        </p>
      </div>

      {/* Order Summary */}
      {orders.length > 0 && (
        <div className="mt-10 bg-white/80 backdrop-blur-md border border-blue-50 rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Order Summary</h2>
          <ul className="space-y-4">
            {orders.map((order: any) => (
              <li
                key={order._id}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow border border-blue-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {order.quantity} × {order.giftCard?.brand || order.giftCard}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Total Value: ${(order.totalPrice)?.toFixed(2)}
                  </p>
                </div>
                {order.giftCard?.imageUrl && (
                  <img
                    src={order.giftCard.imageUrl}
                    alt={order.giftCard.brand}
                    className="h-14 w-14 object-contain bg-gray-100 p-1 rounded-full ring-2 ring-blue-100"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white font-semibold shadow hover:shadow-lg hover:from-blue-700 hover:to-fuchsia-600 transition"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 text-blue-600 font-semibold shadow hover:bg-blue-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
