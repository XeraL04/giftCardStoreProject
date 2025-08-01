import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import { useEffect } from 'react';
import { useCartStore } from '../../app/store';
import type { GiftCard } from '../../types/GiftCards';

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
          err.response?.data?.message || err.message || 'Could not load gift card details.'
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

    alert(`Added ${quantity} ${giftCard.brand} gift card(s) to cart`);
    navigate('/cart'); // Optional: navigate to Cart page after adding
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">
        {error}
        <button
          onClick={() => navigate(-1)}
          className="ml-4 underline text-blue-500"
        >
          Back
        </button>
      </div>
    );

  if (!giftCard) return <div className="py-10 text-center">Gift card not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow-lg p-8 my-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm underline text-blue-500"
      >
        &larr; Back
      </button>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={giftCard.imageUrl}
          alt={giftCard.brand}
          className="h-40 w-40 object-contain bg-gray-100 rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{giftCard.brand} Gift Card</h1>
          <div className="text-lg mb-2">
            <span className="font-semibold">Value:</span> ${giftCard.value}
          </div>
          <div className="text-lg mb-2">
            <span className="font-semibold">Price:</span>{' '}
            <span className="text-green-600">${giftCard.price}</span>
          </div>
          <div className="mb-4 text-gray-500">
            <span className="font-semibold">Stock:</span>{' '}
            {giftCard.stock > 0 ? giftCard.stock : <span className="text-red-500">Out of stock</span>}
          </div>

          {giftCard.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label htmlFor="quantity" className="font-semibold">
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
                className="border rounded w-20 px-2 py-1"
              />
            </div>
          )}

          <button
            disabled={giftCard.stock < 1}
            className={`px-6 py-2 text-white rounded font-semibold transition ${
              giftCard.stock < 1
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleAddToCart}
          >
            {giftCard.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
