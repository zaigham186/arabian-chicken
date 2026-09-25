import { FOOD_IMAGES } from "@/data/images";

const GALLERY = [
  { image: "hero", name: "The Arabian Feast" },
  { image: "pizza", name: "Chicken Tikka Pizza" },
  { image: "wings", name: "Buffalo Wings" },
  { image: "bbq", name: "Bar B Q" },
  { image: "fried", name: "Fish & Chips" },
  { image: "tenders", name: "Tender Pops & Corn Dog" },
  { image: "soup", name: "Chicken & Vegetables Mix Soup" },
  { image: "about", name: "Fresh From Our Oven" },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Gallery</span>
          <h2 className="heading-underline mx-auto mt-2 font-display text-4xl font-black text-foreground text-balance sm:text-5xl">
            Fresh From Our Kitchen
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY.map((shot, index) => (
            <figure
              key={shot.name}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <img
                src={FOOD_IMAGES[shot.image]}
                alt={shot.name}
                loading="lazy"
                width={1024}
                height={1024}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 ? "h-72 sm:h-[420px]" : "h-52"
                }`}
              />
              <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal-deep/90 via-charcoal-deep/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-display text-base font-bold text-foreground">
                  {shot.name}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
