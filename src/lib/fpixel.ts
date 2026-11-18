// Meta Pixel helpers. Client-side only: every call is a no-op on the server
// or before the pixel script has loaded (e.g. blocked by an ad blocker).

/** Pixel ID from the env, with a fallback so production works before the env var is set. */
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "29040538945575201";

const CURRENCY = "ILS";

type FbqFn = (command: "init" | "track" | "trackCustom", ...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

/** One item in a Meta `contents` array. */
export interface PixelContent {
  /** Product id — we use the product slug (same as the schema.org sku). */
  id: string;
  quantity: number;
  /** Price per unit in ILS, after offers. */
  item_price?: number;
}

type StandardEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Contact";

function track(event: StandardEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", event, params);
  else window.fbq("track", event);
}

/** PageView — fired by the base script on load and by PixelRouteTracker on navigation. */
export function pageView() {
  track("PageView");
}

/** ViewContent — a product page was opened (or a different size was selected). */
export function viewContent(product: { id: string; name: string; value?: number }) {
  track("ViewContent", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    ...(product.value !== undefined && { value: product.value, currency: CURRENCY }),
  });
}

/** AddToCart — `value` is the exact total of what was added (ILS). */
export function addToCart({
  contents,
  value,
  name,
}: {
  contents: PixelContent[];
  value: number;
  name?: string;
}) {
  track("AddToCart", {
    ...(name && { content_name: name }),
    content_ids: contents.map((c) => c.id),
    content_type: "product",
    contents,
    value,
    currency: CURRENCY,
  });
}

/** InitiateCheckout — the user starts an order (cart WhatsApp order button). */
export function initiateCheckout({ contents, value }: { contents: PixelContent[]; value: number }) {
  track("InitiateCheckout", {
    content_ids: contents.map((c) => c.id),
    content_type: "product",
    contents,
    num_items: contents.reduce((n, c) => n + c.quantity, 0),
    value,
    currency: CURRENCY,
  });
}

/** Contact — the user opens a WhatsApp conversation. `value` = cart total when there is one. */
export function contact(value?: number) {
  track("Contact", value !== undefined && value > 0 ? { value, currency: CURRENCY } : undefined);
}
