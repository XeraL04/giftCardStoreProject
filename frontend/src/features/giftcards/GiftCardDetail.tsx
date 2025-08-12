import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import { useCartStore } from '../../app/store';
import type { GiftCard } from '../../types/GiftCards';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function GiftCardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get<GiftCard>(`/giftcards/${id}`)
      .then(res => setGiftCard(res.data))
      .catch(err =>
        setError(
          err.response?.data?.message ||
            err.message ||
            'Could not load gift card details.'
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!giftCard || quantity < 1 || quantity > giftCard.stock) {
      alert('Invalid quantity or out of stock');
      return;
    }
    addToCart({
      giftCardId: giftCard._id,
      brand: giftCard.brand,
      price: giftCard.price,
      quantity,
      imageUrl: giftCard.imageUrl,
    });

    navigate('/cart');
  };

  // Skeleton Loader
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-10">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="h-80 bg-gray-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-fuchsia-600 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" /> Back
        </button>
      </div>
    );
  }

  if (!giftCard) {
    return (
      <div className="py-16 text-center text-gray-500">Gift card not found.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-fuchsia-600 transition font-medium"
      >
        <ArrowLeftIcon className="w-5 h-5" /> Back
      </button>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-50 overflow-hidden flex flex-col md:flex-row gap-10 p-8">
        {/* Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={giftCard.imageUrl}
            alt={giftCard.brand}
            className="h-56 w-56 object-contain bg-gray-100 p-4 rounded-2xl shadow-md ring-2 ring-blue-100"
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {giftCard.brand} Gift Card
          </h1>
          <p className="text-gray-500 mb-4">
            Perfect gift for family, friends, or yourself. Instant delivery and secure checkout.
          </p>

          <div className="flex items-center gap-6 mb-4">
            <div>
              <span className="block text-sm text-gray-500">Value</span>
              <span className="text-lg font-semibold">${giftCard.value}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Price</span>
              <span className="text-lg font-semibold text-green-600">${giftCard.price}</span>
            </div>
          </div>

          <div className="mb-6">
            {giftCard.stock > 0 ? (
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                In Stock ({giftCard.stock})
              </span>
            ) : (
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {giftCard.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label htmlFor="quantity" className="font-semibold text-slate-700">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={giftCard.stock}
                value={quantity}
                onChange={e => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val)) val = 1;
                  if (val > giftCard.stock) val = giftCard.stock;
                  if (val < 1) val = 1;
                  setQuantity(val);
                }}
                className="border border-blue-200 rounded-lg w-20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Action Button */}
          <button
            disabled={giftCard.stock < 1}
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-full font-semibold transition-all shadow-md ${
              giftCard.stock < 1
                ? 'bg-gray-300 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600'
            }`}
          >
            {giftCard.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
