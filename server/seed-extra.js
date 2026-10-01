import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Item, Deal } from "./models.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dir = "../src/assets/menu";
async function upload(name) {
  const file = fs.readdirSync(dir).find((f) => f.replace(/\.[^.]+$/, "") === name);
  if (!file) return undefined;
  const res = await cloudinary.uploader.upload(path.join(dir, file), {
    folder: "arabian-chick",
    public_id: name,
    overwrite: true,
  });
  return res.secure_url;
}

const FAMILY = [
  ["family-combo-1", "Family Combo 1", "8 Chicken Pieces, 1 Liter Drink", 1650],
  ["family-combo-2", "Family Combo 2", "6 Zinger Burger, 1 Family Fries, 1.5 Liter Drink", 2950],
  ["family-combo-3", "Family Combo 3", "4 Zinger Burger, 1 Liter Drink", 1750],
  ["family-combo-4", "Family Combo 4", "4 Zinger, 4 Pcs Chicken, 1 Family Fries, 1.5 Liter Drink", 2850],
  ["family-combo-5", "Family Combo 5", "5 Zinger Burger, 1.5 Liter Drink", 2150],
  ["family-combo-6", "Family Combo 6", "5 Zinger Burger, 5 Pcs Chicken, 1.5 Liter Drink", 3100],
];

const SIZE = [
  { label: "Small", value: 500 },
  { label: "Large", value: 950 },
];
const EXTRAS = [
  ["chicken-lasagne", "Chicken Lasagne", SIZE],
  ["chicken-pasta", "Chicken Pasta", SIZE],
  ["pizza-fries", "Pizza Fries", SIZE],
  ["nachos", "Nachos", SIZE],
  ["zinger-paratha-roll", "2 Zinger Paratha Roll", [{ label: "2 Rolls", value: 600 }]],
];

await mongoose.connect(process.env.MONGODB_URI);

for (const [i, [slug, title, contents, price]] of FAMILY.entries()) {
  const imageUrl = await upload(slug);
  await Deal.updateOne(
    { slug },
    { $set: { slug, title, contents, price, group: "family", imageUrl, order: 100 + i } },
    { upsert: true },
  );
}
for (const [i, [slug, name, prices]] of EXTRAS.entries()) {
  const imageUrl = await upload(slug);
  await Item.updateOne(
    { slug },
    { $set: { slug, name, prices, category: "family-extras", imageUrl, order: 200 + i } },
    { upsert: true },
  );
}

console.log("Family deals added");
process.exit(0);