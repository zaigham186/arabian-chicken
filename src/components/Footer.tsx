import { Logo } from "./Logo";
import { CONTACT } from "@/data/menu";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Deals", href: "#deals" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal-deep py-14">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-muted-foreground">
            Crispy wings, sizzling BBQ and handcrafted pizzas — fast, hot &amp;
            fresh across Peshawar.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-semibold text-foreground/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Connect</h3>
          <div className="mt-4 flex gap-3">
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-lg transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              📘
            </a>
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-lg transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              📱
            </a>
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground/80">{CONTACT.whatsapp}</p>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-7xl border-t border-border px-4 pt-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          © 2025 Arabian Chick, N. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
