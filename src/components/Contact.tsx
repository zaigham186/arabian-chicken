import { CONTACT } from "@/data/menu";

const INFO = [
  {
    icon: "📍",
    label: "Address",
    lines: ["Syed Qamar Abbas Road, Gulbahar No.2,", "Near Govt Girls School, Peshawar"],
  },
  {
    icon: "📞",
    label: "Phone",
    lines: CONTACT.phones,
  },
  {
    icon: "📱",
    label: "WhatsApp",
    lines: [CONTACT.whatsapp],
  },
  {
    icon: "📘",
    label: "Facebook",
    lines: [CONTACT.facebookHandle],
  },
];

export function Contact() {
  return (
    <section id="contact" className="bg-cream py-20 text-cream-foreground sm:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-red">
            Find Us
          </span>
          <h2 className="heading-underline mt-2 font-display text-4xl font-black text-balance sm:text-5xl">
            Visit Or Call Us
          </h2>

          <ul className="mt-10 space-y-5">
            {INFO.map((row) => (
              <li key={row.label} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/20 text-2xl">
                  {row.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-red">
                    {row.label}
                  </p>
                  {row.label === "Phone" ? (
                    <div className="mt-1 flex flex-wrap gap-x-4">
                      {CONTACT.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/-/g, "")}`}
                          className="font-semibold text-cream-foreground hover:text-brand-red"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  ) : row.label === "WhatsApp" ? (
                    <a
                      href={CONTACT.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block font-semibold text-cream-foreground hover:text-brand-red"
                    >
                      {CONTACT.whatsapp}
                    </a>
                  ) : row.label === "Facebook" ? (
                    <a
                      href={CONTACT.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block font-semibold text-cream-foreground hover:text-brand-red"
                    >
                      {CONTACT.facebookHandle}
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold leading-relaxed text-cream-foreground">
                      {row.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-[380px] overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/10">
          <iframe
            title="Arabian Chick, N location — Gulbahar No.2, Peshawar"
            src={CONTACT.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[380px] w-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
