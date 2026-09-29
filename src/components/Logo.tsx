import arabianLogo from "@/assets/Arabian.jpeg";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-3">
      <img
        src={arabianLogo}
        alt="Arabian Chick, N logo"
        className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-[0_4px_16px_-4px_var(--brand-red)] ring-1 ring-brand-gold/60"
      />
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate font-display text-lg font-bold leading-tight text-foreground">
            Arabian Chick, N
          </span>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Fast Food &amp; Pizza
          </span>
        </span>
      )}
    </a>
  );
}