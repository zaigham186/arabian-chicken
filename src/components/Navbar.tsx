import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CONTACT } from "@/data/menu";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Deals", href: "#deals" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Navbar background when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      let currentSection = "home";

      NAV_LINKS.forEach((link) => {
        const section = document.querySelector(link.href);

        if (section) {
          const sectionTop = (section as HTMLElement).offsetTop;

          if (scrollPosition >= sectionTop) {
            currentSection = link.href.slice(1);
          }
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-charcoal-deep/95 shadow-lg backdrop-blur-md"
          : "bg-linear-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto grid h-18 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex min-w-0 items-center gap-3">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.slice(1);
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-accent"
                    : "text-foreground/85 hover:text-accent"
                }`}
              >
                {link.label}

                {/* Active underline */}
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
            className="inline-flex h-11 shrink-0 items-center rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_6px_20px_-6px_var(--brand-red)] transition-transform hover:scale-105"
          >
            Order Now
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
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

      {/* Mobile Menu */}
      {open && (
        <nav className="border-t border-border bg-charcoal-deep/95 px-4 pb-6 pt-2 backdrop-blur-md lg:hidden">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.slice(1);
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block border-b border-border/50 py-3.5 font-semibold transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-foreground/90 hover:text-accent"
                }`}
              >
                {link.label}
              </a>
            );
          })}

          {/* Mobile Order Now */}
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex h-12 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground"
          >
            Order Now
          </a>
        </nav>
      )}
    </header>
  );
}