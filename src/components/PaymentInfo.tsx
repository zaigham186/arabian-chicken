import { useState } from "react";
import { CONTACT, PAYMENT } from "@/data/menu";

export function PaymentInfo({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(number);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`rounded-xl border border-accent/40 bg-accent/10 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="text-xs font-black uppercase tracking-[0.12em] text-accent">
          💳 Online Payment (Easypaisa / JazzCash)
        </span>
        <span className="text-xs text-foreground/70">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-accent/30 px-3 pb-3 pt-2">
          <div className="space-y-1.5">
            {PAYMENT.accounts.map((acc) => (
              <div
                key={acc.number}
                className="flex items-center justify-between gap-2 rounded-lg bg-charcoal-deep px-3 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold uppercase tracking-wide text-accent">
                    {acc.name}
                  </p>
                  <p className="font-display text-base font-black tracking-wide text-foreground">
                    {acc.number}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(acc.number)}
                  className="shrink-0 rounded-lg bg-accent px-3 py-1 text-xs font-black text-accent-foreground hover:bg-foreground"
                >
                  {copied === acc.number ? "Copied ✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-foreground/75">
            Please check the account name before paying. Afterwards, send the screenshot on{" "}
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-accent underline"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
