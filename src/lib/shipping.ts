// Single source of truth for shipping rules (matches section 3 of the terms).

/** Flat shipping fee per order, in ₪. */
export const SHIPPING_FEE = 30;

/** Orders at or above this subtotal (₪) ship free. */
export const FREE_SHIPPING_THRESHOLD = 250;

/** Maximum delivery time, in business days. */
export const DELIVERY_BUSINESS_DAYS = 7;
/** Delivery window shown to customers (matches the terms). */
export const DELIVERY_TIME = "3–7 ימי עסקים";

/** Exchange window, in business days from delivery. */
export const EXCHANGE_BUSINESS_DAYS = 14;

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/** ₪ still missing for free shipping (0 once the threshold is reached). */
export function remainingForFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}
