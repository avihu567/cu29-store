// PayPal (JS SDK, client-side Orders v2) — order payload builder.
//
// SECURITY NOTE: with only a client ID, the order is created in the browser,
// so the amount could in theory be altered by a technical user. Every order
// carries the full itemized cart below, so always compare the PayPal amount
// with the items before shipping. For tamper-proof pricing, move order
// creation + capture to the server (needs PAYPAL_CLIENT_SECRET).
import type { CreateOrderRequestBody, PurchaseUnitItem } from "@paypal/paypal-js";
import type { ShippingDetails } from "../checkout";
import { SLEEVE_BUMP_PRICE, SLEEVE_PRICE } from "../offers";
import { lineOptions, type GiftSleeveChoice, type PricedCart } from "../pricing";

/** Public client ID (safe to expose). Env var first, built-in fallback second. */
export const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "BAAvirfFhJP0-93-UIfjNcU41c48KGsNJlvEpIJphw5903HEd2IPr1cxxOo6RO0vHxBL6jgpTcrNaJ9LZk";

const CURRENCY = "ILS";
const money = (v: number) => ({ currency_code: CURRENCY, value: v.toFixed(2) });
/** PayPal limits most text fields to 127 characters. */
const clip = (s: string, max = 127) => (s.length > max ? s.slice(0, max - 1) + "…" : s);

/** Line items, splitting bump sleeves (₪39) from full-price ones (₪59). */
export function paypalItems(cart: PricedCart): PurchaseUnitItem[] {
  const items: PurchaseUnitItem[] = [];
  for (const l of cart.lines) {
    const details = [
      ...lineOptions(l.product, l.line),
      ...(l.freeRing ? [`טבעת סיליקון ${l.freeRing} (מתנה)`] : []),
    ].join(" · ");
    const base = {
      name: clip(l.product.name),
      sku: l.product.slug,
      category: "PHYSICAL_GOODS" as const,
      ...(details && { description: clip(details) }),
    };
    if (l.bumpUnits > 0) {
      items.push({
        ...base,
        description: clip([details, "מחיר מבצע עם בקבוק"].filter(Boolean).join(" · ")),
        unit_amount: money(SLEEVE_BUMP_PRICE),
        quantity: String(l.bumpUnits),
      });
      const rest = l.line.quantity - l.bumpUnits;
      if (rest > 0) items.push({ ...base, unit_amount: money(SLEEVE_PRICE), quantity: String(rest) });
    } else {
      items.push({
        ...base,
        unit_amount: money(l.total / l.line.quantity),
        quantity: String(l.line.quantity),
      });
    }
  }
  return items;
}

/**
 * The full PayPal order. `withShipping: false` drops the shipping address
 * block (fallback if PayPal rejects the address) and puts the address into
 * the description instead, so it is never lost.
 */
export function buildPayPalOrder({
  cart,
  shipping,
  giftSleeve,
  orderRef,
  marketingOptIn,
  withShipping = true,
}: {
  cart: PricedCart;
  shipping: ShippingDetails;
  giftSleeve?: GiftSleeveChoice;
  orderRef: string;
  marketingOptIn: boolean;
  withShipping?: boolean;
}): CreateOrderRequestBody {
  const items = paypalItems(cart);
  const itemTotal = items.reduce((s, i) => s + Number(i.unit_amount.value) * Number(i.quantity), 0);
  // Guard: PayPal rejects orders whose breakdown doesn't add up.
  if (Math.abs(itemTotal - cart.subtotal) > 0.001) {
    throw new Error(`Item total ${itemTotal} does not match subtotal ${cart.subtotal}`);
  }

  const description = clip(
    [
      `CU29 ${orderRef}`,
      `טל׳ ${shipping.phone}`,
      ...(giftSleeve ? [`מתנה: שרוול ${giftSleeve.size} ${giftSleeve.colorName}`] : []),
      ...(!withShipping ? [`כתובת: ${shipping.address}, ${shipping.city}`] : []),
      ...(shipping.notes ? [`הערות: ${shipping.notes}`] : []),
      `דיוור: ${marketingOptIn ? "כן" : "לא"}`,
    ].join(" · "),
  );

  return {
    intent: "CAPTURE",
    payer: {
      name: { given_name: clip(shipping.firstName, 140), surname: clip(shipping.lastName, 140) },
      email_address: shipping.email,
    },
    purchase_units: [
      {
        reference_id: orderRef,
        invoice_id: orderRef,
        custom_id: orderRef,
        description,
        soft_descriptor: "CU29",
        amount: {
          ...money(cart.total),
          breakdown: {
            item_total: money(cart.subtotal),
            shipping: money(cart.shipping),
          },
        },
        items,
        ...(withShipping && {
          shipping: {
            type: "SHIPPING" as const,
            name: { full_name: clip(`${shipping.firstName} ${shipping.lastName}`, 300) },
            address: {
              address_line_1: clip(shipping.address, 300),
              admin_area_2: clip(shipping.city, 120),
              country_code: "IL",
            },
          },
        }),
      },
    ],
    application_context: {
      brand_name: "CU29",
      locale: "he-IL",
      shipping_preference: withShipping ? "SET_PROVIDED_ADDRESS" : "NO_SHIPPING",
      user_action: "PAY_NOW",
    },
  };
}
