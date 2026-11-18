// Orders, inventory and waitlist: shared types, labels and builders.
// Client-safe (no secrets) — used by the API routes and the admin dashboard.
import type { CartLine } from "./cart";
import { SLEEVE_SLUG } from "./offers";
import { isBottle, lineOptions, type PricedCart, type ResolvedGiftSleeve } from "./pricing";

export type OrderStatus = "pending_payment" | "paid" | "payment_review" | "shipped" | "delivered" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "payment_review",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "ממתין לתשלום / נטישה",
  paid: "שולם - מוכן למשלוח",
  payment_review: "שולם - לבדיקת סכום",
  shipped: "נשלח",
  delivered: "נמסר",
  cancelled: "בוטל",
};

/** One cart line as stored on the order (a snapshot — prices never change later). */
export interface OrderItem {
  slug: string;
  name: string;
  quantity: number;
  /** e.g. ["מידה: 700 מ״ל", "צבע: ורוד"] */
  options: string[];
  /** Free silicone ring color (bottles). */
  freeRing?: string;
  unitPrice: number;
  total: number;
  regularTotal: number;
}

export interface OrderGiftSleeve {
  size: string;
  colorName: string;
  colorId: string;
}

export interface StockItem {
  sku: string;
  quantity: number;
}

export interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string | null;
  items: OrderItem[];
  gift_sleeve: OrderGiftSleeve | null;
  stock_items: StockItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  marketing_opt_in: boolean;
  payment_method: string | null;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

/** Columns the admin dashboard reads (never the buyer's access token). */
export const ORDER_ADMIN_COLUMNS =
  "id, order_number, status, first_name, last_name, phone, email, city, address, notes, items, gift_sleeve, stock_items, subtotal, shipping, total, currency, marketing_opt_in, payment_method, paypal_order_id, paypal_capture_id, created_at, updated_at, paid_at, shipped_at, delivered_at";

export interface InventoryRow {
  sku: string;
  product_slug: string;
  name: string;
  variant: string | null;
  stock_count: number;
  sort_order: number;
  updated_at: string;
}

export interface WaitlistRow {
  id: string;
  product_slug: string;
  product_name: string;
  contact: string;
  contact_type: "email" | "phone";
  created_at: string;
}

/** Inventory SKU for a sleeve variant, e.g. ("700 מ״ל", "pink") → "sleeve-700-pink". */
export function sleeveSku(size: string | undefined, color: string | undefined): string {
  return `sleeve-${size?.match(/\d+/)?.[0] ?? "x"}-${color ?? "x"}`;
}

export function orderItems(cart: PricedCart): OrderItem[] {
  return cart.lines.map((l) => ({
    slug: l.product.slug,
    name: l.product.name,
    quantity: l.line.quantity,
    options: lineOptions(l.product, l.line),
    ...(l.freeRing && { freeRing: l.freeRing }),
    unitPrice: Math.round((l.total / l.line.quantity) * 100) / 100,
    total: l.total,
    regularTotal: l.regularTotal,
  }));
}

/** What leaves the shelf when the order is paid: bottles, sleeves and the gift sleeve. */
export function stockItems(cart: PricedCart, gift?: ResolvedGiftSleeve): StockItem[] {
  const out: StockItem[] = [];
  for (const l of cart.lines) {
    if (isBottle(l.product)) out.push({ sku: l.product.slug, quantity: l.line.quantity });
    else if (l.product.slug === SLEEVE_SLUG) out.push({ sku: sleeveSku(l.line.size, l.line.color), quantity: l.line.quantity });
  }
  if (gift?.active) out.push({ sku: sleeveSku(gift.size, gift.colorId), quantity: 1 });
  return out;
}

/** Keep only well-formed cart lines from an untrusted request body. */
export function sanitizeLines(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (l): l is CartLine =>
        typeof l?.slug === "string" && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 20,
    )
    .slice(0, 30)
    .map((l) => ({
      slug: l.slug,
      quantity: l.quantity,
      ...(typeof l.color === "string" && { color: l.color }),
      ...(typeof l.size === "string" && { size: l.size }),
      ...(l.offer === "bump" && { offer: "bump" as const }),
    }));
}

/** Israeli number → wa.me format: 050-1234567 → 972501234567. */
export function waPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("972")) return d;
  return d.startsWith("0") ? `972${d.slice(1)}` : d;
}
