import { useEffect, useMemo, useRef, useState } from "react";
import { FOOD_IMAGES } from "@/data/images";
import { formatRs } from "@/data/menu";
import { useMenuData } from "@/data/useMenuData";

// Card tak scroll karta hai aur thori der highlight karta hai
function goTo(targetId: string) {
  // Menu ki koi tab filter ho to "All" par le aao, taake card maujood ho
  window.dispatchEvent(new Event("show-all-menu"));
  setTimeout(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.transition = "box-shadow 0.3s";
    el.style.boxShadow = "0 0 0 4px var(--brand-gold)";
    setTimeout(() => (el.style.boxShadow = ""), 2200);
  }, 200);
}

export function SearchBox({ className = "", onDone }: { className?: string; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { items, deals } = useMenuData();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocus(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return { items: [], deals: [] };

    // 0 = naam shuru hi isse hota hai, 1 = naam mein hai, 2 = description/category mein hai
    const rank = (name: string, rest: string) => {
      const n = name.toLowerCase();
      if (n.startsWith(term)) return 0;
      if (n.includes(term)) return 1;
      if (rest.toLowerCase().includes(term)) return 2;
      return 3;
    };

    return {
      items: items
        .map((i) => ({ i, r: rank(i.name, `${i.description ?? ""} ${i.category}`) }))
        .filter((x) => x.r < 3)
        .sort((a, b) => a.r - b.r)
        .slice(0, 8)
        .map((x) => x.i),
      deals: deals
        .map((d) => ({ d, r: rank(d.title, `${d.contents} ${d.badge ?? ""}`) }))
        .filter((x) => x.r < 3)
        .sort((a, b) => a.r - b.r)
        .slice(0, 4)
        .map((x) => x.d),
    };
  }, [term, items, deals]);

  const empty = term && results.items.length === 0 && results.deals.length === 0;

  const pick = (targetId: string) => {
    setFocus(false);
    setQ("");
    onDone?.();
    goTo(targetId);
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-charcoal-card/80 px-4 transition-colors focus-within:border-accent">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-foreground/60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onKeyDown={(e) => e.key === "Escape" && setFocus(false)}
          placeholder="Search items or deals..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="cursor-pointer text-foreground/60 hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {focus && term && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-[min(92vw,24rem)] overflow-y-auto rounded-2xl border border-border bg-charcoal-deep p-2 shadow-2xl">
          {empty && (
            <p className="px-3 py-4 text-sm text-muted-foreground">Nothing found for “{q}”.</p>
          )}

          {results.items.map((item) => {
            const src = item.imageUrl || FOOD_IMAGES[item.id] || FOOD_IMAGES[item.image];
            const min = Math.min(...item.prices.map((p) => p.value));
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => pick(`item-${item.id}`)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-charcoal-card"
              >
                {src ? (
                  <img src={src} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-charcoal-card">
                    🍽️
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {item.name}
                  </span>
                  <span className="text-xs font-semibold text-accent">
                    {item.prices.length > 1 ? "From " : ""}
                    {formatRs(min)}
                  </span>
                </span>
              </button>
            );
          })}

          {results.deals.map((d) => (
            <button
              key={String(d.id)}
              type="button"
              onClick={() => pick(`deal-${d.id}`)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-charcoal-card"
            >
              {d.imageUrl ? (
                <img
                  src={d.imageUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-charcoal-card">
                  🎁
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-foreground">
                  <span className="mr-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-black uppercase text-accent-foreground">
                    Deal
                  </span>
                  {d.title}
                </span>
                <span className="text-xs font-semibold text-accent">{formatRs(d.price)}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
