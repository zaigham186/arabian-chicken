import { useState } from "react";
import { FOOD_IMAGES } from "@/data/images";
import { CONTACT, formatRs } from "@/data/menu";
import { useCart } from "./cart";

type FamilyDeal = { id: string; title: string; contents: string; price: number };
type SizedItem = { id: string; title: string; prices: { label: string; value: number }[] };

/* ---------- Family Combos (flyer ke mutabiq) ---------- */
const FAMILY_DEALS: FamilyDeal[] = [
  { id: "family-combo-1", title: "Family Combo 1", contents: "8 Chicken Pieces, 1 Liter Drink", price: 1650 },
  { id: "family-combo-2", title: "Family Combo 2", contents: "6 Zinger Burger, 1 Family Fries, 1.5 Liter Drink", price: 2950 },
  { id: "family-combo-3", title: "Family Combo 3", contents: "4 Zinger Burger, 1 Liter Drink", price: 1750 },
  { id: "family-combo-4", title: "Family Combo 4", contents: "4 Zinger, 4 Pcs Chicken, 1 Family Fries, 1.5 Liter Drink", price: 2850 },
  { id: "family-combo-5", title: "Family Combo 5", contents: "5 Zinger Burger, 1.5 Liter Drink", price: 2150 },
  { id: "family-combo-6", title: "Family Combo 6", contents: "5 Zinger Burger, 5 Pcs Chicken, 1.5 Liter Drink", price: 3100 },
];

/* ---------- Small / Large items ---------- */
const SIZE = [
  { label: "Small", value: 500 },
  { label: "Large", value: 950 },
];

const SIZED_ITEMS: SizedItem[] = [
  { id: "chicken-lasagne", title: "Chicken Lasagne", prices: SIZE },
  { id: "chicken-pasta", title: "Chicken Pasta", prices: SIZE },
  { id: "pizza-fries", title: "Pizza Fries", prices: SIZE },
  { id: "nachos", title: "Nachos", prices: SIZE },
  { id: "zinger-paratha-roll", title: "2 Zinger Paratha Roll", prices: [{ label: "2 Rolls", value: 600 }] },
];

/* Image poori dikhane wala box (peeche halka blur) */
/* Image poore box ko bhar de (koi patti nahi) */
function FullImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-56 overflow-hidden bg-charcoal-deep">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

function FamilyCard({ deal }: { deal: FamilyDeal }) {
  const { addItem } = useCart();
  const src = FOOD_IMAGES[deal.id];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-linear-to-b from-brand-red to-brand-red-deep shadow-lg ring-1 ring-brand-gold/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      {src ? (
        <FullImage src={src} alt={deal.title} />
      ) : (
        <div className="grid h-48 place-items-center bg-charcoal-deep text-5xl">🍔</div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-black text-primary-foreground">{deal.title}</h3>
        <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-primary-foreground/85">
          {deal.contents}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="rounded-lg bg-charcoal-deep px-3 py-1.5 font-display text-base font-black text-accent">
            {formatRs(deal.price)}
          </span>
          <button
            type="button"
            onClick={() =>
              addItem({
                key: deal.id,
                name: deal.title,
                option: deal.contents,
                price: deal.price,
              })
            }
            className="rounded-lg bg-accent px-4 py-2 text-sm font-black text-accent-foreground transition-colors hover:bg-foreground"
          >
            Add to Order
          </button>
        </div>
      </div>
    </article>
  );
}

function SizedCard({ item }: { item: SizedItem }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState(0);
  const current = item.prices[selected] ?? item.prices[0]!;
  const src = FOOD_IMAGES[item.id];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      {src ? (
        <FullImage src={src} alt={item.title} />
      ) : (
        <div className="grid h-48 place-items-center bg-charcoal-deep text-5xl">🍽️</div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{item.title}</h3>

        {item.prices.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.prices.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setSelected(i)}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
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

        <p className="mb-4 mt-3 font-display text-2xl font-black text-brand-red">
          {formatRs(current.value)}
        </p>

        <button
          type="button"
          onClick={() =>
            addItem({
              key: `${item.id}-${current.label}`,
              name: item.title,
              option: current.label,
              price: current.value,
            })
          }
          className="mt-auto flex h-11 w-full items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground transition-colors hover:bg-brand-red-deep"
        >
          Add to Order
        </button>
      </div>
    </article>
  );
}

export function Deals() {
  return (
    <section id="deals" className="bg-cream py-20 text-cream-foreground sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-red">Deals</span>
          <h2 className="heading-underline mx-auto mt-2 font-display text-4xl font-black text-balance sm:text-5xl">
            👨‍👩‍👧‍👦 Family Deals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-cream-foreground/70">
            Big portions for the whole family. Pick a combo, add it to your order
            and send it to us on WhatsApp.
          </p>
        </div>

        {/* Family Combos */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FAMILY_DEALS.map((deal) => (
            <FamilyCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* Pasta, Nachos & more */}
        <h3 className="mt-16 text-center font-display text-2xl font-black">Pasta, Nachos &amp; More</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SIZED_ITEMS.map((item) => (
            <SizedCard key={item.id} item={item} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm font-semibold text-cream-foreground/60">
          Prefer to order directly?{" "}
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="text-brand-red underline decoration-brand-gold decoration-2 underline-offset-2"
          >
            Message us on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}