import { CONTACT, DEALS, formatRs } from "@/data/menu";
import { useCart } from "./cart";

export function Deals() {
  const { addItem } = useCart();

  return (
    <section id="deals" className="bg-cream py-20 text-cream-foreground sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-red">Deals</span>
          <h2 className="heading-underline mx-auto mt-2 font-display text-4xl font-black text-balance sm:text-5xl">
            🎓 Student Deals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-cream-foreground/70">
            Big portions, small budgets. Show your student card in-store or
            order these combos for delivery.
          </p>
        </div>

        <div className="no-scrollbar mt-12 flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-5">
          {DEALS.map((deal) => (
            <article
              key={deal.id}
              className="group relative flex min-w-[250px] flex-1 flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-brand-red to-brand-red-deep p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:min-w-0"
            >
              <span className="absolute -right-4 -top-4 grid h-16 w-16 rotate-12 place-items-center rounded-full bg-accent font-display text-lg font-black text-accent-foreground shadow-md">
                {deal.id}
              </span>
              <h3 className="mt-3 font-display text-lg font-black text-primary-foreground">
                {deal.title}
              </h3>
              <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-primary-foreground/85">
                {deal.contents}
              </p>
              <span className="mt-4 w-fit rounded-lg bg-charcoal-deep px-3 py-1.5 font-display text-base font-black text-accent">
                {formatRs(deal.price)}
              </span>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      key: `deal-${deal.id}`,
                      name: `Deal ${deal.id}: ${deal.title}`,
                      option: deal.contents,
                      price: deal.price,
                    })
                  }
                  className="flex h-10 flex-1 items-center justify-center rounded-lg bg-accent text-sm font-black text-accent-foreground transition-colors hover:bg-foreground"
                >
                  Add to Order
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-sm font-semibold text-cream-foreground/60">
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
