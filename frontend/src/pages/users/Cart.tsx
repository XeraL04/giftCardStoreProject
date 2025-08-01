import { useCartStore } from '../../app/store';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/client';

export default function Cart() {
  const items = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  const [loading, setLoading] = useState(false);
  const [updatingItemIds, setUpdatingItemIds] = useState<string[]>([]);

  const navigate = useNavigate();

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSimulateCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/orders/simulate-checkout', {
        items: items.map(({ giftCardId, quantity }) => ({ giftCardId, quantity })),
      });
      clearCart(); // clear cart on successful order simulation
      navigate('/checkout/success', { state: { orders: response.data.orders } });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Simulated checkout failed');
    } finally {
      setLoading(false);
    }
  };


  const handleQuantityChange = (giftCardId: string, qty: number) => {
    if (qty < 1) return;
    setUpdatingItemIds(prev => [...prev, giftCardId]);
    updateQuantity(giftCardId, qty);
    setUpdatingItemIds(prev => prev.filter(id => id !== giftCardId));
  };




  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center text-gray-600">
        Your cart is empty. <Link to="/shop" className="text-blue-600 underline">Shop now</Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto my-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <ul className="divide-y divide-gray-200">
        {items.map(item => (
          <li key={item.giftCardId} className="flex items-center py-4 gap-4">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.brand}
                className="w-20 h-20 object-contain rounded"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-lg">{item.brand}</div>
              <div className="text-gray-600">${item.price} per card</div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`quantity-${item.giftCardId}`} className="sr-only">
                Quantity
              </label>
              <input
                id={`quantity-${item.giftCardId}`}
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    handleQuantityChange(item.giftCardId, val);
                  }
                }}
                className="w-16 border rounded px-2 py-1"
              />
            </div>
            <div className="ml-6 font-semibold">${(item.quantity * item.price).toFixed(2)}</div>
            <button
              onClick={() => removeFromCart(item.giftCardId)}
              className="ml-6 text-red-600 hover:text-red-800"
              aria-label={`Remove ${item.brand} from cart`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-between items-center font-semibold text-xl">
        <div>Total:</div>
        <div>${totalPrice.toFixed(2)}</div>
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button
          className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          onClick={() => clearCart()}
        >
          Clear Cart
        </button>
        <button
          disabled={loading}
          onClick={handleSimulateCheckout}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </main>
  );
}
