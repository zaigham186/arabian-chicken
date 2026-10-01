import { useState } from "react";
import { CONTACT, PAYMENT } from "@/data/menu";

export function PaymentInfo({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* copy support na ho to ignore */
    }
  };

  return (
    <div className={`rounded-xl border border-accent/40 bg-accent/10 p-4 ${className}`}>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
        Online Payment
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {PAYMENT.methods.join(" / ")} se payment karein
      </p>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-charcoal-deep px-3 py-2">
        <div>
          <p className="font-display text-lg font-black tracking-wide text-foreground">
            {PAYMENT.number}
          </p>
          {PAYMENT.accountName && (
            <p className="text-xs text-muted-foreground">{PAYMENT.accountName}</p>
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-black text-accent-foreground transition-colors hover:bg-foreground"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <p className="mt-3 text-xs font-medium leading-relaxed text-foreground/75">
        Payment karne ke baad screenshot WhatsApp par bhej dein, hum order confirm kar denge.
      </p>
      <a
        href={CONTACT.whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs font-bold text-accent underline underline-offset-2"
      >
        Screenshot WhatsApp par bhejein
      </a>
    </div>
  );
}