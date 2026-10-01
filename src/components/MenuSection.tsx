import { useState } from "react";
import { FOOD_IMAGES } from "@/data/images";
import {
  CATEGORIES,
  EXTRA_TOPPING,
  formatRs,
  type Deal,
  type MenuCategory,
  type MenuItem,
} from "@/data/menu";
import { useMenuData } from "@/data/useMenuData";
import { useCart } from "./cart";

type Tab = MenuCategory | "all";

const PIZZA_GROUPS: { id: NonNullable<MenuItem["group"]>; title: string; note?: string }[] = [
  { id: "hot", title: "Hot Pizza", note: EXTRA_TOPPING },
  { id: "crust", title: "Special Crust Pizza" },
  { id: "extras", title: "Extras & Rolls" },
];

/* Image poore box ko bhar de */
function FullImage({
  src,
  alt,
  className = "h-44",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-charcoal-deep ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const [selected, setSelected] = useState(0);
  const { addItem } = useCart();
  const price = item.prices[selected] ?? item.prices[0]!;
  const src = item.imageUrl || FOOD_IMAGES[item.id] || FOOD_IMAGES[item.image];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-charcoal-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)]">
      <div className="relative">
        {src ? (
          <FullImage src={src} alt={item.name} />
        ) : (
          <div className="grid h-44 w-full place-items-center bg-charcoal-deep text-5xl">🍽️</div>
        )}
        {item.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-wide text-accent-foreground">
            {item.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-foreground">{item.name}</h3>
        {item.description && (
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="mb-5 mt-3 flex flex-wrap gap-2">
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
            addItem({
              key: `${item.id}-${price.label}`,
              name: item.name,
              option: price.label,
              price: price.value,
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

function DealCard({ deal, compact = false }: { deal: Deal; compact?: boolean }) {
  const { addItem } = useCart();
  const badge = deal.badge ?? `Deal ${deal.id}`;
  const src = deal.imageUrl || FOOD_IMAGES[String(deal.id)];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-brand-red to-brand-red-deep p-6 shadow-lg ring-1 ring-brand-gold/40 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] ${
        compact ? "" : "min-w-67.5"
      }`}
    >
      {src && (
        <div className="-mx-6 -mt-6 mb-5">
          <FullImage src={src} alt={deal.title} />
        </div>
      )}
      <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-wide text-accent-foreground">
        🎓 {badge}
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
            addItem({
              key: `deal-${deal.id}`,
              name: `${badge}: ${deal.title}`,
              option: deal.contents,
              price: deal.price,
            })
          }
          className="rounded-lg bg-accent px-4 py-2 text-sm font-black text-accent-foreground transition-colors hover:bg-foreground"
        >
          Add to Order
        </button>
      </div>
    </article>
  );
}

function Block({
  title,
  note,
  children,
}: {
  title: string;
  note?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-12 first:mt-8">
      <h3 className="font-display text-2xl font-black text-foreground">{title}</h3>
      {note && <p className="mt-1 text-xs font-bold uppercase tracking-wide text-accent">{note}</p>}
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

export function MenuSection() {
  const [active, setActive] = useState<Tab>("all");
  const { items: allItems, deals, loading, error } = useMenuData();
  const show = (c: MenuCategory) => active === "all" || active === c;

  const byCategory = (c: MenuCategory) => allItems.filter((i) => i.category === c);

  const otherTabs = CATEGORIES.filter(
    (c): c is { id: MenuCategory; label: string } => c.id !== "all" && c.id !== "pizza",
  );

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
            Pick a size, add it to your order, and send the whole order to us on WhatsApp — no
            account needed.
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

        {loading && <p className="mt-10 text-muted-foreground">Loading menu...</p>}
        {error && <p className="mt-10 text-accent">Menu load nahi hua. Dobara try karein.</p>}

        {/* PIZZA */}
        {show("pizza") && (
          <>
            {PIZZA_GROUPS.map((g) => (
              <Block key={g.id} title={g.title} note={g.note}>
                {allItems
                  .filter((i) => i.category === "pizza" && i.group === g.id)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </Block>
            ))}
            <Block title="Double Deals">
              {deals
                .filter((d) => d.group === "double")
                .map((d) => (
                  <DealCard key={String(d.id)} deal={d} compact />
                ))}
            </Block>
            <Block title="Pizza Deals">
              {deals
                .filter((d) => d.group === "deal")
                .map((d) => (
                  <DealCard key={String(d.id)} deal={d} compact />
                ))}
            </Block>
          </>
        )}

        {/* MEALS, CHINA, BURGERS, ... */}
        {otherTabs.map(
          (c) =>
            show(c.id) && (
              <Block key={c.id} title={c.label}>
                {byCategory(c.id).map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </Block>
            ),
        )}
      </div>
    </section>
  );
}

export { DealCard };