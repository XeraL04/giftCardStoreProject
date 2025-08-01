import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export type GiftCard = {
  _id: string;
  brand: string;
  value: number;
  imageUrl: string;
  stock: number;
  price: number;
};

export function GiftCardList() {
  const [data, setData] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGiftCards = () => {
    setLoading(true);
    setError(null);

    api.get('/giftcards')
      .then(res => {
        setData(res.data.giftCards || []);
      })
      .catch(err => setError(err.message || 'Could not load gift cards.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  if (loading) return <div className="text-center py-10">Loading gift cards...</div>;
  if (error) return (
    <div className="text-center py-10 text-red-600">
      <p>Error: {error}</p>
      <button
        onClick={fetchGiftCards}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Retry
      </button>
    </div>
  );

  if (data.length === 0) return (
    <div className="text-center py-10 text-gray-500">
      No gift cards available right now. Please check back later.
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map(card => (
        <article
          key={card._id}
          className="bg-white rounded-lg shadow hover:shadow-md hover:scale-[1.03] transition-transform p-5 flex flex-col items-center"
          tabIndex={0}
          aria-label={`${card.brand} Gift Card`}
        >
          <img
            src={card.imageUrl}
            alt={`${card.brand} logo`}
            className="h-24 w-24 object-contain mb-3 rounded"
            loading="lazy"
          />
          <h3 className="font-semibold text-lg text-center">{card.brand}</h3>
          <p className="text-gray-600 mt-1 text-center">${card.price.toFixed(2)} &bull; Value: ${card.value.toFixed(2)}</p>
          <Link
            to={`/giftcards/${card._id}`}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition text-center w-full"
          >
            View Details
          </Link>
        </article>
      ))}
    </div>
  );
}
