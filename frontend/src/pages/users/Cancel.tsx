import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <main className="max-w-3xl mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Payment Cancelled</h1>
      <p className="text-gray-700 mb-8">
        It looks like you cancelled the payment. You can always try again later.
      </p>
      <Link
        to="/cart"
        className="inline-block bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition"
      >
        Back to Cart
      </Link>
    </main>
  );
}
