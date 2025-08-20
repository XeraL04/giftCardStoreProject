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
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'baridimob' | 'online' | 'whatsapp' | ''>('');
  const navigate = useNavigate();

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    setLoading(true);
    try {
      // For simplicity, handle only one item per checkout
      const firstItem = items[0];

      const response = await api.post('/orders', {
        giftCardId: firstItem.giftCardId,
        quantity: firstItem.quantity,
        paymentMethod,
      });

      clearCart();

      if (paymentMethod === 'online') {
        navigate('/checkout/success', { state: { orders: [response.data.order] } });
      } 
      else if (paymentMethod === 'whatsapp') {
        // If backend sent a WhatsApp link, open it immediately to start the chat
        if (response.data.whatsappLink) {
          window.open(response.data.whatsappLink, '_blank');
        }
        navigate('/checkout/pending-payment', {
          state: {
            order: response.data.order,
            paymentInstructions: response.data.paymentInstructions,
            paymentReferenceCode: response.data.paymentReferenceCode,
            paymentDueDate: response.data.paymentDueDate,
            whatsappLink: response.data.whatsappLink || null,
          },
        });
      } 
      else {
        // Bank transfer or BaridiMob
        navigate('/checkout/pending-payment', {
          state: {
            order: response.data.order,
            paymentInstructions: response.data.paymentInstructions,
            paymentReferenceCode: response.data.paymentReferenceCode,
            paymentDueDate: response.data.paymentDueDate,
          },
        });
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

  // Empty state
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <div className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-lg p-10">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
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
    <main className="max-w-6xl mx-auto my-12 p-8 bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl">
      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900">Your Shopping Cart</h1>

      {/* Cart Items */}
      <ul className="divide-y divide-blue-50">
        {items.map((item) => (
          <li key={item.giftCardId} className="flex flex-col sm:flex-row items-center gap-6 py-6">
            {/* Image */}
            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full ring-2 ring-blue-100">
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

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label htmlFor={`quantity-${item.giftCardId}`} className="sr-only">
                Quantity
              </label>
              <input
                id={`quantity-${item.giftCardId}`}
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    handleQuantityChange(item.giftCardId, val);
                  }
                }}
                className="w-20 px-3 py-2 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {updatingItemIds.includes(item.giftCardId) && (
                <span className="text-xs text-gray-500">Updating...</span>
              )}
            </div>

            {/* Line total */}
            <div className="font-bold text-slate-900">
              ${(item.quantity * item.price).toFixed(2)}
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item.giftCardId)}
              aria-label={`Remove ${item.brand} from cart`}
              className="ml-2 p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="mt-8 flex justify-between items-center font-semibold text-lg border-t border-blue-50 pt-6">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      {/* Payment Method Selection */}
      <div className="w-full mt-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-900">Select Payment Method</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-blue-50">
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={() => setPaymentMethod('bank_transfer')}
            />
            <span>Bank Transfer / CCP Deposit</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-blue-50">
            <input
              type="radio"
              name="paymentMethod"
              value="baridimob"
              checked={paymentMethod === 'baridimob'}
              onChange={() => setPaymentMethod('baridimob')}
            />
            <span>BaridiMob</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-green-50">
            <input
              type="radio"
              name="paymentMethod"
              value="whatsapp"
              checked={paymentMethod === 'whatsapp'}
              onChange={() => setPaymentMethod('whatsapp')}
            />
            <span>💬 Contact us on WhatsApp</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-blue-50">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={() => setPaymentMethod('online')}
            />
            <span>Online Payment (Coming Soon)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-end gap-4">
        <button
          onClick={() => clearCart()}
          className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Clear Cart
        </button>
        <button
          disabled={loading}
          onClick={handleCheckout}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:shadow-lg hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </main>
  );
}
