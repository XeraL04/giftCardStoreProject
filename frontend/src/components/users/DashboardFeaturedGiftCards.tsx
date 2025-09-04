import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';

export type GiftCard = {
  _id: string;
  brand: string;
  value: number;
  imageUrl?: string;
  stock: number;
  price: number;
};

type GiftCardsApiResponse = {
  totalGiftCards: number;
  totalPages: number;
  currentPage: number;
  giftCards: GiftCard[];
};

export function DashboardFeaturedGiftCards() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<GiftCardsApiResponse>('/giftcards?limit=4')
      .then(res => setGiftCards(res.data.giftCards))
      .catch(() => setGiftCards([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container mx-auto my-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Section Header */}
      <h2 className="relative text-2xl sm:text-3xl font-extrabold mb-10 text-slate-900 text-center">
        Recommended for You
        <span className="block mx-auto mt-2 w-16 sm:w-24 h-1 rounded bg-gradient-to-r from-blue-500 via-fuchsia-400 to-purple-500" />
      </h2>

      {/* Loading State - Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-56 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {giftCards.length > 0 ? (
            giftCards.map(card => (
              <div
                key={card._id}
                className="group bg-white/80 backdrop-blur-sm border border-blue-50 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform p-5 sm:p-6 flex flex-col items-center text-center"
              >
                {/* Image */}
                {card.imageUrl && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full bg-gray-100 p-2 sm:p-3 shadow-md ring-2 ring-blue-100 group-hover:ring-blue-300 transition">
                    <img
                      src={card.imageUrl}
                      alt={card.brand}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Brand */}
                <div className="font-bold text-lg text-slate-900 group-hover:text-blue-700">
                  {card.brand}
                </div>

                {/* Price & Value */}
                <div className="text-gray-600 text-sm mt-1 mb-4">
                  Value: <span className="font-semibold">${card.value}</span> | Price:{' '}
                  <span className="text-green-600 font-semibold">${card.price}</span>
                </div>

                {/* CTA */}
                <Link
                  to={`/giftcards/${card._id}`}
                  className="mt-auto w-full py-2 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold rounded-full shadow hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600 transition-all"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500 bg-white/80 backdrop-blur-md rounded-2xl shadow-inner">
              No featured gift cards available.
            </div>
          )}
        </div>
      )}

      {/* See More CTA */}
      <div className="flex justify-center mt-10">
        <Link
          to="/shop"
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:from-blue-700 hover:to-fuchsia-600 transition-all"
        >
          See More Gift Cards
        </Link>
      </div>
    </section>
  );
}
