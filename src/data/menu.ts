export type PriceOption = {
  label: string;
  value: number;
};

export type MenuCategory = "wings" | "chicken" | "pizza" | "soup";

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
  { id: "pizza", label: "Pizza" },
  { id: "soup", label: "Soup & Sides" },
  { id: "deals", label: "Deals" },
];

export const MENU_ITEMS: MenuItem[] = [
  // Wings & Starters
  {
    id: "baked-wings",
    name: "Baked Wings",
    category: "wings",
    image: "wings",
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
    image: "wings",
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
    image: "wings",
    prices: [
      { label: "5 Piece", value: 350 },
      { label: "10 Piece", value: 650 },
    ],
  },
  {
    id: "tender-pops",
    name: "Tender Pops",
    category: "wings",
    image: "tenders",
    prices: [
      { label: "5 Piece", value: 300 },
      { label: "10 Piece", value: 600 },
    ],
  },
  {
    id: "corn-dog",
    name: "Corn Dog",
    category: "wings",
    image: "tenders",
    prices: [{ label: "Each", value: 400 }],
  },
  {
    id: "fish-chips",
    name: "Fish & Chips",
    category: "wings",
    image: "fried",
    prices: [{ label: "Serving", value: 700 }],
  },

  // Chicken
  {
    id: "chicken-karai",
    name: "Chicken Karai",
    category: "chicken",
    image: "bbq",
    prices: [
      { label: "Full", value: 1650 },
      { label: "Half", value: 850 },
    ],
  },
  {
    id: "bar-bq",
    name: "Bar B Q",
    category: "chicken",
    image: "bbq",
    prices: [
      { label: "Full Chicken", value: 1600 },
      { label: "Half Chicken", value: 800 },
    ],
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

  // Pizza — sizes: R | S | M | L | XL
  {
    id: "arabian-super-special",
    name: "Arabian Super Special",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 500 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2200 },
    ],
    tag: "Signature",
  },
  {
    id: "fajita",
    name: "Fajita",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 500 },
      { label: "S", value: 730 },
      { label: "M", value: 1100 },
      { label: "L", value: 1680 },
      { label: "XL", value: 2200 },
    ],
  },
  {
    id: "pizza-bar-bq",
    name: "Bar B Q Pizza",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 450 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2100 },
    ],
  },
  {
    id: "super-tikka",
    name: "Super Tikka",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 450 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2150 },
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 450 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2150 },
    ],
  },
  {
    id: "hot-spice",
    name: "Hot & Spice",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 450 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2150 },
    ],
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 450 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2150 },
    ],
  },
  {
    id: "calzone",
    name: "Calzone Pizza",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 450 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2150 },
    ],
  },
  {
    id: "fish-pizza",
    name: "Fish Pizza",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 450 },
      { label: "S", value: 700 },
      { label: "M", value: 1080 },
      { label: "L", value: 1570 },
      { label: "XL", value: 2150 },
    ],
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 400 },
      { label: "S", value: 600 },
      { label: "M", value: 1000 },
      { label: "L", value: 1500 },
      { label: "XL", value: 1900 },
    ],
  },
  {
    id: "cheese-lover",
    name: "Cheese Lover",
    category: "pizza",
    image: "pizza",
    prices: [
      { label: "R", value: 400 },
      { label: "S", value: 600 },
      { label: "M", value: 1000 },
      { label: "L", value: 1500 },
      { label: "XL", value: 1900 },
    ],
  },
];

export const PIZZA_CRUSTS = [
  "Cheese Stuff Crust",
  "Crown Crust Pizza",
  "Kabab Crust Pizza",
];

export type Deal = {
  id: number;
  title: string;
  contents: string;
  price: number;
};

// Suggested student deal combos & prices — confirm/adjust with the restaurant.
export const DEALS: Deal[] = [
  {
    id: 1,
    title: "Wings Combo",
    contents: "5 Pc Baked Wings + Fries + Drink",
    price: 499,
  },
  {
    id: 2,
    title: "Karai Deal",
    contents: "Half Chicken Karai + 2 Naan + Drink",
    price: 999,
  },
  {
    id: 3,
    title: "Pizza & Soup",
    contents: "Small Pizza + Mix Soup + Drink",
    price: 799,
  },
  {
    id: 4,
    title: "Pops Party",
    contents: "10 Pc Tender Pops + Fries + 2 Drinks",
    price: 899,
  },
  {
    id: 5,
    title: "Big Bite Box",
    contents: "10 Pc Peri Peri Wings + Fish & Chips + Drink",
    price: 1199,
  },
];

export const CONTACT = {
  phones: ["051-2312777", "0346-8627796"],
  whatsapp: "0346-9827796",
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
