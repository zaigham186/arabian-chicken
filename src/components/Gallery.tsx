
const GALLERY = [
  {
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85",
    name: "Chicken Tikka Pizza",
    category: "Pizza",
    size: "large",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85",
    name: "Crispy Chicken Wings",
    category: "Starters",
    size: "normal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
    name: "BBQ Special",
    category: "BBQ",
    size: "normal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85",
    name: "Fresh & Delicious",
    category: "Main Course",
    size: "normal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    name: "Chicken Soup",
    category: "Soups",
    size: "normal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    name: "Crispy Snacks",
    category: "Starters",
    size: "normal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85",
    name: "Fresh From Our Kitchen",
    category: "Special",
    size: "normal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
    name: "The Arabian Feast",
    category: "Signature",
    size: "large",
  },
];

export function Gallery() {
  return (
    <section
      id="gallery"
      className="bg-background py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-accent">
            Our Gallery
          </span>

          <h2 className="heading-underline mx-auto mt-3 font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            A Taste You Can See
          </h2>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            Take a look at some of our favorite dishes, freshly prepared
            with quality ingredients and served with love.
          </p>
        </div>

        {/* Gallery */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">

          {GALLERY.map((shot, index) => (
            <figure
              key={shot.name}
              className={`
                group relative overflow-hidden rounded-2xl
                bg-muted shadow-sm
                ${index === 0 ? "sm:col-span-2 lg:row-span-2" : ""}
                ${index === 7 ? "sm:col-span-2" : ""}
              `}
            >
              {/* Image */}
              <img
                src={shot.image}
                alt={shot.name}
                loading={index < 3 ? "eager" : "lazy"}
                className={`
                  h-full min-h-[250px] w-full object-cover
                  transition-all duration-700 ease-out
                  group-hover:scale-110
                  ${
                    index === 0
                      ? "h-[420px] sm:h-[520px]"
                      : "h-[260px] sm:h-[280px]"
                  }
                `}
              />

              {/* Dark overlay */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/85 via-black/20 to-transparent
                  opacity-70
                  transition-opacity duration-500
                  group-hover:opacity-100
                "
              />

              {/* Hover content */}
              <figcaption
                className="
                  absolute inset-x-0 bottom-0
                  translate-y-2 p-5
                  opacity-90
                  transition-all duration-500
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <span
                  className="
                    inline-block rounded-full
                    bg-white/15 px-3 py-1
                    text-[10px] font-bold uppercase
                    tracking-[0.18em] text-white
                    backdrop-blur-md
                  "
                >
                  {shot.category}
                </span>

                <h3
                  className="
                    mt-2 font-display text-xl font-bold
                    text-white sm:text-2xl
                  "
                >
                  {shot.name}
                </h3>

                <div className="mt-3 h-0.5 w-10 bg-accent transition-all duration-500 group-hover:w-16" />
              </figcaption>

              {/* Number */}
              <span
                className="
                  absolute right-4 top-4
                  flex h-9 w-9 items-center justify-center
                  rounded-full bg-black/25
                  text-xs font-bold text-white
                  backdrop-blur-md
                  transition-transform duration-500
                  group-hover:scale-110
                "
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </figure>
          ))}

        </div>

        {/* Bottom text */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Fresh ingredients. Delicious flavors.{" "}
            <span className="font-semibold text-foreground">
              Made fresh every day.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
