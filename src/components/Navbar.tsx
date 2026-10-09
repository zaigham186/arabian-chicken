import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { CONTACT } from "@/data/menu";
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
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let currentSection = "home";
      NAV_LINKS.forEach((link) => {
        const section = document.querySelector(link.href);
        if (section) {
          const sectionTop = (section as HTMLElement).offsetTop;
          if (scrollPosition >= sectionTop) currentSection = link.href.slice(1);
        }
      });
      setActiveSection(currentSection);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
        <nav className="hidden items-center gap-3 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-1 text-sm font-semibold transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-foreground/85 hover:text-accent"
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

          {/* Order Now */}
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_6px_20px_-6px_var(--brand-red)] transition-transform hover:scale-105"
          >
            Order Now
          </a>

          {/* Search */}
          <SearchBox className="w-36 xl:w-44" />

          {/* Add to Cart */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Add to Cart, ${count} items`}
            className="relative inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-accent/60 px-4 text-sm font-bold text-accent transition-all hover:scale-105 hover:bg-accent hover:text-accent-foreground"
          >
            <CartIcon />
            <span>Add to Cart</span>
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-black text-primary-foreground">
                {count}
              </span>
            )}
          </button>

          {/* Admin: sabse end mein, hamesha dikhta hai */}
          <Link
            href="/admin"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-sm border border-accent/50 px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LockIcon />
            Admin
          </Link>
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
            <span
              className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-foreground transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
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
                  className={`block border-b border-border/50 py-3.5 font-semibold transition-colors ${
                    isActive ? "text-accent" : "text-foreground/90 hover:text-accent"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex h-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
          >
            Order Now
          </a>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setCartOpen(true);
            }}
            className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-accent/60 font-bold text-accent"
          >
            <CartIcon />
            Add to Cart {count > 0 && `(${count})`}
          </button>

          <Link
            href="/admin"
            className="mt-3 flex h-10 items-center justify-center gap-2 rounded-sm border border-accent/50 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
          >
            <LockIcon />
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
