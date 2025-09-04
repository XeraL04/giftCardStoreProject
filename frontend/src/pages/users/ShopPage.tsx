import { useEffect, useState, useCallback } from 'react';
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

  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);

  const [brandFilter, setBrandFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [allBrands, setAllBrands] = useState<string[]>([]);

  useEffect(() => {
    api.get<GiftCard[]>('/giftcards')
      .then(res => {
        const brands = Array.from(new Set(res.data.map(card => card.brand))).sort();
        setAllBrands(brands);
      })
      .catch(() => { /* ignore */ });
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

  useEffect(() => {
    fetchGiftCards(1, false);
    setPage(1);
  }, [brandFilter, searchTerm, fetchGiftCards]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        if (page < totalPages) {
          const nextPage = page + 1;
          fetchGiftCards(nextPage, true);
          setPage(nextPage);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page, totalPages, fetchGiftCards]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Section Header */}
      <h1 className="relative text-4xl font-extrabold mb-10 text-center text-slate-900">
        Shop Gift Cards
        <span className="block mx-auto mt-2 w-24 h-1 rounded bg-gradient-to-r from-blue-500 via-fuchsia-400 to-purple-500" />
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by brand..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Search gift cards by brand"
        />
        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className="w-full sm:w-56 px-4 py-3 rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Filter gift cards by brand"
        >
          <option value="">All Brands</option>
          {allBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Gift Cards Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
        aria-label="Gift card results"
      >
        {giftCards.length > 0 && giftCards.map(card => (
          <article
            key={card._id}
            className="group flex flex-col items-center bg-white/80 backdrop-blur-sm border border-blue-50 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform focus:ring-2 focus:ring-blue-400 outline-none p-6"
            tabIndex={0}
            aria-label={`${card.brand} Gift Card`}
          >
            <div className="relative mb-4">
              <img
                src={card.imageUrl}
                alt={card.brand}
                className="h-24 w-24 object-contain rounded-full bg-gray-100 p-2 shadow-md ring-2 ring-blue-100 group-hover:ring-blue-300 transition"
                loading="lazy"
              />
              {card.stock <= 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-700 transition">
              {card.brand}
            </div>
            <div className="text-gray-600 mb-2 text-sm">
              {card.stock > 0
                ? <span className="text-green-700 font-medium">In stock: {card.stock}</span>
                : <span className="text-red-500 font-medium">Out of Stock</span>
              }
            </div>
            <div className="mb-4 text-[15px]">
              <span className="text-gray-700 font-semibold">Value:</span> ${card.value}
              <span className="mx-1 text-gray-400">&middot;</span>
              <span className="text-gray-700 font-semibold">Price:</span>
              <span className="text-green-600 font-semibold"> ${card.price}</span>
            </div>
            <Link
              to={`/giftcards/${card._id}`}
              className="mt-auto w-full py-2 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white font-semibold rounded-full shadow hover:shadow-lg hover:from-blue-700 hover:to-fuchsia-600 transition-all text-center"
            >
              View Details
            </Link>
          </article>
        ))}

        {/* Empty state */}
        {!loading && !error && giftCards.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 bg-white/70 rounded-2xl shadow-inner">
            No gift cards found.
          </div>
        )}

        {/* Skeleton loaders */}
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-60 rounded-3xl bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse"
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center py-6 text-red-600 font-semibold mt-5">{error}</div>
      )}
    </main>
  );
}
