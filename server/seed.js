import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { MENU_ITEMS, DEALS } from "../src/data/menu.ts";
import { Item, Deal } from "./models.js";
if (process.env.ALLOW_SEED !== "true") {
  console.error("Seed blocked. Run with ALLOW_SEED=true only if you really want to RESET the database.");
  process.exit(1);
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMG = /\.(jpe?g|png|webp|avif)$/i;
const dirs = ["../src/assets", "../src/assets/menu"];
const urlByName = {}; // "burger-zinger" -> cloudinary url

for (const dir of dirs) {
  for (const file of fs.readdirSync(dir)) {
    if (!IMG.test(file)) continue;
    const name = file.replace(/\.[^.]+$/, "");
    if (urlByName[name]) continue;
    const res = await cloudinary.uploader.upload(path.join(dir, file), {
      folder: "arabian-chick",
      public_id: name,
      overwrite: true,
    });
    urlByName[name] = res.secure_url;
    console.log("uploaded", name);
  }
}

await mongoose.connect(process.env.MONGODB_URI);
await Item.deleteMany({});
await Deal.deleteMany({});

await Item.insertMany(
  MENU_ITEMS.map((i, idx) => ({
    slug: i.id,
    name: i.name,
    category: i.category,
    group: i.group,
    description: i.description,
    tag: i.tag,
    prices: i.prices,
    imageUrl: urlByName[i.id] ?? urlByName[i.image],
    order: idx,
  })),
);

await Deal.insertMany(
  DEALS.map((d, idx) => ({
    slug: `deal-${d.id}`,
    badge: d.badge,
    title: d.title,
    contents: d.contents,
    price: d.price,
    group: d.group,
    imageUrl: urlByName[`deal-${d.id}`],
    order: idx,
  })),
);

console.log("Done:", MENU_ITEMS.length, "items,", DEALS.length, "deals");
process.exit(0);