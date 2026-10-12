import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arabian Chick, N — Fast Food & Pizza Restaurant",
    short_name: "Arabian Chick",
    description:
      "Crispy wings, sizzling BBQ and handcrafted pizzas in Peshawar. Home delivery & WhatsApp ordering.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#dc2626",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
