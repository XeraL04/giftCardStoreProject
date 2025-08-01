import { Hero } from '../components/publics/Hero';
import { GiftCardList } from '../features/giftcards/GiftCardList';
import apple from '../assets/logos/apple.png';
import netflix from '../assets/logos/netflix.png';
import social from '../assets/logos/social.png';
import spotify from '../assets/logos/spotify.png';

const categories = [
  { name: "Amazon", logo: social },
  { name: "Netflix", logo: netflix },
  { name: "Apple", logo: apple },
  { name: "Spotify", logo: spotify },
];

const howItWorksSteps = [
  {
    icon: "🛍️",
    title: "Browse Gift Cards",
    text: "Choose from a variety of top brands and categories.",
  },
  {
    icon: "🛒",
    title: "Add to Cart",
    text: "Select your gift card and add it to your shopping cart.",
  },
  {
    icon: "💳",
    title: "Checkout Securely",
    text: "Pay using our secure online payment system.",
  },
  {
    icon: "📧",
    title: "Receive Instantly",
    text: "Get your gift card delivered instantly to your email.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20 bg-gray-50 min-h-screen">
      <Hero />

      {/* Section 1: Categories */}
      <section className="container mx-auto py-12 px-6 max-w-7xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-900">
          Shop by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.name} 
              className="flex flex-col items-center w-28 p-4 bg-white rounded-3xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`Shop gift cards from ${cat.name}`}
            >
              <img
                src={cat.logo}
                alt={cat.name}
                className="h-14 w-14 object-contain mb-3 rounded-full bg-gray-100 p-2"
                loading="lazy"
              />
              <span className="text-md font-semibold text-slate-800">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Gift Card Grid */}
      <section className="container mx-auto py-12 px-6 max-w-7xl">
        <h2 className="text-3xl font-extrabold mb-8 text-slate-900">Featured Gift Cards</h2>
        <GiftCardList />
      </section>

      {/* Section 3: How It Works */}
      <section className="container mx-auto max-w-7xl py-16 px-6 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-12 text-center text-slate-900">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {howItWorksSteps.map((step, idx) => (
            <div 
              key={step.title} 
              className="flex flex-col items-center text-center max-w-xs mx-auto hover:scale-[1.04] transition-transform cursor-default"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-700 text-5xl select-none mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">{step.title}</h3>
              <p className="text-gray-500 text-base leading-relaxed">{step.text}</p>
              {idx < howItWorksSteps.length - 1 && (
                <span 
                  className="hidden md:block mt-6 text-blue-400 text-4xl font-extrabold select-none" 
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
