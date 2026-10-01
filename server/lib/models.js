import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  { label: String, value: Number },
  { _id: false },
);

const itemSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: String,
    category: String,
    group: String,
    description: String,
    tag: String,
    imageUrl: String,
    prices: [priceSchema],
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const dealSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    badge: String,
    title: String,
    contents: String,
    price: Number,
    group: String, // "deal" | "double" | "family"
    imageUrl: String,
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Item = mongoose.model("Item", itemSchema);
export const Deal = mongoose.model("Deal", dealSchema);