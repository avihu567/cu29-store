"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { openCartDrawer } from "@/lib/cart-drawer";
import * as fpixel from "@/lib/fpixel";
import { RING_COLORS, formatPrice, isPurchasable, type GalleryImage, type Product } from "@/lib/products";
import { bottleVariantImages, ringImages, sleeveImages } from "@/lib/variant-images";
import BrandPlaceholder from "./BrandPlaceholder";
import ProductArt from "./ProductArt";

interface Swatch {
  id: string;
  name: string;
  hex: string;
}

function swatchesFor(p: Product): Swatch[] {
  if (p.ringColors) return p.ringColors.map((id) => ({ id, name: `טבעת ${RING_COLORS[id].name}`, hex: RING_COLORS[id].hex }));
  return p.colorOptions?.map((c) => ({ id: c.id, name: c.name, hex: c.hex })) ?? [];
}

/** Main + hover photo for the selected color (falls back to the product gallery). */
function photosFor(p: Product, color: string | undefined, gallery: GalleryImage[]): [GalleryImage?, GalleryImage?] {
  const variant = p.ringColors
    ? bottleVariantImages(p.size, color)
    : p.slug === "cu29-cooling-sleeve"
      ? sleeveImages("700 מ״ל", color)
      : p.slug === "silicone-carry-ring"
        ? ringImages(color)
        : [];
  const list = [...variant, ...gallery.filter((g) => !variant.some((v) => v.src === g.src))];
  return [list[0], list[1]];
}

export default function ProductCardClient({ product, gallery }: { product: Product; gallery: GalleryImage[] }) {
  const swatches = swatchesFor(product);
  const [color, setColor] = useState<string | undefined>(swatches[0]?.id);
  const [justAdded, setJustAdded] = useState(false);
  const [main, hover] = photosFor(product, color, gallery);
  const purchasable = isPurchasable(product) && !product.isComingSoon;
  // Accessories with a size choice open the product page instead of guessing a size.
  const needsOptions = Boolean(product.sizeOptions?.length);
  const href = `/product/${product.slug}`;

  function quickAdd() {
    if (!purchasable) return;
    addToCart({ slug: product.slug, quantity: 1, color });
    fpixel.addToCart({
      contents: [{ id: product.slug, quantity: 1, item_price: product.price }],
      value: product.price ?? 0,
      name: product.name,
    });
    setJustAdded(true);
    openCartDrawer();
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="reveal group flex flex-col">
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-24px_rgb(20_20_20_/_0.35)]"
      >
        {(product.isComingSoon || product.badge) && (
          <span className="absolute start-3 top-3 z-10 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-copper-deep ring-1 ring-copper/30">
            {product.isComingSoon ? "בקרוב בקולקציה" : product.badge}
          </span>
        )}
        {main ? (
          <>
            <Image
              key={main.src}
              src={main.src}
              alt={main.alt}
              fill
              sizes="(min-width: 1024px) 30vw, 50vw"
              className={`object-contain p-2 transition-opacity duration-500 ${hover ? "group-hover:opacity-0" : ""}`}
            />
            {hover && (
              <Image
                key={hover.src}
                src={hover.src}
                alt=""
                aria-hidden="true"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="object-contain p-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : product.isComingSoon ? (
          <BrandPlaceholder />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <ProductArt variant={product.art} className="h-[80%] w-auto" />
          </div>
        )}
      </Link>

      <div className="mt-4 flex flex-1 flex-col px-0.5">
        {swatches.length > 1 && (
          <div className="mb-2.5 flex items-center gap-2" role="group" aria-label={`צבעים: ${product.name}`}>
            {swatches.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setColor(s.id)}
                aria-pressed={s.id === color}
                aria-label={s.name}
                title={s.name}
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                  s.id === color ? "border-action" : "border-transparent hover:border-stone-muted"
                }`}
              >
                <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: s.hex }} />
              </button>
            ))}
          </div>
        )}

        <Link href={href} className="flex items-start justify-between gap-3">
          <span>
            <span className="block text-[15px] font-semibold leading-snug text-ink">{product.name}</span>
            <span className="mt-1 block text-sm text-stone">{product.subtitle}</span>
          </span>
          <span className="shrink-0 text-end">
            {product.price === undefined || product.isComingSoon ? (
              <span className="text-xs font-medium text-copper-deep">השקה בקרוב</span>
            ) : (
              <span className="text-[15px] font-semibold text-ink">{formatPrice(product.price)}</span>
            )}
            {product.compareAtPrice && !product.isComingSoon && (
              <span className="block text-xs text-stone line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </span>
        </Link>

        <div className="mt-auto pt-4">
          {purchasable && !needsOptions ? (
            <button
              type="button"
              onClick={quickAdd}
              className="btn-primary w-full rounded-full px-5 py-3 text-sm"
            >
              {justAdded ? "✓ נוסף לסל" : "הוספה לסל"}
            </button>
          ) : (
            <Link
              href={href}
              className="flex w-full items-center justify-center rounded-full border border-action px-5 py-3 text-sm font-semibold text-action transition-colors hover:bg-action hover:text-white"
            >
              {purchasable ? "בחירת מידה וצבע" : "לפרטים ועדכון בהשקה"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
