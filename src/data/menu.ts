export type PriceOption = { label: string; value: number };

export type MenuCategory =
  | "pizza"
  | "meals"
  | "china"
  | "burgers"
  | "fried-chicken"
  | "hot-wings"
  | "nuggets"
  | "rolls"
  | "fries"
  | "related"
  | "drinks"
  // sirf New Arrival / Family section ke liye (menu tabs mein nahi)
  | "wings"
  | "chicken"
  | "soup"
  | "family-extras";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  group?: "hot" | "crust" | "extras";
  image: string;
  imageUrl?: string;
  available?: boolean;
  description?: string;
  prices: PriceOption[];
  tag?: string;
};

export const CATEGORIES: { id: MenuCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pizza", label: "Pizza" },
  { id: "meals", label: "Meals" },
  { id: "china", label: "China Dishes" },
  { id: "burgers", label: "Burgers" },
  { id: "fried-chicken", label: "Chicken" },
  { id: "hot-wings", label: "Hot Wings" },
  { id: "nuggets", label: "Nuggets" },
  { id: "rolls", label: "Rolls" },
  { id: "fries", label: "Fries" },
  { id: "related", label: "Related Orders" },
  { id: "drinks", label: "Drinks & Desserts" },
];

/* ---------- helpers ---------- */
const PIZZA_SIZES = ["R 5in", "S 7in", "M 10in", "L 13in", "XL 17in"];
const sizes = (v: [number, number, number, number, number]): PriceOption[] =>
  v.map((value, i) => ({ label: PIZZA_SIZES[i]!, value }));

const pizza = (
  id: string,
  name: string,
  description: string,
  image: string,
  v: [number, number, number, number, number],
  tag?: string,
): MenuItem => ({
  id,
  name,
  category: "pizza",
  group: "hot",
  description,
  image,
  prices: sizes(v),
  ...(tag !== undefined ? { tag } : {}),
});

const crust = (
  id: string,
  name: string,
  image: string,
  v: [number, number, number, number],
): MenuItem => ({
  id,
  name,
  category: "pizza",
  group: "crust",
  image,
  prices: [
    { label: "Small", value: v[0] },
    { label: "Medium", value: v[1] },
    { label: "Large", value: v[2] },
    { label: "Extra Large", value: v[3] },
  ],
});

const extra = (
  id: string,
  name: string,
  image: string,
  prices: PriceOption[],
  description?: string,
): MenuItem => ({
  id,
  name,
  category: "pizza",
  group: "extras",
  image,
  ...(description === undefined ? {} : { description }),
  prices,
});

const meal = (
  id: string,
  name: string,
  price: number,
  description: string,
  image: string,
): MenuItem => ({
  id,
  name,
  category: "meals",
  description,
  image,
  prices: [{ label: "Meal", value: price }],
});

const simple = (
  id: string,
  name: string,
  category: MenuCategory,
  image: string,
  prices: [string, number][],
  description?: string,
): MenuItem => ({
  id,
  name,
  category,
  image,
  ...(description !== undefined ? { description } : {}),
  prices: prices.map(([label, value]) => ({ label, value })),
});

export const EXTRA_TOPPING = "Extra Topping: S Rs.100 · M Rs.150 · L Rs.200 · XL Rs.300";

/* ---------- menu (seed script isi se data parhti hai) ---------- */
export const MENU_ITEMS: MenuItem[] = [
  /* ===== PIZZA (Hot Pizza) ===== */
  pizza(
    "arabian-super-special",
    "Arabian Super Special",
    "Chicken Tikka, Beef Sausages, Capsicum, Onion, Fajita Chicken, Olives, Mushrooms, Cheese, Beef Pepperoni Chunks",
    "pizza-special",
    [500, 750, 1150, 1700, 2250],
    "Signature",
  ),
  pizza(
    "fajita",
    "Fajita",
    "Chicken Botti, Capsicum, Onion, Olives, Mushrooms, Cheese and Spicy",
    "pizza-fajita",
    [500, 700, 1100, 1600, 2100],
  ),
  pizza(
    "bar-bq-pizza",
    "Bar B.Q",
    "Chicken Botti, Capsicum, Tomato, Onion, Cheese",
    "pizza-bbq",
    [500, 700, 1100, 1600, 2100],
  ),
  pizza(
    "super-tikka",
    "Super Tikka",
    "Chicken Tikka, Chicken Sausages, Capsicum, Onion, Cheese",
    "pizza-tikka",
    [450, 700, 1100, 1600, 2150],
  ),
  pizza(
    "supreme",
    "Supreme",
    "Chicken Tikka, Capsicum, Onion, Pepperoni, Olives, Mushroom, Cheese",
    "pizza-supreme",
    [450, 700, 1100, 1600, 2150],
  ),
  pizza(
    "hot-spicy",
    "Hot & Spicy",
    "Chicken Tikka, Onion, Capsicum, Beef Sausages, Cheese",
    "pizza-spicy",
    [450, 700, 1100, 1600, 2150],
  ),
  pizza(
    "chicken-tikka",
    "Chicken Tikka",
    "Chicken Tikka, Onion, Capsicum, Cheese",
    "pizza-tikka",
    [450, 700, 1100, 1600, 2150],
  ),
  pizza(
    "calzone",
    "Calzone Pizza",
    "Chicken Tikka, Beef Sausages, Capsicum, Fajita Chicken, Mushrooms, Cheese",
    "pizza-calzone",
    [450, 700, 1100, 1600, 2150],
  ),
  pizza(
    "fish-pizza",
    "Fish Pizza",
    "Fish, Cheese, Black Olives, Sausage, Capsicum, Pizza Sauce",
    "pizza-fish",
    [1000, 1000, 1500, 2250, 2800],
  ),
  pizza(
    "vegetarian",
    "Vegetarian",
    "Onion, Tomatoes, Mushrooms, Black Olives, Bell Pepper, Sweet Corn",
    "pizza-veg",
    [400, 600, 1000, 1500, 1900],
  ),
  pizza(
    "cheese-lover",
    "Cheese Lover",
    "Layers of Cheese, Onion, Sauce",
    "pizza-cheese",
    [400, 600, 1000, 1500, 1900],
  ),

  /* ===== PIZZA (Special Crust) ===== */
  crust(
    "cheese-stuff-crust",
    "Cheese Stuff Crust Pizza",
    "pizza-cheese-stuff",
    [850, 1350, 1850, 2600],
  ),
  crust("crown-crust", "Crown Crust Pizza", "pizza-crown-crust", [850, 1350, 1850, 2600]),
  crust("kabab-crust", "Kabab Crust Pizza", "pizza-kabab-crust", [650, 1050, 1650, 2650]),

  /* ===== PIZZA (Extras) ===== */
  extra("paratha-pizza", "Paratha Pizza", "extra-paratha-pizza", [
    { label: "Serving", value: 750 },
  ]),
  extra("labnani-shawarma", "Labnani Shawarma", "extra-labnani-shawarma", [
    { label: "Each", value: 300 },
  ]),
  extra("tikka-botti-burger", "Tikka Botti Burger", "extra-tikka-botti-burger", [
    { label: "Each", value: 300 },
  ]),
  extra("bihari-roll", "Bihari Roll", "extra-bihari-roll", [
    { label: "Regular", value: 350 },
    { label: "Special", value: 400 },
  ]),
  extra(
    "classic-platter",
    "Classic Platter",
    "extra-classic-platter",
    [{ label: "Platter", value: 1180 }],
    "4 Arabic Roll, 4 Behari Roll, Fries",
  ),
  extra(
    "roasted-platter",
    "Roasted Platter",
    "extra-roasted-platter",
    [{ label: "Platter", value: 850 }],
    "5 Back Wings, 2 Behari Roll, 2 Arabic Roll",
  ),

  /* ===== MEALS ===== */
  meal("zee-meal", "Zee Meal", 650, "1 Zinger Burger, 1 Reg Drink, 1 Reg Fries", "meal-zinger"),
  meal("tower-meal", "Tower Meal", 850, "1 Tower Burger, 1 Reg Drink, 1 Reg Fries", "meal-tower"),
  meal(
    "saving-meal",
    "Saving Meal",
    700,
    "1 Zinger Burger, 1 Chicken Piece, 1 Reg Drink",
    "meal-saving",
  ),
  meal("macho-meal", "Macho Meal", 750, "1 Macho Burger, 1 Reg Fries, 1 Reg Drink", "meal-macho"),
  meal(
    "chicken-meal",
    "Chicken Meal",
    550,
    "1 Chicken Burger, 1 Reg Fries, 1 Reg Drink",
    "meal-chicken-burger",
  ),
  meal(
    "tikka-meal",
    "Tikka Meal",
    550,
    "1 Tikka Burger, 1 Reg Fries, 1 Reg Drink",
    "meal-tikka-burger",
  ),
  meal(
    "crispy-meal",
    "Crispy Meal",
    550,
    "1 Crispy Burger, 1 Reg Fries, 1 Reg Drink",
    "meal-chicken-burger",
  ),
  meal("kids-meal", "Kids Meal", 550, "1 Crispy Burger, 3 Nuggets, 1 Reg Drink", "meal-kids"),
  meal("bbq-meal", "Bar B.Q Meal", 700, "10 Bar B.Q Wings, 1 Reg Drink", "meal-bbq-wings"),
  meal(
    "fish-burger-meal",
    "Fish Burger Meal",
    800,
    "1 Fish Burger, 1 Reg Fries, 1 Reg Drink",
    "meal-fish-burger",
  ),
  meal(
    "finger-fish-meal",
    "Finger Fish Meal",
    600,
    "4 Pcs Finger Fish, 1 Reg Drink",
    "meal-finger-fish",
  ),
  meal("classic-meal", "Classic Meal", 1050, "14 Hot Wings, 2 Reg Drink", "meal-hot-wings"),
  meal(
    "combo-1",
    "Combo Meal 1",
    700,
    "2 Pieces Chicken (Combination), 1 Reg Fries, 1 Reg Drink",
    "meal-fried-chicken",
  ),
  meal(
    "combo-2",
    "Combo Meal 2",
    700,
    "3 Pieces Chicken (Combination), 1 Reg Drink",
    "meal-fried-chicken",
  ),
  meal(
    "combo-3",
    "Combo Meal 3",
    850,
    "1 Zinger Burger, 1 Chicken Piece, 1 Reg Fries, 1 Reg Drink",
    "meal-saving",
  ),
  meal(
    "combo-4",
    "Combo Meal 4",
    550,
    "1 Chicken Shawarma, 4 Hot Wings, 1 Reg Drink",
    "meal-shawarma",
  ),
  meal("combo-5", "Combo Meal 5", 500, "2 Mini Zinger", "meal-mini-zinger"),
  meal("combo-6", "Combo Meal 6", 500, "2 Zinger Shawarma", "meal-shawarma"),
  meal("two-person-meal", "2 Person Meal", 950, "2 Zinger Burger, 2 Reg Drink", "meal-two-person"),
  meal(
    "three-person-meal",
    "3 Person Meal",
    1800,
    "3 Zinger Burger, 8 Hot Wings, 1 Liter Drink",
    "meal-two-person",
  ),

  /* ===== CHINA DISHES ===== */
  simple("chicken-chowmin", "Chicken Chowmin", "china", "china-chowmin-chicken", [
    ["Small", 350],
    ["Large", 550],
  ]),
  simple("veg-chowmin", "Vegetable Chowmin", "china", "china-chowmin-veg", [
    ["Small", 300],
    ["Large", 500],
  ]),
  simple("chicken-egg-rice", "Chicken and Egg Fried Rice", "china", "china-fried-rice-egg", [
    ["Small", 330],
    ["Large", 550],
  ]),
  simple("chicken-fried-rice", "Chicken Fried Rice", "china", "china-fried-rice-chicken", [
    ["Small", 300],
    ["Large", 500],
  ]),
  simple("veg-fried-rice", "Vegetable Fried Rice", "china", "china-fried-rice-veg", [
    ["Small", 300],
    ["Large", 500],
  ]),

  /* ===== BURGERS ===== */
  simple("burger-zinger", "Zinger Burger", "burgers", "cat-burger", [["Large", 430]]),
  simple("burger-bbq", "Bar B Q Burger", "burgers", "cat-burger", [["Special", 580]]),
  simple("burger-kiddy", "Kiddy Burger", "burgers", "cat-burger", [["Each", 350]]),
  simple("burger-tower", "Tower Burger", "burgers", "cat-burger", [["Each", 580]]),
  simple("burger-tikka", "Ch. Tikka Burger", "burgers", "cat-burger", [["Each", 350]]),
  simple("burger-crispy", "Ch. Crispy Burger", "burgers", "cat-burger", [["Each", 350]]),
  simple("burger-fish", "Fish Burger", "burgers", "cat-burger", [["Each", 600]]),
  simple("burger-mighty", "Mighty Burger", "burgers", "cat-burger", [["Each", 700]]),
  simple("burger-macho", "Macho Burger", "burgers", "cat-burger", [["Each", 500]]),
  simple("burger-grill", "Grill Burger", "burgers", "cat-burger", [["Each", 580]]),

  /* ===== CHICKEN (pieces) ===== */
  simple(
    "chicken-pieces",
    "Fried Chicken",
    "fried-chicken",
    "cat-chicken",
    [
      ["1 Pc", 250],
      ["3 Pcs", 650],
      ["6 Pcs", 1280],
      ["9 Pcs", 1920],
      ["12 Pcs", 2500],
    ],
    "12 Pcs Chicken is a combination",
  ),

  /* ===== HOT WINGS ===== */
  simple("hot-wings", "Hot Wings", "hot-wings", "cat-hot-wings", [
    ["5 Pieces", 350],
    ["10 Pieces", 650],
  ]),

  /* ===== NUGGETS ===== */
  simple("nuggets", "Nuggets", "nuggets", "cat-nuggets", [
    ["5 Pieces", 300],
    ["10 Pieces", 550],
  ]),

  /* ===== ROLLS ===== */
  simple("roll-chicken-sh", "Chicken Shawarma", "rolls", "cat-rolls", [["Each", 220]]),
  simple("roll-arabic-sh", "Arabic Shawarma", "rolls", "cat-rolls", [["Each", 250]]),
  simple("roll-fish-sh", "Fish Shawarma", "rolls", "cat-rolls", [["Each", 350]]),
  simple("roll-bbq-sh", "Bbq Shawarma", "rolls", "cat-rolls", [["Each", 300]]),
  simple("roll-parata", "Parata Roll", "rolls", "cat-rolls", [["Each", 300]]),
  simple("roll-twister", "Twister Roll", "rolls", "cat-rolls", [
    ["Small", 250],
    ["Regular", 430],
  ]),
  simple("roll-zinger-sh", "Zinger Shawarma", "rolls", "cat-rolls", [
    ["Small", 250],
    ["Large", 430],
  ]),
  simple("roll-zinger-parata", "Zinger Parata Roll", "rolls", "cat-rolls", [
    ["Small", 300],
    ["Large", 430],
  ]),
  simple("roll-behari", "Behari Roll", "rolls", "cat-rolls", [["Each", 350]]),

  /* ===== FRIES ===== */
  simple("fries", "Fries", "fries", "cat-fries", [
    ["Reg", 200],
    ["Large", 300],
    ["Family", 400],
  ]),

  /* ===== RELATED ORDERS ===== */
  simple("related-finger-fish", "Finger Fish", "related", "cat-related", [["4 Pieces", 550]]),
  simple("related-paratha-roll", "Ch. Paratha Roll", "related", "cat-related", [["Each", 300]]),
  simple("related-bbq-wings", "Bar B Q Wings", "related", "cat-related", [["10 Pieces", 650]]),
  simple("related-hot-shot", "Hot Shot", "related", "cat-related", [["10 Pieces", 500]]),
  simple("related-grill-burger", "Grill Burger", "related", "cat-related", [["Each", 550]]),

  /* ===== DRINKS & DESSERTS ===== */
  simple("drink-soft", "Soft Drink", "drinks", "cat-drinks", [
    ["Disposable", 100],
    ["1 Liter", 200],
    ["1.5 Liter", 250],
  ]),
  simple("drink-water", "Mineral Water", "drinks", "cat-drinks", [
    ["Small", 80],
    ["Large", 150],
  ]),
  simple("drink-sting", "Sting (500ml)", "drinks", "cat-drinks", [["Each", 150]]),
  simple("extra-cheese", "Extra Cheese", "drinks", "cat-drinks", [["Add-on", 50]]),

  /* ===== NEW ARRIVAL ===== */
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
    prices: [
      { label: "Full", value: 1800 },
      { label: "Half", value: 950 },
    ],
  },
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

/* ---------- deals ---------- */
export type Deal = {
  id: number | string;
  title: string;
  contents: string;
  price: number;
  badge?: string;
  imageUrl?: string;
  available?: boolean;
  group: "deal" | "double" | "family";
};

export const DEALS: Deal[] = [
  {
    id: 1,
    badge: "Student Deal",
    title: "Pizza & Wings",
    contents: "1 Regular Pizza, 4 Hot Wings, 1 Reg. Drink",
    price: 750,
    group: "deal",
  },
  {
    id: 2,
    badge: "Deal 1",
    title: "Tikka Pizza & Chicken",
    contents: "1 Tikka Pizza, 1 Chicken Piece, 1 Reg Drink",
    price: 990,
    group: "deal",
  },
  {
    id: 3,
    badge: "Deal 2",
    title: "Medium Pizza & Wings",
    contents: "1 Medium Pizza, 4 Hot Wings, 2 Reg. Drink",
    price: 1400,
    group: "deal",
  },
  {
    id: 4,
    badge: "Deal 3",
    title: "Large Pizza & Burgers",
    contents: "1 Large Pizza, 2 Zee 'N' Zee Burgers, 1.5 Liter Drink",
    price: 2400,
    group: "deal",
  },
  {
    id: 5,
    badge: "Deal 4",
    title: "Twin Large Pizza",
    contents: "2 Large Pizzas, 1.5 Liter Drink",
    price: 3200,
    group: "deal",
  },
  {
    id: 6,
    badge: "Deal 5",
    title: "Pizza & 8 Wings",
    contents: "1 Medium Pizza, 8 Hot Wings, 1 Liter Drink",
    price: 1600,
    group: "deal",
  },
  {
    id: 7,
    badge: "Deal 6",
    title: "Party Feast",
    contents: "1 Large Pizza, 4 Zinger Burger, 1 Family Fries, 1.5 Liter Drink",
    price: 3650,
    group: "deal",
  },
  {
    id: 8,
    badge: "Deal 7",
    title: "Pizza & Chicken",
    contents: "1 Large Pizza, 5 Piece Chicken, 1.5 Liter Drink",
    price: 2800,
    group: "deal",
  },

  {
    id: 9,
    badge: "Double Deal 1",
    title: "2 Regular Pizza",
    contents: "2 Reg Pizza",
    price: 899,
    group: "double",
  },
  {
    id: 10,
    badge: "Double Deal 2",
    title: "2 Small Pizza",
    contents: "2 Small Pizza · Flavour: Crown Crust",
    price: 1250,
    group: "double",
  },
  {
    id: 11,
    badge: "Double Deal 3",
    title: "2 Medium Pizza",
    contents: "2 Medium Pizza",
    price: 2050,
    group: "double",
  },
  {
    id: 12,
    badge: "Double Deal 4",
    title: "2 Large Pizza",
    contents: "2 Large Pizza",
    price: 3050,
    group: "double",
  },
  {
    id: 13,
    badge: "Double Deal 5",
    title: "2 Extra Large Pizza",
    contents: "2 Extra Large Pizza",
    price: 4050,
    group: "double",
  },
];

export const CONTACT = {
  phones: ["091-2212777", "0334-8457676", "0342-9201920"],
  whatsapp: "0334-8457676",
  whatsappLink: "https://wa.me/923348457676",
  facebook: "https://facebook.com/arabianchickgulbahar",
  facebookHandle: "@arabianchickgulbahar",
  address: "Syed Qamar Abbas Road, Gulbahar No.2, Near Govt Girls School, Peshawar",
  mapEmbed:
    "https://maps.google.com/maps?q=Gulbahar%20No.2%20Peshawar&t=&z=15&ie=UTF8&iwloc=&output=embed",
};
export const PAYMENT = {
  methods: ["Easypaisa", "JazzCash"],
  accounts: [
    { name: "Tariq Mehmood", number: "03151997888" },
    { name: "Shahid Mehmood", number: "03459495524" },
  ],
};

export function formatRs(value: number): string {
  return `Rs.${value.toLocaleString("en-PK")}`;
}
// Extra topping ka rate (har topping ka, size ke hisaab se)
const TOPPING_BY_SIZE: Record<string, number> = {
  S: 100,
  M: 150,
  L: 200,
  XL: 300,
  Small: 100,
  Medium: 150,
  Large: 200,
  "Extra Large": 300,
};

// Size label se topping ka rate (R size ke liye null, yani topping nahi)
export function toppingPriceFor(sizeLabel: string): number | null {
  return TOPPING_BY_SIZE[sizeLabel] ?? TOPPING_BY_SIZE[sizeLabel.split(" ")[0] ?? ""] ?? null;
}

// Toppings ki list (restaurant ke mutabiq badal lein)
export const TOPPING_OPTIONS = [
  "Extra Cheese",
  "Chicken Tikka",
  "Fajita Chicken",
  "Beef Sausage",
  "Pepperoni",
  "Mushrooms",
  "Black Olives",
  "Capsicum",
  "Onion",
  "Sweet Corn",
  "Jalapeno",
];
