import { useEffect, useState } from "react";
import { FOOD_IMAGES } from "@/data/images";
import {
  CATEGORIES,
  EXTRA_TOPPING,
  TOPPING_OPTIONS,
  toppingPriceFor,
  formatRs,
  type Deal,
  type MenuCategory,
  type MenuItem,
} from "@/data/menu";
import { useMenuData } from "@/data/useMenuData";
import { useCart } from "./cart";
import { SmartImage } from "./SmartImage";

type Tab = MenuCategory | "all";

const PIZZA_GROUPS: { id: NonNullable<MenuItem["group"]>; title: string; note?: string }[] = [
  { id: "hot", title: "Hot Pizza", note: EXTRA_TOPPING },
  { id: "crust", title: "Special Crust Pizza" },
  { id: "extras", title: "Extras & Rolls" },
];

function MenuItemCard({ item }: { item: MenuItem }) {
  const [selected, setSelected] = useState(0);
  const [toppings, setToppings] = useState<string[]>([]);
  const [showToppings, setShowToppings] = useState(false);
  const { addItem } = useCart();
  const price = item.prices[selected] ?? item.prices[0]!;
  const src = item.imageUrl || FOOD_IMAGES[item.id] || FOOD_IMAGES[item.image];

  const isPizza = item.category === "pizza" && (item.group === "hot" || item.group === "crust");
  const perTopping = isPizza ? toppingPriceFor(price.label) : null;
  const canTopping = perTopping !== null;
  const activeToppings = canTopping ? toppings : [];
  const toppingTotal = activeToppings.length * (perTopping ?? 0);
  const finalPrice = price.value + toppingTotal;

  const toggleTopping = (t: string) =>
    setToppings((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <article
      id={`item-${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-charcoal-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)]"
    >
      <div className="relative">
        {src ? (
          <SmartImage src={src} alt={item.name} className="h-48" />
        ) : (
          <div className="grid h-48 w-full place-items-center bg-charcoal-deep text-5xl">🍽️</div>
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

        {item.prices.length > 1 && (
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
        )}

        {isPizza && (
          <div className="mt-3 rounded-lg border border-border bg-charcoal-deep">
            <button
              type="button"
              onClick={() => setShowToppings((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-left"
            >
              <span className="text-[11px] font-black uppercase tracking-wide text-accent">
                Extra Toppings
                {canTopping && (
                  <span className="ml-1 normal-case text-foreground/70">
                    ({formatRs(perTopping!)} each)
                  </span>
                )}
                {activeToppings.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                    {activeToppings.length}
                  </span>
                )}
              </span>
              <span className="text-xs text-foreground/70">{showToppings ? "▲" : "▼"}</span>
            </button>

            {showToppings && (
              <div className="border-t border-border px-3 pb-3 pt-2">
                {canTopping ? (
                  <div className="max-h-28 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {TOPPING_OPTIONS.map((t) => {
                        const on = toppings.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleTopping(t)}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                              on
                                ? "bg-primary text-primary-foreground"
                                : "border border-border text-foreground/75 hover:border-accent/60"
                            }`}
                          >
                            {on ? "✓ " : "+ "}
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Extra topping is not available for this size.
                  </p>
                )}
                {activeToppings.length > 0 && (
                  <p className="mt-2 text-xs font-bold text-foreground">
                    {activeToppings.length} topping = +{formatRs(toppingTotal)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mb-3 mt-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Total
          </span>
          <span className="font-display text-xl font-black text-accent">
            {formatRs(finalPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            addItem({
              key: `${item.id}-${price.label}-${[...activeToppings].sort().join("|")}`,
              name: item.name,
              option:
                activeToppings.length > 0
                  ? `${price.label} + ${activeToppings.join(", ")}`
                  : price.label,
              price: finalPrice,
            });
            setToppings([]);
          }}
          className="mt-auto flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground transition-colors hover:bg-brand-red-deep"
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
      id={`deal-${deal.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-brand-red to-brand-red-deep p-6 shadow-lg ring-1 ring-brand-gold/40 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] ${
        compact ? "" : "min-w-67.5"
      }`}
    >
      {src && (
        <div className="-mx-6 -mt-6 mb-5">
          <SmartImage src={src} alt={deal.title} className="h-48" />
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
          className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-black text-accent-foreground transition-colors hover:bg-foreground"
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

  // Search se click par "All" tab khul jaye taake card maujood ho
  useEffect(() => {
    const h = () => setActive("all");
    window.addEventListener("show-all-menu", h);
    return () => window.removeEventListener("show-all-menu", h);
  }, []);

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

        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
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
        {error && <p className="mt-10 text-accent">Failed to load the menu. Please try again.</p>}

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
