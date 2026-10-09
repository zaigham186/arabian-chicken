import { CONTACT } from "@/data/menu";

const ORDER_PHONE = CONTACT.phones[1] ?? CONTACT.phones[0] ?? "";

export function DeliveryBanner() {
  return (
    <section
      id="delivery"
      className="relative isolate overflow-hidden bg-charcoal-deep py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-30%] h-125 w-125 rounded-full bg-brand-red/20 blur-3xl" />
        <div className="absolute bottom-[-35%] right-[-10%] h-125 w-125 rounded-full bg-brand-gold/15 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 px-6 py-12 shadow-2xl backdrop-blur-sm sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          {/* Decorative glow */}
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            {/* Content */}
            <div className="text-center lg:text-left">
              {/* Label */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2">
                <span className="text-lg">🛵</span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                  Home Delivery
                </span>
              </div>

              <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-primary-foreground text-balance sm:text-5xl lg:text-6xl">
                Your Favorite Food,
                <span className="block text-brand-gold">Delivered Fresh.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg lg:mx-0">
                Craving something delicious? Place your order and enjoy your favorite meals, hot and
                fresh, right at your doorstep.
              </p>

              {/* Feature points */}
              <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white/80 lg:justify-start">
                <span className="inline-flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  Freshly Prepared
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  Fast Delivery
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  Hot &amp; Fresh
                </span>
              </div>
            </div>

            {/* Order Card */}
            <div className="w-full lg:w-90">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-xl backdrop-blur-md sm:p-6">
                <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                  Order Now
                </p>

                {/* Phone numbers */}
                <div className="mt-4 space-y-2">
                  {CONTACT.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/-/g, "")}`}
                      className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-display text-lg font-bold text-white transition-all duration-300 hover:border-brand-gold/40 hover:bg-brand-gold/10 hover:text-brand-gold"
                    >
                      <span className="text-base">📞</span>
                      {phone}
                    </a>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-5 grid gap-3">
                  <a
                    href={`tel:${ORDER_PHONE.replace(/-/g, "")}`}
                    className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-brand-gold px-6 font-display text-base font-black text-charcoal-deep shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-gold/30"
                  >
                    <span className="text-lg transition-transform duration-300 group-hover:rotate-12">
                      📞
                    </span>
                    Call to Order
                  </a>

                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 font-display text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white hover:text-charcoal-deep"
                  >
                    <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                      💬
                    </span>
                    Order on WhatsApp
                  </a>
                </div>

                <p className="mt-4 text-center text-xs text-white/40">
                  Tap a number to call directly
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust text */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center text-xs font-medium uppercase tracking-wider text-white/35">
          <span>Freshly Prepared</span>
          <span className="hidden sm:inline">•</span>
          <span>Quality Ingredients</span>
          <span className="hidden sm:inline">•</span>
          <span>Made With Care</span>
        </div>
      </div>
    </section>
  );
}
