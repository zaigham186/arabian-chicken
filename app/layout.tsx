import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Arabian Chick, N — Fast Food & Pizza Restaurant, Peshawar",
  description:
    "Arabian Chick, N is Peshawar's go-to spot for crispy wings, sizzling BBQ and handcrafted pizzas. Student deals, home delivery — order on WhatsApp.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Arabian Chick, N — Fast Food & Pizza Restaurant, Peshawar",
    description:
      "Crispy wings, sizzling BBQ and handcrafted pizzas in Peshawar. Explore the menu, student deals and home delivery.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
