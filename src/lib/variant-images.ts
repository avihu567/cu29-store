// Studio photos per variant (public/images/products). Client-safe: the list of
// files is explicit, so pages never point at a photo that doesn't exist.
//
// Photo colors → site options:
//   ring  "black" → פחם (charcoal),   "pink" → ורוד עתיק (terracotta)
//   sleeve "black" (dark charcoal) → אפור (gray),   "pink" → ורוד (pink)
// The 700 and 950 ml bottles share one set of photos.
import type { CartLine } from "./cart";
import type { GalleryImage, Product } from "./products";

const DIR = "/images/products";
const src = (file: string) => `${DIR}/${file}`;

/** Files that exist in public/images/products (bottle-700-950-ring-pink.jpg was not supplied). */
const AVAILABLE = new Set([
  "bottle-500-ring-black.jpg",
  "bottle-500-ring-black-box.jpg",
  "bottle-500-ring-pink.jpg",
  "bottle-500-ring-pink-box.jpg",
  "bottle-700-950-ring-black.jpg",
  "bottle-700-950-ring-black-box.jpg",
  "bottle-700-950-ring-pink-box.jpg",
  "ring-black-top.jpg",
  "ring-black-side.jpg",
  "ring-pink-top.jpg",
  "ring-pink-side.jpg",
  "rings-pair.jpg",
  "sleeve-black-500-front.jpg",
  "sleeve-black-500-side.jpg",
  "sleeve-pink-500-front.jpg",
  "sleeve-pink-500-side.jpg",
  "sleeve-black-700-950-front.jpg",
  "sleeve-black-700-950-side.jpg",
  "sleeve-pink-700-950-front.jpg",
  "sleeve-pink-700-950-side.jpg",
]);

type SizeKey = "500" | "700-950";
const sizeKey = (size: string | undefined): SizeKey => (size?.includes("500") ? "500" : "700-950");
const ringFile = (ringColor: string | undefined) => (ringColor === "terracotta" ? "pink" : "black");
const sleeveFile = (sleeveColor: string | undefined) => (sleeveColor === "gray" ? "black" : "pink");

const RING_NAME: Record<string, string> = { black: "פחם", pink: "ורוד עתיק" };
const SLEEVE_NAME: Record<string, string> = { black: "אפור כהה", pink: "ורוד" };
const ML: Record<SizeKey, string> = { "500": `500 מ"ל`, "700-950": `700/950 מ"ל` };

function pick(items: [string, string][]): GalleryImage[] {
  return items.filter(([file]) => AVAILABLE.has(file)).map(([file, alt]) => ({ src: src(file), alt }));
}

/** Bottle in the chosen size + ring color: studio shot, then with its gift box. */
export function bottleVariantImages(size: string | undefined, ringColor: string | undefined): GalleryImage[] {
  const s = sizeKey(size);
  const r = ringFile(ringColor);
  return pick([
    [`bottle-${s}-ring-${r}.jpg`, `בקבוק נחושת CU29 ${ML[s]} עם טבעת נשיאה מסיליקון בצבע ${RING_NAME[r]}`],
    [`bottle-${s}-ring-${r}-box.jpg`, `בקבוק נחושת CU29 ${ML[s]} עם טבעת ${RING_NAME[r]}, לצד אריזת המתנה THE CU RITUAL`],
  ]);
}

/** Cooling sleeve in the chosen size + color: front, then side. */
export function sleeveImages(size: string | undefined, sleeveColor: string | undefined): GalleryImage[] {
  const s = sizeKey(size);
  const c = sleeveFile(sleeveColor);
  return pick([
    [`sleeve-${c}-${s}-front.jpg`, `שרוול קירור ממותג CU29 בצבע ${SLEEVE_NAME[c]} על בקבוק ${ML[s]}`],
    [`sleeve-${c}-${s}-side.jpg`, `שרוול קירור CU29 בצבע ${SLEEVE_NAME[c]} על בקבוק ${ML[s]}, מבט מהצד`],
  ]);
}

export const RINGS_PAIR: GalleryImage = {
  src: src("rings-pair.jpg"),
  alt: "שתי טבעות נשיאה מסיליקון של CU29: פחם וורוד עתיק",
};

/** Carry ring in one color (top + side); without a color, the pair first. */
export function ringImages(ringColor?: string): GalleryImage[] {
  const r = ringFile(ringColor);
  const own = pick([
    [`ring-${r}-top.jpg`, `טבעת נשיאה מסיליקון בצבע ${RING_NAME[r]}, מבט מלמעלה`],
    [`ring-${r}-side.jpg`, `טבעת נשיאה מסיליקון בצבע ${RING_NAME[r]}, מבט מהצד`],
  ]);
  return ringColor ? [...own, RINGS_PAIR] : [RINGS_PAIR, ...own];
}

/** The photo that best shows one cart line (exact size / ring / sleeve color). */
export function lineImage(product: Product, line: CartLine): string | undefined {
  if (product.ringColors) return bottleVariantImages(product.size, line.color)[0]?.src;
  if (product.slug === "cu29-cooling-sleeve") return sleeveImages(line.size, line.color)[0]?.src;
  if (product.slug === "silicone-carry-ring") return ringImages(line.color)[0]?.src;
  return undefined;
}

// ───────────── lifestyle / brand photography ─────────────

export const LIFESTYLE = {
  family5: { src: src("lifestyle-family-5.jpg"), alt: "משפחת בקבוקי הנחושת CU29 בשלושה גדלים, עם שרוול קירור, טבעות נשיאה ואריזת המתנה" },
  family1: { src: src("lifestyle-family-1.jpg"), alt: "בקבוקי נחושת CU29 בגדלים שונים, זה לצד זה" },
  family2: { src: src("lifestyle-family-2.jpg"), alt: "קולקציית בקבוקי הנחושת של CU29" },
  family3: { src: src("lifestyle-family-3.jpg"), alt: "בקבוקי נחושת CU29 עם שרוולי קירור באפור כהה ובוורוד וטבעות נשיאה בצבעי פחם וורוד עתיק" },
  bottleBox: { src: src("lifestyle-bottle-box.jpg"), alt: "בקבוק נחושת CU29 עם טבעת פחם לצד אריזת THE CU RITUAL" },
  bottleRings: { src: src("lifestyle-bottle-rings.jpg"), alt: "בקבוק נחושת CU29 מונח על טבעות נשיאה מסיליקון בצבעי פחם וורוד עתיק" },
  closeup: { src: src("closeup-copper-logo.jpg"), alt: "תקריב של לוגו CU29 על שרוול קירור ורוד ומכסה הנחושת" },
} satisfies Record<string, GalleryImage>;
