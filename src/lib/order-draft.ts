// Builds the database fields for an order from an untrusted request body.
// Prices are always recalculated from the catalog (server-side).
import type { GiftSleevePick } from "./cart";
import { cleanShipping, validateShipping, type ShippingDetails } from "./checkout";
import { orderItems, sanitizeLines, stockItems } from "./orders";
import { priceCart, resolveGiftSleeve } from "./pricing";

export interface OrderDraftBody {
  lines?: unknown;
  shipping?: ShippingDetails;
  giftPick?: GiftSleevePick;
}

export function buildOrderFields(body: OrderDraftBody) {
  const cart = priceCart(sanitizeLines(body.lines));
  if (cart.lines.length === 0) return { error: "empty_cart" } as const;
  if (!body.shipping || Object.keys(validateShipping(body.shipping)).length > 0) {
    return { error: "invalid_shipping" } as const;
  }
  const s = cleanShipping(body.shipping);
  const pick = body.giftPick && typeof body.giftPick === "object" ? body.giftPick : {};
  const gift = resolveGiftSleeve(cart, {
    size: typeof pick.size === "string" ? pick.size : undefined,
    color: typeof pick.color === "string" ? pick.color : undefined,
  });
  return {
    fields: {
      first_name: s.firstName,
      last_name: s.lastName,
      phone: s.phone,
      email: s.email,
      city: s.city,
      address: s.address,
      notes: s.notes ?? null,
      items: orderItems(cart),
      gift_sleeve: gift?.active ? { size: gift.size, colorName: gift.colorName, colorId: gift.colorId } : null,
      stock_items: stockItems(cart, gift),
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
    },
  } as const;
}
