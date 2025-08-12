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
    <div className="flex flex-col gap-24 min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50">
      {/* Hero Section */}
      <Hero />

      {/* Section: Shop by Category */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <h2 className="relative text-4xl font-black mb-10 text-center text-slate-900">
          Shop by Category
          <span className="block mx-auto mt-2 w-20 h-1 rounded bg-gradient-to-r from-blue-500 via-fuchsia-400 to-purple-500" />
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {categories.map((cat, idx) => (
            <div
              key={cat.name}
              tabIndex={0}
              role="button"
              aria-label={`Shop gift cards from ${cat.name}`}
              className="group flex flex-col items-center w-32 p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-50 hover:bg-gradient-to-tr hover:from-blue-100 hover:to-violet-100 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer focus:ring-2 focus:ring-blue-400"
            >
              <div className="relative mb-4">
                <img
                  src={cat.logo}
                  alt={cat.name}
                  className="h-16 w-16 rounded-full object-contain bg-gray-100 p-2 shadow-md ring-2 ring-blue-100 group-hover:ring-blue-300 transition"
                  loading="lazy"
                />
                {/* Optional trending badge */}
                {idx === 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-blue-600 to-purple-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    Popular
                  </span>
                )}
              </div>
              <span className="text-base font-semibold text-slate-900 group-hover:text-blue-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Featured Gift Cards */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <h2 className="relative text-4xl font-black mb-10 text-slate-900">
          Featured Gift Cards
          <span className="block mt-2 w-20 h-1 rounded bg-gradient-to-r from-purple-500 via-fuchsia-400 to-blue-500" />
        </h2>
        <GiftCardList />
      </section>

      {/* Section: How It Works */}
      <section className="container mx-auto max-w-7xl py-16 px-6 bg-white/90 rounded-3xl shadow-2xl border border-blue-50">
        <h2 className="relative text-4xl font-black mb-12 text-center text-slate-900">
          How It Works
          <span className="block mx-auto mt-2 w-24 h-1 rounded bg-gradient-to-r from-blue-600 via-fuchsia-400 to-purple-600" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center max-w-xs mx-auto bg-gradient-to-tr from-blue-50/80 via-white to-purple-50/80 p-7 rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-700 text-5xl rounded-full border-4 border-blue-200 shadow mb-6">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">
                {step.title}
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">{step.text}</p>
              {/* Arrow between steps, only on md+ */}
              {idx < howItWorksSteps.length - 1 && (
                <span
                  className="hidden md:block mt-6 text-blue-300 text-4xl font-bold select-none"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* (Optional) Call-to-Action or Testimonial */}
      <section className="max-w-4xl mx-auto mt-16 mb-4 px-6">
        <div className="bg-gradient-to-r from-blue-600 to-fuchsia-500 py-8 px-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-white animate-gradient">
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">Ready to Send the Perfect Gift?</h3>
            <p className="text-lg">Fast, secure, and effortless. Try sending your first gift card today!</p>
          </div>
          <a
            href="/giftcards"
            className="inline-block mt-4 sm:mt-0 px-7 py-3 bg-white text-blue-700 font-bold rounded-full shadow transition-all hover:bg-blue-50 hover:text-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          >
            Get Started
          </a>
        </div>
      </section>

    </div>
  );
}
