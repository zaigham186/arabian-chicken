import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import bakedWingsImg from "@/assets/baked-wings.avif";
import buffaloWingsImg from "@/assets/buffalo-wings.avif";
import periPeriWingsImg from "@/assets/peri-peri-wings.avif";
import bbqImg from "@/assets/bbq.avif";
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

export const FOOD_IMAGES: Record<string, string> = {
  hero: heroImg,
  about: aboutImg,
  bakedWings: bakedWingsImg,
  buffaloWings: buffaloWingsImg,
  periPeriWings: periPeriWingsImg,
  bbq: bbqImg,
  karai: karaiImg,
  broast: broastImg,
  soup: soupImg,
  fishChips: fishChipsImg,
  ...MENU_IMAGES,
};