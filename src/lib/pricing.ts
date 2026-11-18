// Cart pricing & order text — shared by the product page and the cart so they
// always agree. Client-safe (no node APIs).
import type { CartLine } from "./cart";
import {
  FREE_RING_VALUE,
  GIFT_SLEEVE_THRESHOLD,
  SLEEVE_BUMP_PRICE,
  SLEEVE_PRICE,
  SLEEVE_SLUG,
} from "./offers";
import { RING_COLORS, formatPrice, getProduct, isPurchasable, type Product, type RingColorId } from "./products";
import { remainingForFreeShipping, shippingFor } from "./shipping";
import type { PixelContent } from "./fpixel";

/** Bottles are the products that come with a free silicone ring. */
export const isBottle = (p: Product) => Boolean(p.ringColors);

export interface PricedLine {
  line: CartLine;
  product: Product & { price: number };
  /** Total for this line after offers. */
  total: number;
  /** Total at regular prices (for strikethrough). */
  regularTotal: number;
  /** Units priced at the bump price. */
  bumpUnits: number;
  /** Free ring color name (bottles only). */
  freeRing?: string;
}

export interface PricedCart {
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  total: number;
  /** ₪ missing for free shipping (0 once reached). */
  toFreeShipping: number;
  /** ₪ missing for the gift sleeve (0 once reached). */
  toGiftSleeve: number;
  giftSleeveUnlocked: boolean;
  bottleCount: number;
}

export function priceCart(cartLines: CartLine[]): PricedCart {
  const resolved = cartLines.flatMap((line) => {
    const product = getProduct(line.slug);
    return product && isPurchasable(product) ? [{ line, product }] : [];
  });

  const bottleCount = resolved
    .filter(({ product }) => isBottle(product))
    .reduce((n, { line }) => n + line.quantity, 0);

  // Each bottle in the cart unlocks one sleeve at the bump price.
  let bumpAllowance = bottleCount;

  const lines: PricedLine[] = resolved.map(({ line, product }) => {
    const regularTotal = product.price * line.quantity;
    let total = regularTotal;
    let bumpUnits = 0;

    if (product.slug === SLEEVE_SLUG && line.offer === "bump") {
      bumpUnits = Math.min(line.quantity, bumpAllowance);
      bumpAllowance -= bumpUnits;
      total = bumpUnits * SLEEVE_BUMP_PRICE + (line.quantity - bumpUnits) * SLEEVE_PRICE;
    }

    const freeRing =
      isBottle(product) && line.color && line.color in RING_COLORS
        ? RING_COLORS[line.color as RingColorId].name
        : undefined;

    return { line, product, total, regularTotal, bumpUnits, freeRing };
  });

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const shipping = shippingFor(subtotal);

  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    toFreeShipping: remainingForFreeShipping(subtotal),
    toGiftSleeve: Math.max(0, GIFT_SLEEVE_THRESHOLD - subtotal),
    giftSleeveUnlocked: subtotal >= GIFT_SLEEVE_THRESHOLD,
    bottleCount,
  };
}

/** Meta Pixel `contents` for a priced cart (per-unit price after offers). */
export function pixelContents(cart: PricedCart): PixelContent[] {
  return cart.lines.map((l) => ({
    id: l.product.slug,
    quantity: l.line.quantity,
    item_price: Math.round((l.total / l.line.quantity) * 100) / 100,
  }));
}

/** Option text for a line, e.g. ["מידה: 700 מ״ל", "צבע: אפור"]. */
export function lineOptions(product: Product, line: CartLine): string[] {
  const size = line.size ?? (isBottle(product) ? product.size : undefined);
  const colorName =
    !isBottle(product) && line.color
      ? product.colorOptions?.find((c) => c.id === line.color)?.name
      : undefined;
  return [size && `מידה: ${size}`, colorName && `צבע: ${colorName}`].filter(Boolean) as string[];
}

export interface GiftSleeveChoice {
  size: string;
  colorName: string;
}

/** WhatsApp order text for a priced cart. */
export function buildOrderMessage(
  cart: PricedCart,
  { giftSleeve, footer = [] }: { giftSleeve?: GiftSleeveChoice; footer?: string[] } = {},
): string {
  const rows: string[] = ["שלום CU29, אשמח להזמין:"];

  for (const l of cart.lines) {
    const priceNote = l.bumpUnits > 0 ? ` (מחיר מבצע, במקום ${formatPrice(l.regularTotal)})` : "";
    rows.push(
      [
        `• ${l.product.name}`,
        ...lineOptions(l.product, l.line),
        `כמות: ${l.line.quantity}`,
        `${formatPrice(l.total)}${priceNote}`,
      ].join(" | "),
    );
    if (l.freeRing) {
      rows.push(
        `   + טבעת נשיאה מסיליקון · ${l.freeRing} × ${l.line.quantity} – מתנה (שווי ${formatPrice(FREE_RING_VALUE)} ליחידה)`,
      );
    }
  }

  if (cart.giftSleeveUnlocked && giftSleeve) {
    rows.push(
      `• 🎁 שרוול קירור ממותג CU29 במתנה | מידה: ${giftSleeve.size} | צבע: ${giftSleeve.colorName} | חינם`,
    );
  }

  rows.push(`משלוח: ${cart.shipping === 0 ? "חינם" : formatPrice(cart.shipping)}`);
  rows.push(`סה״כ: ${formatPrice(cart.total)}`);
  return [...rows, ...footer].join("\n");
}
