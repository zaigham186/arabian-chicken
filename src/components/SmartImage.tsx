/**
 * Sab images ki height barabar (className se aati hai, jaise "h-48").
 * Image poori width aur height bharti hai, side kabhi khali nahi hoti.
 */
export function SmartImage({
  src,
  alt,
  className = "h-48",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-charcoal-deep ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}