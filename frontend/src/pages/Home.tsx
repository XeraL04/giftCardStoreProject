import { Hero } from '../components/publics/Hero';
import { GiftCardList } from '../features/giftcards/GiftCardList';
import apple from '../assets/logos/apple.png';
import netflix from '../assets/logos/netflix.png';
import social from '../assets/logos/social.png';
import spotify from '../assets/logos/spotify.png';

// Dummy data for categories (you can extract this or fetch from API)
const categories = [
  { name: "Amazon", logo: social },
  { name: "Netflix", logo: netflix },
  { name: "Apple", logo: apple },
  { name: "Spotify", logo: spotify },
  // Add more as needed
];

// Example steps for "How it Works"
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
    <div>
      <Hero />

      {/* Section 1: Categories */}
      <section className="container mx-auto py-8 px-4">
        <h2 className="text-xl font-bold mb-4 text-center">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center">
              <img
                src={cat.logo}
                alt={cat.name}
                className="h-12 w-12 object-contain mb-2 bg-white p-2 rounded-full shadow"
              />
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Gift Card Grid */}
      <section className="container mx-auto py-8 px-4">
        <h2 className="text-xl font-bold mb-4">Featured Gift Cards</h2>
        <GiftCardList /> {/* Already a grid in your feature! */}
      </section>

      {/* Section 3: How It Works */}
      <section className="container mx-auto py-12 px-4 bg-white rounded-lg shadow-sm my-10">
        <h2 className="text-xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {howItWorksSteps.map((step, idx) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="font-semibold mb-2">{step.title}</div>
              <div className="text-gray-500 text-sm">{step.text}</div>
              {idx < howItWorksSteps.length - 1 && (
                <span className="hidden md:block mt-2 text-3xl text-blue-400">→</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
