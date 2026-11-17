import Image from "next/image";

/**
 * A lifestyle photo that fills its (relative, sized) parent. Decorative by
 * default; pass `alt` when the image carries meaning. A warm tint keeps
 * mismatched photos in the brand's palette.
 */
export default function LifestylePhoto({
  src,
  alt = "",
  sizes,
  priority = false,
  className = "",
  tint = true,
}: {
  src: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  tint?: boolean;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
      {tint && <div className="pointer-events-none absolute inset-0 bg-[#c9a27a]/10 mix-blend-multiply" />}
    </>
  );
}
