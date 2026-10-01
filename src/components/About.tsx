import { useEffect, useRef, useState } from "react";
import aboutImg from "@/assets/about.jpg";

const FEATURES = [
  {
    icon: "🍕",
    title: "Handcrafted Pizza",
    description: "Fresh dough, rich toppings & bold flavors.",
  },
  {
    icon: "🍗",
    title: "Fresh Chicken",
    description: "Prepared fresh with our signature recipes.",
  },
  {
    icon: "🔥",
    title: "Made Fresh",
    description: "Every order is prepared with care.",
  },
  {
    icon: "🛵",
    title: "Fast Delivery",
    description: "Hot & fresh food delivered to your door.",
  },
];

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function About() {
  const { ref, inView } = useInView<HTMLElement>();
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = imageRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    element.style.transform = `
      perspective(1000px)
      rotateY(${x * 5}deg)
      rotateX(${-y * 5}deg)
    `;
  };

  const handleLeave = () => {
    if (!imageRef.current) return;

    imageRef.current.style.transform = `
      perspective(1000px)
      rotateY(0deg)
      rotateX(0deg)
    `;
  };

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden bg-cream py-20 sm:py-24 lg:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-gold/15 blur-3xl" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "34px 34px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8">
        {/* =====================================================
            IMAGE
        ===================================================== */}
        <div
          className={`relative order-2 lg:order-1 ${
            inView ? "about-image-visible" : "about-image-hidden"
          }`}
        >
          <div
            ref={imageRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="relative mx-auto max-w-xl transition-transform duration-300 ease-out"
          >
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[2rem] bg-linear-to-br from-brand-red via-brand-red-deep to-brand-gold sm:-bottom-5 sm:-left-5" />

            {/* Image card */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img
                  src={aboutImg}
                  alt="Fresh food being prepared at Arabian Chick, N"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Image gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent opacity-70" />

                {/* Shine */}
                <div className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:left-[120%]" />

                {/* Image label */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-brand-gold shadow-[0_0_10px_var(--brand-gold)]" />
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-white">
                      Fresh From Our Kitchen
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-7 right-4 z-10 rounded-2xl bg-white px-5 py-4 shadow-2xl ring-1 ring-black/5 sm:-right-6 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/10 text-xl">
                  ⭐
                </span>

                <div>
                  <p className="font-display text-sm font-black text-brand-red">Loved by Foodies</p>

                  <p className="mt-0.5 text-xs font-medium text-cream-foreground/60">
                    Quality in every bite
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div
          className={`order-1 lg:order-2 ${
            inView ? "about-content-visible" : "about-content-hidden"
          }`}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-red" />

            <span className="text-xs font-black uppercase tracking-[0.25em] text-brand-red">
              About Arabian Chick, N
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-black leading-[1.08] tracking-tight text-cream-foreground sm:text-5xl lg:text-6xl">
            Good Food.
            <span className="block text-brand-red">Great Moments.</span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-cream-foreground/70 sm:text-lg">
            At Arabian Chick, N, we believe great food brings people together. From crispy chicken
            and sizzling BBQ to handcrafted pizzas, every dish is prepared with fresh ingredients
            and packed with flavor.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-cream-foreground/60 sm:text-base">
            Whether you&apos;re dining with family, meeting friends, or ordering from home, our goal
            is simple — serve delicious food that keeps you coming back.
          </p>

          {/* Feature grid */}
          <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/20 hover:shadow-lg"
                style={{
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-xl transition-transform duration-300 group-hover:scale-110">
                    {feature.icon}
                  </span>

                  <div>
                    <h3 className="font-display text-sm font-black text-cream-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-cream-foreground/55">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#menu"
              className="inline-flex h-13 items-center justify-center rounded-xl bg-brand-red px-7 font-display text-sm font-black text-white shadow-lg shadow-brand-red/20 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-red-deep hover:shadow-xl hover:shadow-brand-red/25"
            >
              Explore Our Menu
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="#delivery"
              className="inline-flex h-13 items-center justify-center rounded-xl border-2 border-brand-red/15 px-7 font-display text-sm font-bold text-brand-red transition-all duration-300 hover:border-brand-red hover:bg-brand-red/5"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>

      {/* Simple reveal animations */}
      <style>{`
        .about-image-hidden {
          opacity: 0;
          transform: translateX(-35px);
        }

        .about-image-visible {
          opacity: 1;
          transform: translateX(0);
          transition:
            opacity 800ms ease,
            transform 800ms ease;
        }

        .about-content-hidden {
          opacity: 0;
          transform: translateX(35px);
        }

        .about-content-visible {
          opacity: 1;
          transform: translateX(0);
          transition:
            opacity 800ms ease 150ms,
            transform 800ms ease 150ms;
        }

        @media (prefers-reduced-motion: reduce) {
          .about-image-hidden,
          .about-image-visible,
          .about-content-hidden,
          .about-content-visible {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
