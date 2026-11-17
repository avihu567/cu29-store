import Image from "next/image";
import Link from "next/link";
import ProductArt from "./ProductArt";
import { getGallery } from "@/lib/product-images";
import { type Product, formatPrice } from "@/lib/products";

/**
 * Product card: square white frame with gallery image 1; image 2 fades in on
 * hover (desktop). Falls back to the vector art when there are no photos.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [main, hover] = getGallery(product);

  return (
    <Link href={`/product/${product.slug}`} className="reveal group block">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line/60 transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)] group-hover:ring-copper/35">
        {product.badge && (
          <span className="absolute start-4 top-4 z-10 rounded-full bg-paper/90 px-3 py-1 text-[11px] tracking-[0.08em] text-copper-deep ring-1 ring-copper/20 backdrop-blur">
            {product.badge}
          </span>
        )}

        {main ? (
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]">
            <Image
              src={main.src}
              alt={main.alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={`object-contain transition-opacity duration-500 ${hover ? "group-hover:opacity-0" : ""}`}
            />
            {hover && (
              <Image
                src={hover.src}
                alt=""
                aria-hidden="true"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]">
            <ProductArt
              variant={product.art}
              className="h-[80%] w-auto drop-shadow-[10px_20px_18px_rgba(91,63,44,0.22)]"
            />
          </div>
        )}

        {/* "View" pill fades up on hover */}
        <span className="absolute inset-x-0 bottom-5 z-10 mx-auto w-fit translate-y-2 rounded-full bg-paper/90 px-5 py-2 text-xs tracking-[0.1em] text-ink opacity-0 shadow-[var(--shadow-soft)] backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          לצפייה במוצר
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-3 px-1">
        <div>
          <h3 className="font-serif text-lg leading-snug text-ink transition-colors duration-300 group-hover:text-copper-deep">
            {product.name}
          </h3>
          <p className="text-subtle mt-1.5 text-sm text-stone">{product.subtitle}</p>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-sm text-ink">
            {product.price !== undefined ? formatPrice(product.price) : "בקרוב"}
          </p>
          {product.compareAtPrice && (
            <p className="text-xs text-stone line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
