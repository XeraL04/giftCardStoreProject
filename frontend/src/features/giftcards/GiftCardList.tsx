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

    api
      .get('/giftcards')
      .then(res => {
        setData(res.data.giftCards || []);
      })
      .catch(err =>
        setError(err.message || 'Could not load gift cards.')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  /** 🔹 Skeleton Loader when loading */
  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-3xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          ></div>
        ))}
      </div>
    );

  /** 🔹 Error State with accent style */
  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg font-semibold">⚠ {error}</p>
        <button
          onClick={fetchGiftCards}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow hover:shadow-lg transition"
        >
          Retry
        </button>
      </div>
    );

  /** 🔹 Empty state with matching style */
  if (data.length === 0)
    return (
      <div className="text-center py-16 text-gray-500 bg-white/80 backdrop-blur-md rounded-2xl shadow-inner">
        No gift cards available right now. Please check back later.
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {data.map(card => (
        <article
          key={card._id}
          className="group relative bg-white/80 backdrop-blur-sm border border-blue-50 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform p-6 flex flex-col items-center text-center"
          tabIndex={0}
          aria-label={`${card.brand} Gift Card`}
        >
          {/* Brand image */}
          <div className="relative mb-4">
            <img
              src={card.imageUrl}
              alt={`${card.brand} logo`}
              className="h-24 w-24 object-contain rounded-full bg-gray-100 p-3 shadow-md ring-2 ring-blue-100 group-hover:ring-blue-300 transition"
              loading="lazy"
            />
            {card.stock <= 5 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                Low Stock
              </span>
            )}
          </div>

          {/* Brand name */}
          <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-blue-700">
            {card.brand}
          </h3>

          {/* Value & Price */}
          <p className="text-gray-600 mb-4">
            Value:{" "}
            <span className="font-semibold text-slate-900">
              ${card.value.toFixed(2)}
            </span>{" "}
            | Price:{" "}
            <span className="font-semibold text-green-600">
              ${card.price.toFixed(2)}
            </span>
          </p>

          {/* CTA Button */}
          <Link
            to={`/giftcards/${card._id}`}
            className="mt-auto w-full py-3 px-5 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold rounded-full shadow hover:shadow-xl hover:from-blue-600 hover:to-fuchsia-600 transition-all"
          >
            View Details
          </Link>
        </article>
      ))}
    </div>
  );
}
