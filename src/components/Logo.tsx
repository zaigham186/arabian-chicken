import arabianLogo from "@/assets/Arabian.jpeg";

export function Logo({ compact = false }: { compact?: boolean }) {
  const logoSrc =
    typeof arabianLogo === "object" && arabianLogo && "src" in arabianLogo
      ? (arabianLogo as any).src
      : String(arabianLogo);
  return (
    <a href="#home" className="flex items-center gap-3">
      <img
        src={logoSrc}
        alt="Arabian Chick, N logo"
        className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-[0_4px_16px_-4px_var(--brand-red)] ring-1 ring-brand-gold/60 sm:h-15 sm:w-15"
      />
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate font-display text-xl font-bold leading-tight text-foreground sm:text-2xl">
            Arabian Chick, N
          </span>
          <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Fast Food &amp; Pizza
          </span>
        </span>
      )}
    </a>
  );
}