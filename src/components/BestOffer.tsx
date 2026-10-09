import { useState } from "react";
import { FOOD_IMAGES } from "@/data/images";
import { formatRs, type MenuItem } from "@/data/menu";
import { useMenuData } from "@/data/useMenuData";
import { useCart } from "./cart";

const NEW_ARRIVAL_CATEGORIES = ["wings", "chicken", "soup"];

function OfferCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState(0);
  const current = item.prices[selected] ?? item.prices[0]!;
  const src = item.imageUrl || FOOD_IMAGES[item.id] || FOOD_IMAGES[item.image];

  return (
    <article
      id={`item-${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-charcoal-deep">
        {src ? (
          <img
            src={src}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-5xl">🍽️</div>
        )}
        <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-black text-accent-foreground shadow">
          NEW
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold">{item.name}</h3>

        {item.prices.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.prices.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setSelected(i)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                  i === selected
                    ? "border-brand-red bg-brand-red text-primary-foreground"
                    : "border-black/15 text-cream-foreground/80 hover:border-brand-red"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        <p className="mt-3 font-display text-2xl font-black text-brand-red">
          {formatRs(current.value)}
        </p>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() =>
              addItem({
                key: `${item.id}-${current.label}`,
                name: item.name,
                option: current.label,
                price: current.value,
              })
            }
            className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground transition-colors hover:bg-brand-red-deep"
          >
            Add to Order
          </button>
        </div>
      </div>
    </article>
  );
}

export function BestOffer() {
  const { items: all } = useMenuData();
  const items = all.filter((i) => NEW_ARRIVAL_CATEGORIES.includes(i.category));

  return (
    <section className="bg-cream py-20 text-cream-foreground sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sheen relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-red-deep via-brand-red to-brand-gold-deep p-8 shadow-2xl sm:p-12">
          <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-charcoal-deep/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            🔥 Best Offer — New Arrival
          </span>
          <h2 className="relative z-10 mt-4 font-display text-3xl font-black text-primary-foreground text-balance sm:text-4xl">
            Fresh From The Oven — Our New Wings &amp; BBQ Line-Up
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <OfferCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
