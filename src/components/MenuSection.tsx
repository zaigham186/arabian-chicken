import { useState } from "react";
import { FOOD_IMAGES } from "@/data/images";
import {
  CATEGORIES,
  DEALS,
  MENU_ITEMS,
  PIZZA_CRUSTS,
  formatRs,
  type MenuCategory,
  type MenuItem,
} from "@/data/menu";
import { useCart } from "./cart";

type Tab = MenuCategory | "all" | "deals";

function MenuItemCard({ item }: { item: MenuItem }) {
  const [selected, setSelected] = useState(0);
  const { addItem } = useCart();
  const price = item.prices[selected] ?? item.prices[0]!;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-charcoal-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)]">
      <div className="relative h-44 overflow-hidden">
        <img
          src={FOOD_IMAGES[item.image]}
          alt={item.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-wide text-accent-foreground">
            {item.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-foreground">
          {item.name}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.prices.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setSelected(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                i === selected
                  ? "bg-accent text-accent-foreground"
                  : "border border-border bg-transparent text-foreground/75 hover:border-accent/60"
              }`}
            >
              {p.label} · {formatRs(p.value)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            addItem({ key: `${item.id}-${price.label}`, name: item.name, option: price.label, price: price.value })
          }
          className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground transition-colors hover:bg-brand-red-deep"
        >
          Add to Order
        </button>
      </div>
    </article>
  );
}

function DealCard({ deal, compact = false }: { deal: (typeof DEALS)[number]; compact?: boolean }) {
  const { addItem } = useCart();
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-brand-red to-brand-red-deep p-6 shadow-lg ring-1 ring-brand-gold/40 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] ${
        compact ? "" : "min-w-67.5"
      }`}
    >
      <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-wide text-accent-foreground">
        🎓 Deal {deal.id}
      </span>
      <h3 className="mt-4 font-display text-xl font-black text-primary-foreground">{deal.title}</h3>
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
            addItem({ key: `deal-${deal.id}`, name: `Deal ${deal.id}: ${deal.title}`, option: deal.contents, price: deal.price })
          }
          className="rounded-lg bg-accent px-4 py-2 text-sm font-black text-accent-foreground transition-colors hover:bg-foreground"
        >
          Add to Order
        </button>
      </div>
    </article>
  );
}

export function MenuSection() {
  const [active, setActive] = useState<Tab>("all");
  const { addItem } = useCart();

  const items =
    active === "all"
      ? MENU_ITEMS
      : active === "deals"
        ? []
        : MENU_ITEMS.filter((i) => i.category === active);

  return (
    <section id="menu" className="bg-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Menu</span>
            <h2 className="heading-underline mt-2 font-display text-4xl font-black text-foreground sm:text-5xl">
              Our Menu
            </h2>
          </div>
          <p className="max-w-sm text-sm font-medium text-muted-foreground">
            Pick a size, add it to your order, and send the whole order to us
            on WhatsApp — no account needed.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active === c.id
                  ? "bg-primary text-primary-foreground shadow-[0_6px_18px_-6px_var(--brand-red)]"
                  : "border border-border text-foreground/80 hover:border-accent/60 hover:text-accent"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Crust badges */}
        {(active === "pizza" || active === "all") && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              Crusts:
            </span>
            {PIZZA_CRUSTS.map((crust) => (
              <span
                key={crust}
                className="rounded-lg border border-brand-gold/50 bg-accent/10 px-3.5 py-1.5 text-sm font-bold text-accent"
              >
                🧀 {crust}
              </span>
            ))}
          </div>
        )}

        {/* Grid */}
        {active === "deals" ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DEALS.map((d) => (
              <DealCard key={d.id} deal={d} compact />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export { DealCard };
