import { FOOD_IMAGES } from "@/data/images";
import { formatRs, CONTACT } from "@/data/menu";
import { useCart } from "./cart";

const SHOWCASE = [
  { name: "Baked Wings", image: "wings", priceLabel: "5 Pc Rs.350 / 10 Pc Rs.650", option: "5 Piece", price: 350 },
  { name: "Buffalo Wings", image: "wings", priceLabel: "5 Pc Rs.370 / 10 Pc Rs.700", option: "5 Piece", price: 370 },
  { name: "Bar B Q", image: "bbq", priceLabel: "Full Rs.1600 / Half Rs.800", option: "Half Chicken", price: 800 },
];

export function BestOffer() {
  const { addItem } = useCart();

  return (
    <section className="bg-cream py-20 text-cream-foreground sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sheen relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-red-deep via-brand-red to-brand-gold-deep p-8 shadow-2xl sm:p-12">
          <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-charcoal-deep/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            🔥 Best Offer — New Arrival
          </span>
          <h2 className="relative z-10 mt-4 font-display text-3xl font-black text-primary-foreground text-balance sm:text-4xl">
            Fresh From The Oven — Our New Wings &amp; BBQ Line-Up
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE.map((item) => (
            <article
              key={item.name}
              className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={FOOD_IMAGES[item.image]}
                  alt={item.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-black text-accent-foreground shadow">
                  NEW
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold">{item.name}</h3>
                <p className="mt-2 text-sm font-semibold text-brand-red">{item.priceLabel}</p>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({ key: `${item.name}-${item.option}`, name: item.name, option: item.option, price: item.price })
                    }
                    className="flex h-11 flex-1 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground transition-colors hover:bg-brand-red-deep"
                  >
                    Add to Order
                  </button>
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 border-accent font-bold text-accent-foreground transition-colors hover:bg-accent"
                    aria-label={`Order ${item.name} on WhatsApp`}
                    title="Order on WhatsApp"
                  >
                    🛒
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm font-semibold text-cream-foreground/60">
          Prices in Pakistani Rupees · {formatRs(350)} onwards
        </p>
      </div>
    </section>
  );
}
