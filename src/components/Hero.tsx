import { useRef } from "react";
import heroImg from "@/assets/hero.jpg";

const FLOATERS = [
  { emoji: "🍕", className: "right-[8%] top-[18%] text-7xl", depth: 60, delay: "0s" },
  { emoji: "🍗", className: "right-[28%] top-[62%] text-6xl", depth: 40, delay: "-2s" },
  { emoji: "🔥", className: "right-[12%] top-[70%] text-5xl", depth: 80, delay: "-4s" },
  { emoji: "🌶️", className: "right-[38%] top-[14%] text-4xl", depth: 30, delay: "-1s" },
  { emoji: "🍟", className: "right-[4%] top-[45%] text-5xl", depth: 50, delay: "-3s" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // -1 se +1 ke beech
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty("--mx", x.toFixed(3));
    el.style.setProperty("--my", y.toFixed(3));
  };

  const handleLeave = () => {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  return (
    <section
      ref={ref}
      id="home"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ ["--mx" as string]: 0, ["--my" as string]: 0 }}
      className="relative flex min-h-screen items-center overflow-hidden perspective-distant"
    >
      {/* Background: parallax + slow zoom (Ken Burns) */}
      <div
        className="absolute -inset-10 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: "translate3d(calc(var(--mx) * -25px), calc(var(--my) * -25px), 0)",
        }}
      >
        <img
          src={heroImg}
          alt="Arabian Chick, N signature feast — wings, BBQ and pizza"
          className="animate-kenburns h-full w-full object-cover object-center"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-charcoal-deep via-charcoal-deep/80 to-charcoal-deep/20" />
      <div className="absolute inset-0 bg-linear-to-t from-charcoal-deep via-transparent to-charcoal-deep/50" />

      {/* Glow */}
      <div className="animate-glow pointer-events-none absolute right-[10%] top-1/2 h-112 w-md -translate-y-1/2 rounded-full bg-brand-red/25 blur-[120px]" />

      {/* Floating 3D food (sirf desktop par) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block transform-3d">
        {FLOATERS.map((f) => (
          <div
            key={f.emoji}
            className={`absolute transition-transform duration-300 ease-out ${f.className}`}
            style={{
              transform: `translate3d(calc(var(--mx) * ${f.depth}px), calc(var(--my) * ${f.depth}px), 0)`,
            }}
          >
            <span
              className="animate-float3d block drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]"
              style={{ animationDelay: f.delay }}
            >
              {f.emoji}
            </span>
          </div>
        ))}
      </div>

      {/* Content: halka 3D tilt */}
      <div
        className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-36 transition-transform duration-300 ease-out sm:px-6 lg:px-8"
        style={{
          transform: "rotateY(calc(var(--mx) * 3deg)) rotateX(calc(var(--my) * -3deg))",
        }}
      >
        <span className="animate-rise animate-rise-1 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent backdrop-blur-sm">
          🔥 Best Offer — New Arrival
        </span>

        <h1 className="animate-rise animate-rise-2 mt-6 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-foreground text-balance [text-shadow:0_10px_40px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-5xl">
          Arabian Chick,{" "}
          <span className="bg-linear-to-r from-brand-red via-brand-gold to-brand-gold bg-clip-text text-transparent">
            N
          </span>
        </h1>
        <p className="animate-rise animate-rise-3 mt-5 max-w-xl text-lg font-medium text-foreground/85 sm:text-xl">
          Fast Food &amp; Pizza Restaurant — Peshawar. Crispy wings, sizzling BBQ and handcrafted
          pizzas, served hot &amp; fresh.
        </p>

        <div className="animate-rise animate-rise-4 mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#menu"
            className="inline-flex h-14 items-center rounded-xl bg-primary px-8 font-display text-base font-bold text-primary-foreground shadow-[0_10px_30px_-8px_var(--brand-red)] transition-transform hover:-translate-y-1 hover:scale-105"
          >
            Explore Menu
          </a>
          <a
            href="#deals"
            className="inline-flex h-14 items-center rounded-xl border-2 border-accent px-8 font-display text-base font-bold text-accent backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground"
          >
            View Deals
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
