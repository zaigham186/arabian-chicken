"use client";

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

export default function HomePage() {
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
