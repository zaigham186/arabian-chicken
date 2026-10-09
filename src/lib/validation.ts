import mongoose from "mongoose";

export const str = (v: unknown, max = 300): string | undefined =>
  typeof v === "string" ? v.trim().slice(0, max) : undefined;

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const isValidObjectId = (id: string): boolean => mongoose.isValidObjectId(id);

export function cleanItem(b: any): { data?: any; error?: string } {
  const prices = Array.isArray(b?.prices)
    ? b.prices
        .map((p: any) => ({ label: str(p?.label, 40), value: Number(p?.value) }))
        .filter((p: any) => p.label && Number.isFinite(p.value) && p.value >= 0)
    : [];
  const name = str(b?.name, 120);
  if (!name) return { error: "Name is required" };
  if (!str(b?.category, 40)) return { error: "Category is required" };
  if (prices.length === 0) return { error: "At least one valid price is required" };

  return {
    data: {
      name,
      category: str(b?.category, 40),
      group: str(b?.group, 20),
      description: str(b?.description, 500),
      tag: str(b?.tag, 40),
      imageUrl: str(b?.imageUrl, 500),
      prices,
      available: b?.available !== false,
      ...(Number.isFinite(Number(b?.order)) && b?.order !== "" ? { order: Number(b.order) } : {}),
    },
  };
}

export function cleanDeal(b: any): { data?: any; error?: string } {
  const title = str(b?.title, 120);
  const price = Number(b?.price);
  if (!title) return { error: "Title is required" };
  if (!Number.isFinite(price) || price < 0) return { error: "Valid price is required" };

  return {
    data: {
      title,
      badge: str(b?.badge, 60),
      contents: str(b?.contents, 400) ?? "",
      price,
      group: ["deal", "double", "family"].includes(b?.group) ? b.group : "deal",
      imageUrl: str(b?.imageUrl, 500),
      available: b?.available !== false,
      ...(Number.isFinite(Number(b?.order)) && b?.order !== "" ? { order: Number(b.order) } : {}),
    },
  };
}
