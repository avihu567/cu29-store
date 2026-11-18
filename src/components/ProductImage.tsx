import Image from "next/image";
import BrandPlaceholder from "./BrandPlaceholder";
import ProductArt from "./ProductArt";
import type { ArtVariant } from "@/lib/products";

/**
 * Shows a product photo when one exists; otherwise the branded placeholder
 * (when `placeholder` is set, e.g. coming-soon items) or the vector art.
 * The parent must be `relative` with a defined size (the image uses `fill`).
 */
export default function ProductImage({
  src,
  art,
  alt,
  sizes,
  priority = false,
  artClassName = "h-full w-auto",
  padded = true,
  placeholder,
}: {
  src?: string;
  art: ArtVariant;
  alt: string;
  sizes: string;
  priority?: boolean;
  artClassName?: string;
  padded?: boolean;
  /** Use the branded placeholder (with this caption) instead of the art. */
  placeholder?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    );
  }
  if (placeholder !== undefined) {
    return <BrandPlaceholder label={placeholder || undefined} size={padded ? "md" : "sm"} />;
  }
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${padded ? "p-8" : ""}`}>
      <ProductArt variant={art} className={artClassName} />
    </div>
  );
}
