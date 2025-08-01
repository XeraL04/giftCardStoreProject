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

  useEffect(() => {
    setLoading(true);
    setError(null);

    api.get('/giftcards')
      .then(res => {
        // res.data is like { giftCards: [...], currentPage, totalPages ... }
        setData(res.data.giftCards || []);
      })
      .catch(err => setError(err.message || 'Could not load gift cards.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading gift cards...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map(card => (
        <div key={card._id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <img src={card.imageUrl} alt={card.brand} className="h-24 w-24 object-contain mb-2" />
          <div className="font-bold">{card.brand}</div>
          <div className="text-gray-600">${card.price} &bull; Value: ${card.value}</div>
          <Link
            to={`/giftcards/${card._id}`}
            className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition text-center w-full"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
