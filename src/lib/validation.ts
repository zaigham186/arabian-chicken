import mongoose from "mongoose";

export const str = (v: unknown, max = 300): string | undefined =>
  typeof v === "string" ? v.trim().slice(0, max) : undefined;

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const isValidObjectId = (id: string): boolean => mongoose.isValidObjectId(id);

/**
 * Validates image magic bytes to ensure file is an authentic image (JPEG, PNG, GIF, WebP, AVIF)
 * and not an executable or script disguised with an image extension/MIME.
 */
export function isValidImageBuffer(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // GIF: GIF87a or GIF89a
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return true;
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  // AVIF: ....ftypavif or ....ftypavis or mif1
  if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    const brand = buffer.subarray(8, 12).toString("ascii");
    if (["avif", "avis", "mif1"].includes(brand)) {
      return true;
    }
  }

  return false;
}

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
