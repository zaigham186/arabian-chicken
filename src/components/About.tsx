import aboutImg from "@/assets/about.jpg";

const STATS = [
  { icon: "🍕", label: "10+ Pizza Varieties" },
  { icon: "🍗", label: "Fresh Wings Daily" },
  { icon: "🛵", label: "Fast Home Delivery" },
];

export function About() {
  return (
    <section id="about" className="bg-cream py-20 text-cream-foreground sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-red">
            About Us
          </span>
          <h2 className="heading-underline mt-2 font-display text-4xl font-black text-balance sm:text-5xl">
            About Arabian Chick, N
          </h2>
          <p className="mt-7 text-lg font-medium leading-relaxed text-cream-foreground/80">
            Arabian Chick, N is Peshawar&apos;s go-to destination for crispy
            wings, sizzling BBQ, and handcrafted pizzas. We&apos;re passionate
            about bold flavors, generous portions, and lightning-fast delivery.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white p-5 text-center shadow-md ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="text-3xl">{stat.icon}</span>
                <p className="mt-2 text-sm font-bold leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl bg-gradient-to-br from-brand-red to-brand-gold" />
          <img
            src={aboutImg}
            alt="Chef at Arabian Chick, N pulling a fresh pizza from the oven"
            loading="lazy"
            width={1024}
            height={1024}
            className="relative h-full max-h-[520px] w-full rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
