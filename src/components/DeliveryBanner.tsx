import { CONTACT } from "@/data/menu";

const ORDER_PHONE = CONTACT.phones[1] ?? CONTACT.phones[0] ?? "";

export function DeliveryBanner() {
  return (
    <section
      id="delivery"
      className="relative overflow-hidden bg-gradient-to-r from-charcoal-deep via-brand-red-deep to-charcoal-deep py-20 sm:py-24"
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--brand-gold) 0, transparent 45%), radial-gradient(circle at 80% 70%, var(--brand-red) 0, transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl font-black text-primary-foreground text-balance sm:text-5xl">
          🛵 We Deliver to Your Door
        </h2>
        <p className="mt-4 text-lg font-semibold text-accent sm:text-xl">
          Fast, Hot &amp; Fresh — Every Time
        </p>
        <p className="mt-6 font-display text-2xl font-bold tracking-wide text-primary-foreground sm:text-3xl">
          {CONTACT.phones.join("  |  ")}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${CONTACT.phones[1].replace(/-/g, "")}`}
            className="inline-flex h-14 items-center rounded-xl bg-accent px-8 font-display text-base font-black text-accent-foreground shadow-[0_10px_30px_-8px_var(--brand-gold)] transition-transform hover:scale-105"
          >
            📞 Call to Order
          </a>
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center rounded-xl border-2 border-primary-foreground/80 px-8 font-display text-base font-bold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-charcoal"
          >
            WhatsApp Order
          </a>
        </div>
      </div>
    </section>
  );
}
