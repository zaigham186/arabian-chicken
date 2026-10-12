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

const siteUrl = process.env["NEXT_PUBLIC_APP_URL"] || "https://arabianchicken.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arabian Chick, N — Fast Food & Pizza Restaurant, Peshawar",
    template: "%s | Arabian Chick, N",
  },
  description:
    "Arabian Chick, N is Peshawar's go-to spot for crispy wings, sizzling BBQ and handcrafted pizzas. Student deals, home delivery — order on WhatsApp.",
  keywords: [
    "Arabian Chicken",
    "Arabian Chick N",
    "Pizza Peshawar",
    "Fast Food Peshawar",
    "Crispy Wings",
    "BBQ Peshawar",
    "Burgers Peshawar",
    "WhatsApp Food Order Peshawar",
  ],
  authors: [{ name: "Arabian Chick, N" }],
  creator: "Arabian Chick, N",
  publisher: "Arabian Chick, N",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon",
    apple: "/icon",
  },
  openGraph: {
    title: "Arabian Chick, N — Fast Food & Pizza Restaurant, Peshawar",
    description:
      "Crispy wings, sizzling BBQ and handcrafted pizzas in Peshawar. Explore the menu, student deals and home delivery.",
    url: siteUrl,
    siteName: "Arabian Chick, N",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arabian Chick, N — Fast Food & Pizza Restaurant, Peshawar",
    description:
      "Crispy wings, sizzling BBQ and handcrafted pizzas in Peshawar. Explore the menu, student deals and home delivery.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans text-foreground antialiased"
      >
        {children}
      </body>
    </html>
  );
}
