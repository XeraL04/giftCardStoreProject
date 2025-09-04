const STEPS = [
  { emoji: "🛒", title: "Browse", desc: "Pick from the best brands." },
  { emoji: "💳", title: "Buy Instantly", desc: "Checkout quickly and securely." },
  { emoji: "📧", title: "Get Your Code", desc: "Codes arrive fast by email!" },
  { emoji: "🎁", title: "Use or Gift", desc: "Redeem or share your card anytime." }
];

export function DashboardHowItWorks() {
  return (
    <section className="container mx-auto my-3 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Section Header */}
      <h2 className="relative text-2xl sm:text-3xl font-extrabold mb-12 text-center text-slate-900">
        How It Works
        <span className="block mx-auto mt-2 w-16 sm:w-24 h-1 rounded bg-gradient-to-r from-blue-500 via-fuchsia-400 to-purple-500" />
      </h2>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {STEPS.map((step, idx) => (
          <div
            key={step.title}
            className="group flex flex-col items-center text-center bg-white/80 backdrop-blur-sm border border-blue-50 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 text-3xl sm:text-4xl mb-4 sm:mb-5 shadow-md group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-fuchsia-500 group-hover:text-white transition-all">
              {step.emoji}
            </div>

            {/* Title */}
            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
              {step.title}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              {step.desc}
            </p>

            {/* Connector arrow (desktop only) */}
            {idx < STEPS.length - 1 && (
              <span
                className="hidden md:block mt-6 text-blue-300 text-3xl font-extrabold select-none"
                aria-hidden="true"
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
