import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./cart";
import { SearchBox } from "./SearchBox";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Deals", href: "#deals" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + 150;
      let current = "home";
      NAV_LINKS.forEach((link) => {
        const el = document.querySelector(link.href) as HTMLElement | null;
        if (el && pos >= el.offsetTop) current = link.href.slice(1);
      });
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-charcoal-deep/95 shadow-lg backdrop-blur-md"
          : "bg-linear-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto grid h-18 w-full max-w-screen-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Logo />
        </div>

        {/* Desktop */}
        <nav className="hidden items-center gap-7 lg:flex">
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative text-[13px] font-medium tracking-wide transition-colors ${
                    isActive ? "text-accent" : "text-foreground/80 hover:text-accent"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <SearchBox className="w-36 xl:w-48" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Add to Cart, ${count} items`}
              className="relative inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-accent/50 px-4 text-[13px] font-semibold text-accent transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <CartIcon />
              <span>Add to Cart</span>
              {count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-black text-primary-foreground">
                  {count}
                </span>
              )}
            </button>

            <a
              href="/admin"
              aria-label="Admin"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-[13px] font-semibold text-foreground/80 transition-colors hover:border-accent hover:text-accent"
            >
              <LockIcon />
              <span>Admin</span>
            </a>
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-charcoal-card/80 lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-border bg-charcoal-deep/95 px-4 pb-6 pt-3 backdrop-blur-md lg:hidden">
          <SearchBox onDone={() => setOpen(false)} />

          <div className="mt-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-border/50 py-3.5 font-medium ${
                    isActive ? "text-accent" : "text-foreground/90 hover:text-accent"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setCartOpen(true);
            }}
            className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground"
          >
            <CartIcon />
            Add to Cart {count > 0 && `(${count})`}
          </button>

          <a
            href="/admin"
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-full border border-border text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70"
          >
            <LockIcon />
            Admin
          </a>
        </nav>
      )}
    </header>
  );
}