// src/features/dashboard/DashboardFeaturedGiftCards.tsx
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

// Define the expected response structure from your backend API
type GiftCardsApiResponse = {
  totalGiftCards: number;
  totalPages: number;
  currentPage: number;
  giftCards: GiftCard[]; // The array of gift cards is here
};

export function DashboardFeaturedGiftCards() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Correctly type the response to match your backend's API structure
    api.get<GiftCardsApiResponse>('/giftcards?limit=4') // assuming limit param; adjust as needed
      .then(res => {
        // Correctly access the giftCards array from the response data
        setGiftCards(res.data.giftCards);
      })
      .catch(() => setGiftCards([])) // Set to empty array on error
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
      {loading ? (
        <div className="text-center py-8">Loading cards...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {giftCards.length > 0 ? ( // Add a check if there are actually gift cards to map
            giftCards.map(card => (
              <div key={card._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                {card.imageUrl && ( // Safely render image if imageUrl exists
                  <img src={card.imageUrl} alt={card.brand} className="h-20 w-20 object-contain mb-2" />
                )}
                <div className="font-bold text-lg">{card.brand}</div>
                <div className="text-gray-600">${card.price} &bull; Value: ${card.value}</div>
                <Link
                  to={`/giftcards/${card._id}`}
                  className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition text-center w-full"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">No featured gift cards available.</div>
          )}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Link to="/shop" className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition font-bold text-lg">
          See More Gift Cards
        </Link>
      </div>
    </section>
  );
}