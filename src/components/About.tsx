import { useEffect, useRef, useState } from "react";
import aboutImg from "@/assets/about.jpg";

const STATS = [
  { icon: "🍕", label: "10+ Pizza Varieties" },
  { icon: "🍗", label: "Fresh Wings Daily" },
  { icon: "🛵", label: "Fast Home Delivery" },
];

/* Section screen par aate hi animation trigger karta hai */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function About() {
  const { ref, inView } = useInView<HTMLElement>();
  const imgWrapRef = useRef<HTMLDivElement>(null);

  /* Image par mouse ke saath halka 3D tilt */
  const handleMove = (e: React.MouseEvent) => {
    const el = imgWrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };
  const handleLeave = () => {
    if (imgWrapRef.current) imgWrapRef.current.style.transform = "rotateY(0) rotateX(0)";
  };

  return (
    <section
      ref={ref}
      id="about"
      data-inview={inView}
      className="about-section relative overflow-hidden bg-cream py-20 text-cream-foreground sm:py-24"
    >
      {/* Peeche halke floating blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-blob rounded-full bg-brand-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-blob rounded-full bg-brand-gold/20 blur-3xl [animation-delay:-6s]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left: text */}
        <div>
          <span className="about-reveal about-d1 inline-block text-xs font-black uppercase tracking-[0.2em] text-brand-red">
            About Us
          </span>
          <h2 className="about-reveal about-d2 heading-underline mt-2 font-display text-4xl font-black text-balance sm:text-5xl">
            About Arabian Chick, N
          </h2>
          <p className="about-reveal about-d3 mt-7 text-lg font-medium leading-relaxed text-cream-foreground/80">
            Arabian Chick, N is Peshawar&apos;s go-to destination for crispy
            wings, sizzling BBQ, and handcrafted pizzas. We&apos;re passionate
            about bold flavors, generous portions, and lightning-fast delivery.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="about-reveal group rounded-2xl bg-white p-5 text-center shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-brand-red/30"
                style={{ transitionDelay: `${0.5 + i * 0.15}s`, animationDelay: `${0.5 + i * 0.15}s` }}
              >
                <span className="animate-bob inline-block text-3xl transition-transform duration-300 group-hover:scale-125" style={{ animationDelay: `${i * 0.4}s` }}>
                  {stat.icon}
                </span>
                <p className="mt-2 text-sm font-bold leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image */}
        <div className="about-image-reveal relative perspective-[                                                                                                       1000px]">
          <div
            ref={imgWrapRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="relative transition-transform duration-300 ease-out transform-3d"
          >
            {/* Gradient frame: halka hilta rehta hai */}
            <div className="animate-frame absolute -left-4 -top-4 h-full w-full rounded-3xl bg-linear-to-br from-brand-red to-brand-gold" />

            <div className="group relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={aboutImg}
                alt="Chef at Arabian Chick, N pulling a fresh pizza from the oven"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full max-h-130 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Shine effect */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </div>

            {/* Floating badge */}
            <div
              className="animate-bob absolute -bottom-5 left-6 rounded-2xl bg-white px-5 py-3 shadow-xl ring-1 ring-black/5"
              style={{ transform: "translateZ(40px)" }}
            >
              <p className="font-display text-sm font-black text-brand-red">🔥 Hot &amp; Fresh</p>
              <p className="text-xs font-semibold text-cream-foreground/70">Straight from the oven</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}