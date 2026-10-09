import { useState } from "react";
import { CONTACT, formatRs, type Deal, type MenuItem } from "@/data/menu";
import { useMenuData } from "@/data/useMenuData";
import { useCart } from "./cart";
import { SmartImage } from "./SmartImage";

function CardImage({ src, alt }: { src?: string | undefined; alt: string }) {
  if (!src) return <div className="grid h-56 place-items-center bg-charcoal-deep text-5xl">🍽️</div>;
  return <SmartImage src={src} alt={alt} className="h-56" />;
}

function FamilyCard({ deal }: { deal: Deal }) {
  const { addItem } = useCart();
  return (
    <article
      id={`deal-${deal.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-linear-to-b from-brand-red to-brand-red-deep shadow-lg ring-1 ring-brand-gold/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <CardImage src={deal.imageUrl} alt={deal.title} />
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
                key: String(deal.id),
                name: deal.title,
                option: deal.contents,
                price: deal.price,
              })
            }
            className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-black text-accent-foreground transition-colors hover:bg-foreground"
          >
            Add to Order
          </button>
        </div>
      </div>
    </article>
  );
}

function SizedCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState(0);
  const current = item.prices[selected] ?? item.prices[0]!;

  return (
    <article
      id={`item-${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <CardImage src={item.imageUrl} alt={item.name} />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{item.name}</h3>
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
        <p className="mb-4 mt-3 font-display text-2xl font-black text-brand-red">
          {formatRs(current.value)}
        </p>
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
          className="mt-auto flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground transition-colors hover:bg-brand-red-deep"
        >
          Add to Order
        </button>
      </div>
    </article>
  );
}

export function Deals() {
  const { items, deals, loading } = useMenuData();
  const family = deals.filter((d) => d.group === "family");
  const extras = items.filter((i) => i.category === "family-extras");

  return (
    <section id="deals" className="bg-cream py-20 text-cream-foreground sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-red">
            Deals
          </span>
          <h2 className="heading-underline mx-auto mt-2 font-display text-4xl font-black text-balance sm:text-5xl">
            👨‍👩‍👧‍👦 Family Deals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-cream-foreground/70">
            Big portions for the whole family. Pick a combo, add it to your order and send it to us
            on WhatsApp.
          </p>
        </div>

        {loading && <p className="mt-10 text-center">Loading deals...</p>}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {family.map((deal) => (
            <FamilyCard key={String(deal.id)} deal={deal} />
          ))}
        </div>

        {extras.length > 0 && (
          <>
            <h3 className="mt-16 text-center font-display text-2xl font-black">
              Pasta, Nachos &amp; More
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {extras.map((item) => (
                <SizedCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

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
