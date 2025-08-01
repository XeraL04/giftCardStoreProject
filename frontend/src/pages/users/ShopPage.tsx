import { useEffect, useState, useRef, useCallback } from 'react';
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

export default function ShopPage() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & filtering state
  const [page, setPage] = useState(1);
  const limit = 12; // how many items per page to fetch
  const [totalPages, setTotalPages] = useState(1);

  // Filters & search
  const [brandFilter, setBrandFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // List of all brands (for filter dropdown)
  const [allBrands, setAllBrands] = useState<string[]>([]);

  // Ref for scroll container to add infinite scroll
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all brands once, for filter dropdown
  useEffect(() => {
    api.get<GiftCard[]>('/giftcards')
      .then(res => {
        const brands = Array.from(new Set(res.data.map(card => card.brand))).sort();
        setAllBrands(brands);
      })
      .catch(() => {
        // ignore brand loading errors for now
      });
  }, []);

  const fetchGiftCards = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('limit', limit.toString());
      if (brandFilter) params.append('brand', brandFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await api.get<{
        giftCards: GiftCard[];
        currentPage: number;
        totalPages: number;
        totalGiftCards: number;
      }>(`/giftcards?${params.toString()}`);

      setTotalPages(res.data.totalPages);

      if (append) {
        setGiftCards(prev => [...prev, ...res.data.giftCards]);
      } else {
        setGiftCards(res.data.giftCards);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load gift cards.');
    } finally {
      setLoading(false);
    }
  }, [brandFilter, searchTerm]);

  // Load initial and on filter/search/page change
  useEffect(() => {
    fetchGiftCards(1, false);
    setPage(1);
  }, [brandFilter, searchTerm, fetchGiftCards]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading) return;
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // If user scrolled within 100px of bottom and has more pages
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (page < totalPages) {
        const nextPage = page + 1;
        fetchGiftCards(nextPage, true);
        setPage(nextPage);
      }
    }
  }, [loading, page, totalPages, fetchGiftCards]);

  // Attach scroll event listener to the scrolling container
  useEffect(() => {
    const current = containerRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Shop Gift Cards</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by brand..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64"
          aria-label="Search gift cards by brand"
        />
        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-48"
          aria-label="Filter gift cards by brand"
        >
          <option value="">All Brands</option>
          {allBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Gift Cards Grid with scroll container for infinite scroll */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-auto max-h-[75vh]"
        tabIndex={0}
      >
        {giftCards.map(card => (
          <div
            key={card._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
          >
            <img
              src={card.imageUrl}
              alt={card.brand}
              className="h-28 w-28 object-contain mb-4 rounded"
            />
            <div className="font-bold text-lg">{card.brand}</div>
            <div className="text-gray-600 mb-2">${card.price} &bull; Value: ${card.value}</div>
            <div className="mb-4">
              {card.stock > 0 ? (
                `In stock: ${card.stock}`
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>
            <Link
              to={`/giftcards/${card._id}`}
              className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center w-full"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4 text-gray-600">Loading more gift cards...</div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center py-4 text-red-600">{error}</div>
      )}

      {/* No results message */}
      {!loading && giftCards.length === 0 && (
        <div className="text-center py-8 text-gray-600">No gift cards found.</div>
      )}
    </main>
  );
}
