import apple from '../../assets/logos/apple.png';
import netflix from '../../assets/logos/netflix.png';
import social from '../../assets/logos/social.png';
import spotify from '../../assets/logos/spotify.png';

const COMMON_CARDS = [
  { name: "Amazon", logo: social },
  { name: "Netflix", logo: netflix },
  { name: "Apple", logo: apple },
  { name: "Spotify", logo: spotify },
];

export function DashboardCommonGiftCards() {
  return (
    <section className="container mx-auto my-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Section Title */}
      <h2 className="relative text-2xl sm:text-3xl font-extrabold mb-10 text-slate-900 text-center">
        Popular Brands
        <span className="block mx-auto mt-2 w-16 sm:w-24 h-1 rounded bg-gradient-to-r from-blue-500 via-fuchsia-400 to-purple-500" />
      </h2>

      {/* Brand Grid */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
        {COMMON_CARDS.map((card, idx) => (
          <div
            key={card.name}
            tabIndex={0}
            role="button"
            aria-label={`Browse ${card.name} gift cards`}
            className="group flex flex-col items-center w-24 sm:w-32 p-5 sm:p-6 bg-white/80 backdrop-blur-sm border border-blue-50 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <div className="relative mb-4">
              <img
                src={card.logo}
                alt={card.name}
                className="h-14 sm:h-16 w-14 sm:w-16 object-contain rounded-full bg-gray-100 p-2 shadow-md ring-2 ring-blue-100 group-hover:ring-blue-300 transition"
                loading="lazy"
              />
              {idx < 2 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-blue-600 to-purple-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                  Hot
                </span>
              )}
            </div>
            <span className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
              {card.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
