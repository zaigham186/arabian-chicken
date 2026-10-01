import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PAYMENT } from "@/data/menu";

export type CartItem = {
  key: string;
  name: string;
  option: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty">) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  whatsappUrl: string;
};

const CartContext = createContext<CartContextValue | null>(null);

// Order isi number par jayega. Screenshot bhi isi chat mein aayega.
// Agar screenshot 03151997888 par chahiye to "923151997888" likh dein.
const WHATSAPP_NUMBER = "923348457676";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      if (existing) {
        return prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increment = (key: string) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)));

  const decrement = (key: string) =>
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );

  const removeItem = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));

  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const whatsappUrl = useMemo(() => {
    const lines = items.map(
      (i) =>
        `• ${i.qty}× ${i.name} (${i.option}) — Rs.${(i.price * i.qty).toLocaleString("en-PK")}`,
    );
    const text =
      "Assalam-o-Alaikum! I would like to order:\n\n" +
      lines.join("\n") +
      `\n\nTotal: Rs.${total.toLocaleString("en-PK")}` +
      `\n\nPayment: ${PAYMENT.methods.join(" / ")} (${PAYMENT.number}) ya Cash on Delivery.` +
      `\nAgar online payment ki hai to screenshot is chat mein bhej raha hoon.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [items, total]);

  const value = useMemo(
    () => ({ items, count, total, addItem, increment, decrement, removeItem, clear, whatsappUrl }),
    [items, count, total, whatsappUrl],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}