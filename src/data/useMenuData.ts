import { useEffect, useState } from "react";
import type { Deal, MenuItem } from "./menu";

const API = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";

type Data = { items: MenuItem[]; deals: Deal[] };
let cache: Promise<Data> | null = null;

function load(): Promise<Data> {
  if (!cache) {
    cache = Promise.all([
      fetch(`${API}/api/items`).then((r) => r.json()),
      fetch(`${API}/api/deals`).then((r) => r.json()),
    ])
      .then(([items, deals]) => ({
        items: (items as any[])
          .filter((x) => x.available !== false)
          .map((x) => ({ ...x, id: x.slug, image: "" }) as MenuItem),
        deals: (deals as any[])
          .filter((x) => x.available !== false)
          .map((x) => ({ ...x, id: x.slug }) as Deal),
      }))
      .catch((e) => {
        cache = null;
        throw e;
      });
  }
  return cache;
}

export function useMenuData() {
  const [data, setData] = useState<Data>({ items: [], deals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    load()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading, error };
}