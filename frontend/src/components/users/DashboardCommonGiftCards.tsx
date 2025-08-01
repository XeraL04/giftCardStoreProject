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
    <section className="container mx-auto my-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Popular Brands</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {COMMON_CARDS.map(card => (
          <div
            key={card.name}
            className="flex flex-col items-center p-3 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <img src={card.logo} alt={card.name} className="w-16 h-16 object-contain mb-2" />
            <span className="font-medium">{card.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
