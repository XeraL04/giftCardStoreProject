import { useLocation, Link } from 'react-router-dom';

export default function CheckoutSuccess() {
  const location = useLocation();
  const orders = location.state?.orders || [];

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
      <p>Your simulated payment was successful.</p>
      {orders.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Order Summary:</h2>
          <ul className="list-disc pl-5">
            {orders.map((order: any) => (
              <li key={order._id}>
                {order.quantity}x &mdash; {order.giftCard?.brand || order.giftCard} (${order.totalPrice})
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-8 text-center">
        <Link to="/dashboard" className="text-blue-600 underline">Go to Dashboard</Link>
      </p>
    </main>
  );
}
