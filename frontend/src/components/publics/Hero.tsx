import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-28 px-6 text-center flex flex-col items-center justify-center animate-gradient">
      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <h1 className="relative text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto drop-shadow-lg">
        The Best{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-400">
          Gift Card
        </span>{" "}
        Store
      </h1>
      <p className="relative mt-6 text-lg md:text-xl max-w-2xl mx-auto text-blue-100 leading-relaxed">
        Instant digital delivery • Trusted brands • Great prices
      </p>

      <button
        onClick={() => navigate('/shop')}
        className="relative mt-10 px-10 py-4 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:shadow-2xl hover:bg-blue-50 hover:text-fuchsia-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-400"
        aria-label="Browse Gift Cards"
      >
        Shop Now
      </button>
    </section>
  );
}
