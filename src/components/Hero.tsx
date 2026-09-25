import heroImg from "@/assets/hero.jpg";
import { CONTACT } from "@/data/menu";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      <img
        src={heroImg}
        alt="Arabian Chick, N signature feast — wings, BBQ and pizza"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep via-charcoal-deep/85 to-charcoal-deep/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-transparent to-charcoal-deep/60" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <span className="animate-rise animate-rise-1 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent">
          🔥 Best Offer — New Arrival
        </span>
        <h1 className="animate-rise animate-rise-2 mt-6 max-w-3xl font-display text-5xl font-black leading-[1.05] tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
          Arabian Chick,{" "}
          <span className="bg-gradient-to-r from-brand-red via-brand-gold to-brand-gold bg-clip-text text-transparent">
            N
          </span>
        </h1>
        <p className="animate-rise animate-rise-3 mt-5 max-w-xl text-lg font-medium text-foreground/85 sm:text-xl">
          Fast Food &amp; Pizza Restaurant — Peshawar. Crispy wings, sizzling
          BBQ and handcrafted pizzas, served hot &amp; fresh.
        </p>
        <div className="animate-rise animate-rise-4 mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#menu"
            className="inline-flex h-14 items-center rounded-xl bg-primary px-8 font-display text-base font-bold text-primary-foreground shadow-[0_10px_30px_-8px_var(--brand-red)] transition-transform hover:scale-105"
          >
            Explore Menu
          </a>
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center rounded-xl border-2 border-accent px-8 font-display text-base font-bold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Order on WhatsApp
          </a>
        </div>

        <div className="animate-rise animate-rise-4 mt-14 flex flex-wrap gap-x-10 gap-y-4 text-sm font-semibold text-foreground/75">
          <span>🍗 Fresh Wings Daily</span>
          <span>🍕 10+ Pizza Varieties</span>
          <span>🛵 Fast Home Delivery</span>
        </div>
      </div>
    </section>
  );
}
