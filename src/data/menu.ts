export type PriceOption = {
  label: string;
  value: number;
};

export type MenuCategory = "wings" | "chicken" | "soup";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  image: string;
  prices: PriceOption[];
  tag?: string;
};

export const CATEGORIES: { id: MenuCategory | "all" | "deals"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "wings", label: "Wings & Starters" },
  { id: "chicken", label: "Chicken" },
  { id: "soup", label: "Soup & Sides" },
  { id: "deals", label: "Deals" },
];

export const MENU_ITEMS: MenuItem[] = [
  // Wings & Starters
  {
    id: "baked-wings",
    name: "Baked Wings",
    category: "wings",
    image: "bakedWings",
    prices: [
      { label: "5 Piece", value: 350 },
      { label: "10 Piece", value: 650 },
    ],
    tag: "New Arrival",
  },
  {
    id: "buffalo-wings",
    name: "Buffalo Wings",
    category: "wings",
    image: "buffaloWings",
    prices: [
      { label: "5 Piece", value: 370 },
      { label: "10 Piece", value: 700 },
    ],
    tag: "New Arrival",
  },
  {
    id: "peri-peri-wings",
    name: "Peri Peri Wings",
    category: "wings",
    image: "periPeriWings",
    prices: [
      { label: "5 Piece", value: 370 },
      { label: "10 Piece", value: 700 },
    ],
  },
  {
    id: "fish-chips",
    name: "Fish & Chips",
    category: "wings",
    image: "fishChips",
    prices: [{ label: "Serving", value: 750 }],
  },

  // Chicken
  {
    id: "bar-bq",
    name: "Bar B Q",
    category: "chicken",
    image: "bbq",
    prices: [
      { label: "Full Chicken", value: 1750 },
      { label: "Half Chicken", value: 900 },
    ],
    tag: "New Arrival",
  },
  {
    id: "chicken-karai",
    name: "Chicken Karai",
    category: "chicken",
    image: "karai",
    prices: [
      { label: "Full", value: 1800 },
      { label: "Half", value: 950 },
    ],
  },
  {
    id: "chicken-broast",
    name: "Full Chicken Broast",
    category: "chicken",
    image: "broast",
    prices: [{ label: "Full Size Chicken", value: 1800 }],
  },

  // Soup & Sides
  {
    id: "mix-soup",
    name: "Chicken & Vegetables Mix Soup",
    category: "soup",
    image: "soup",
    prices: [
      { label: "Small", value: 300 },
      { label: "Large", value: 500 },
    ],
  },
];

export const PIZZA_CRUSTS: string[] = [];

export type Deal = {
  id: number;
  title: string;
  contents: string;
  price: number;
};

// Suggested combos built ONLY from the items above — confirm/adjust prices with the restaurant.
export const DEALS: Deal[] = [
  {
    id: 1,
    title: "Wings Combo",
    contents: "5 Pc Baked Wings + 5 Pc Peri Peri Wings",
    price: 650,
  },
  {
    id: 2,
    title: "Karai Deal",
    contents: "Half Chicken Karai + Small Mix Soup",
    price: 1150,
  },
  {
    id: 3,
    title: "Big Bite Box",
    contents: "10 Pc Buffalo Wings + Fish & Chips",
    price: 1350,
  },
];

export const CONTACT = {
  phones: ["091-2212777", "0334-8457676", "0346-9827796", "0312-80843480"],
  whatsapp: "0334-8457676",
  whatsappLink: "https://wa.me/923348457676",
  facebook: "https://facebook.com/arabianchickgulbahar",
  facebookHandle: "@arabianchickgulbahar",
  address:
    "Syed Qamar Abbas Road, Gulbahar No.2, Near Govt Girls School, Peshawar",
  mapEmbed:
    "https://maps.google.com/maps?q=Gulbahar%20No.2%20Peshawar&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

export function formatRs(value: number): string {
  return `Rs.${value.toLocaleString("en-PK")}`;
}