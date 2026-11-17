// Server-only module (uses node:fs) — import from Server Components only.
import fs from "node:fs";
import path from "node:path";
import type { GalleryImage, Product } from "./products";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

/**
 * Lists the photos placed in /public/products/<dir>/, sorted by filename,
 * so "01.jpg" becomes the main image. Returns public URLs, or [] if the
 * folder is empty — callers then fall back to the vector ProductArt.
 *
 * Folders are read at render time in dev and at build time in production,
 * so new photos need a rebuild before they appear on a deployed site.
 */
export function getProductImages(dir: string): string[] {
  try {
    return fs
      .readdirSync(path.join(PRODUCTS_DIR, dir))
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .map((f) => `/products/${dir}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

export function getMainImage(dir: string): string | undefined {
  return getProductImages(dir)[0];
}

/**
 * The ordered photo gallery for a product, with Hebrew alt text.
 * Uses the product's explicit `gallery` when set (skipping any file that is
 * missing on disk, so a typo can't break the page); otherwise falls back to
 * the photos in its folder. Returns [] when there are no photos at all.
 */
export function getGallery(product: Product): GalleryImage[] {
  if (product.gallery) {
    return product.gallery.filter((img) =>
      fs.existsSync(path.join(process.cwd(), "public", decodeURIComponent(img.src))),
    );
  }
  return getProductImages(product.imageDir).map((src, i) => ({
    src,
    alt: i === 0 ? product.name : `${product.name} – תמונה ${i + 1}`,
  }));
}
