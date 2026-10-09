import { createFileRoute } from "@tanstack/react-router";
import arabianLogo from "@/assets/Arabian.jpeg";
import { CartProvider } from "@/components/cart";
import { CartWidget } from "@/components/CartWidget";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BestOffer } from "@/components/BestOffer";
import { MenuSection } from "@/components/MenuSection";
import { Deals } from "@/components/Deals";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Arabian Chick, N — Fast Food & Pizza Restaurant, Peshawar",
      },
      {
        name: "description",
        content:
          "Arabian Chick, N is Peshawar's go-to spot for crispy wings, sizzling BBQ and handcrafted pizzas. Student deals, home delivery — order on WhatsApp.",
      },
      {
        property: "og:title",
        content: "Arabian Chick, N — Fast Food & Pizza Restaurant, Peshawar",
      },
      {
        property: "og:description",
        content:
          "Crispy wings, sizzling BBQ and handcrafted pizzas in Peshawar. Explore the menu, student deals and home delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],

    links: [
      {
        rel: "icon",
        href:
          typeof arabianLogo === "object" && arabianLogo && "src" in arabianLogo
            ? (arabianLogo as any).src
            : String(arabianLogo),
      },
    ],
  }),

  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <BestOffer />
        <MenuSection />
        <Deals />
        <DeliveryBanner />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <CartWidget />
    </CartProvider>
  );
}
