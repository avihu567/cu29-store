import Link from "next/link";
import ProductImage from "./ProductImage";
import { getMainImage } from "@/lib/product-images";
import { type Product, formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="reveal group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-cream ring-1 ring-transparent transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)] group-hover:ring-copper/35">
        {product.badge && (
          <span className="absolute start-4 top-4 z-10 rounded-full bg-paper/85 px-3 py-1 text-[11px] tracking-[0.08em] text-copper-deep ring-1 ring-copper/20 backdrop-blur">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]">
          <ProductImage
            src={getMainImage(product.imageDir)}
            art={product.art}
            alt={product.name}
            sizes="(min-width: 1024px) 25vw, 50vw"
            artClassName="h-[80%] w-auto drop-shadow-[10px_20px_18px_rgba(91,63,44,0.22)]"
          />
        </div>
        {/* "View" pill fades up on hover */}
        <span className="absolute inset-x-0 bottom-5 mx-auto w-fit translate-y-2 rounded-full bg-paper/90 px-5 py-2 text-xs tracking-[0.1em] text-ink opacity-0 shadow-[var(--shadow-soft)] backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
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
