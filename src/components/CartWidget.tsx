import { useState } from "react";
import { formatRs } from "@/data/menu";
import { useCart } from "./cart";

export function CartWidget() {
  const [open, setOpen] = useState(false);
  const { items, count, total, increment, decrement, removeItem, clear, whatsappUrl } = useCart();

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open your order — ${count} items`}
        className="fixed bottom-6 right-6 z-50 flex h-16 items-center gap-3 rounded-2xl bg-primary px-5 font-display font-bold text-primary-foreground shadow-[0_12px_32px_-8px_var(--brand-red)] ring-2 ring-brand-gold/60 transition-transform hover:scale-105"
      >
        <span className="text-xl">🛒</span>
        <span className="hidden sm:block text-sm">My Order</span>
        {count > 0 && (
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-accent px-1.5 text-sm font-black text-accent-foreground">
            {count}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close order panel"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-charcoal-deep shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-display text-xl font-black text-foreground">Your Order</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-lg border border-border text-lg text-foreground/80 hover:bg-charcoal-card"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="text-5xl">🍕</span>
                <p className="font-display text-lg font-bold text-foreground">Your order is empty</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Add items from the menu, then send your order on WhatsApp.
                </p>
                <a
                  href="#menu"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground"
                >
                  Browse Menu
                </a>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto p-5">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="rounded-xl border border-border bg-charcoal-card p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm font-bold text-foreground">
                            {item.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                            {item.option}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 text-xs font-bold text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-lg border border-border px-2 py-1">
                          <button
                            type="button"
                            onClick={() => decrement(item.key)}
                            aria-label="Decrease quantity"
                            className="h-7 w-7 text-lg font-black text-foreground/80 hover:text-accent"
                          >
                            −
                          </button>
                          <span className="min-w-5 text-center text-sm font-bold text-foreground">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => increment(item.key)}
                            aria-label="Increase quantity"
                            className="h-7 w-7 text-lg font-black text-foreground/80 hover:text-accent"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-display text-sm font-black text-accent">
                          {formatRs(item.price * item.qty)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      Total
                    </span>
                    <span className="font-display text-2xl font-black text-foreground">
                      {formatRs(total)}
                    </span>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex h-13 items-center justify-center rounded-xl bg-primary py-3.5 font-display font-black text-primary-foreground shadow-[0_10px_26px_-8px_var(--brand-red)] transition-transform hover:scale-[1.02]"
                  >
                    Send Order on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={clear}
                    className="mt-2 w-full rounded-xl py-2.5 text-sm font-bold text-muted-foreground hover:text-destructive"
                  >
                    Clear order
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
