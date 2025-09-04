import { useCartStore } from '../../app/store';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/client';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(false);
  const [updatingItemIds, setUpdatingItemIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<
    'bank_transfer' | 'baridimob' | 'online' | 'whatsapp' | ''
  >('');
  const navigate = useNavigate();

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return alert('Your cart is empty!');
    if (!paymentMethod) return alert('Please select a payment method.');

    setLoading(true);
    try {
      const firstItem = items[0];
      const response = await api.post('/orders', {
        giftCardId: firstItem.giftCardId,
        quantity: firstItem.quantity,
        paymentMethod,
      });

      clearCart();

      if (paymentMethod === 'online') {
        navigate('/checkout/success', { state: { orders: [response.data.order] } });
      } else if (paymentMethod === 'whatsapp') {
        if (response.data.whatsappLink) {
          window.open(response.data.whatsappLink, '_blank');
        }
        navigate('/checkout/pending-payment', {
          state: { ...response.data, whatsappLink: response.data.whatsappLink || null },
        });
      } else {
        navigate('/checkout/pending-payment', { state: response.data });
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (giftCardId: string, qty: number) => {
    if (qty < 1) return;
    setUpdatingItemIds((prev) => [...prev, giftCardId]);
    updateQuantity(giftCardId, qty);
    setUpdatingItemIds((prev) => prev.filter((id) => id !== giftCardId));
  };

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-20 px-4 sm:px-6">
        <div className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-6">Your cart is empty.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white rounded-full shadow hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto my-3 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-slate-900 text-center sm:text-left">
        Your Shopping Cart
      </h1>

      {/* Cart Items */}
      <ul className="divide-y divide-blue-50">
        {items.map((item) => (
          <li
            key={item.giftCardId}
            className="flex flex-col sm:flex-row sm:items-center gap-6 py-6"
          >
            {/* Image */}
            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full ring-2 ring-blue-100 flex-shrink-0 mx-auto sm:mx-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.brand} className="h-14 w-14 object-contain" />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="font-bold text-lg text-slate-900">{item.brand}</div>
              <div className="text-gray-600 text-sm">${item.price} per card</div>
            </div>

            {/* Quantity + Line total + Remove */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Quantity */}
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <input
                  id={`quantity-${item.giftCardId}`}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) handleQuantityChange(item.giftCardId, val);
                  }}
                  className="w-20 px-3 py-2 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {updatingItemIds.includes(item.giftCardId) && (
                  <span className="text-xs text-gray-500">Updating...</span>
                )}
              </div>

              {/* Line total */}
              <div className="font-bold text-slate-900 text-center sm:text-left">
                ${(item.quantity * item.price).toFixed(2)}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.giftCardId)}
                aria-label={`Remove ${item.brand} from cart`}
                className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition self-center sm:self-auto"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center font-semibold text-lg border-t border-blue-50 pt-6">
        <span>Total:</span>
        <span className="mt-2 sm:mt-0">${totalPrice.toFixed(2)}</span>
      </div>

      {/* Payment Methods */}
      <div className="w-full mt-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 text-center sm:text-left">
          Select Payment Method
        </h2>
        <div className="grid gap-3 max-w-md mx-auto sm:mx-0">
          {[
            { value: 'bank_transfer', label: 'Bank Transfer / CCP Deposit' },
            { value: 'baridimob', label: 'BaridiMob' },
            { value: 'whatsapp', label: 'Contact us on WhatsApp' },
            { value: 'online', label: 'Online Payment (Coming Soon)' },
          ].map((method) => (
            <label
              key={method.value}
              className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${
                paymentMethod === method.value
                  ? 'bg-blue-50 border-blue-300'
                  : 'hover:bg-blue-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={() => setPaymentMethod(method.value as any)}
                className="cursor-pointer"
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
        <button
          onClick={() => clearCart()}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Clear Cart
        </button>
        <button
          disabled={loading}
          onClick={handleCheckout}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:shadow-lg hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </main>
  );
}
