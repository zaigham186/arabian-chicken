import { useEffect, useState } from "react";
import { DEALS, MENU_ITEMS, type Deal, type MenuItem } from "./menu";

const API = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

type Data = { items: MenuItem[]; deals: Deal[] };
let cache: Promise<Data> | null = null;

async function getJson(path: string) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

function load(): Promise<Data> {
  if (!cache) {
    cache = Promise.all([getJson("/api/items"), getJson("/api/deals")])
      .then(([items, deals]) => ({
        items: (items as any[])
          .filter((x) => x.available !== false)
          .map((x) => ({ ...x, id: x.slug, image: "" }) as MenuItem),
        deals: (deals as any[])
          .filter((x) => x.available !== false)
          .map((x) => ({ ...x, id: x.slug }) as Deal),
      }))
      .catch(() => {
        cache = null;
        // Backup: purana local data
        return { items: MENU_ITEMS, deals: DEALS };
      });
  }
  return cache;
}

export function useMenuData() {
  const [data, setData] = useState<Data>({ items: [], deals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading, error: false };
}