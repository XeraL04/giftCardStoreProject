import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 px-6 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto">
        The Best <span className="text-yellow-400">Gift Card</span> Store
      </h1>
      <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-blue-200">
        Instant digital delivery • Trusted brands • Great prices
      </p>
      <button
        onClick={() => navigate('/shop')}
        className="mt-8 px-8 py-4 bg-yellow-400 text-indigo-900 font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        aria-label="Browse Gift Cards"
      >
        Shop Now
      </button>
    </section>
  );
}
