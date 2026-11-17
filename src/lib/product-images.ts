// Server-only module (uses node:fs) — import from Server Components only.
import fs from "node:fs";
import path from "node:path";

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
