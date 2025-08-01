// src/features/dashboard/DashboardHowItWorks.tsx
const STEPS = [
    { emoji: "🛒", title: "Browse", desc: "Pick from the best brands." },
    { emoji: "💳", title: "Buy Instantly", desc: "Checkout quickly and securely." },
    { emoji: "📧", title: "Get Your Code", desc: "Codes arrive fast by email!" },
    { emoji: "🎁", title: "Use or Gift", desc: "Redeem or share your card anytime." }
  ];
  
  export function DashboardHowItWorks() {
    return (
      <section className="container mx-auto my-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center bg-white rounded-lg shadow p-6 text-center"
            >
              <div className="text-4xl mb-3">{step.emoji}</div>
              <div className="font-bold mb-1">{step.title}</div>
              <div className="text-gray-600 text-sm">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  