import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import bakedWingsImg from "@/assets/baked-wings.avif";
import buffaloWingsImg from "@/assets/buffalo-wings.jpeg";
import periPeriWingsImg from "@/assets/peri-peri-wings.jpeg";
import bbqImg from "@/assets/Bbq.avif";
import karaiImg from "@/assets/karai.avif";
import broastImg from "@/assets/broast.avif";
import soupImg from "@/assets/soup.avif";
import fishChipsImg from "@/assets/fish-chips.avif";

// src/assets/menu/ ki saari images khud load hoti hain.
// Key = file ka naam bina extension (jaise "pizza-fajita").
const menuFiles = import.meta.glob("../assets/menu/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const MENU_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(menuFiles).map(([path, url]) => [
    path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    url,
  ]),
);

const toUrl = (img: any): string =>
  typeof img === "object" && img && "src" in img ? (img as { src: string }).src : String(img || "");

export const FOOD_IMAGES: Record<string, string> = {
  hero: toUrl(heroImg),
  about: toUrl(aboutImg),
  bakedWings: toUrl(bakedWingsImg),
  buffaloWings: toUrl(buffaloWingsImg),
  periPeriWings: toUrl(periPeriWingsImg),
  bbq: toUrl(bbqImg),
  karai: toUrl(karaiImg),
  broast: toUrl(broastImg),
  soup: toUrl(soupImg),
  fishChips: toUrl(fishChipsImg),
  ...MENU_IMAGES,
};