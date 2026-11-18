// POST /api/payments/hyp — starts a HYP credit-card payment.
// Prices are recalculated here from the product catalog (never trusted from
// the browser), then HYP signs the request and we return the secure payment
// page URL for the client to redirect to.
//
// Until HYP_MASOF / HYP_API_KEY / HYP_PASS_P are set, this answers 503 and the
// checkout shows the "coming soon" notice with PayPal / WhatsApp instead.
import type { CartLine } from "@/lib/cart";
import { cleanShipping, newOrderRef, validateShipping, type ShippingDetails } from "@/lib/checkout";
import { createHypPaymentUrl, getHypConfig } from "@/lib/payments/hyp";
import { priceCart } from "@/lib/pricing";

interface HypCheckoutBody {
  lines?: CartLine[];
  shipping?: ShippingDetails;
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  const cfg = getHypConfig();
  if (!cfg) return json({ error: "not_configured" }, 503);

  let body: HypCheckoutBody;
  try {
    body = (await request.json()) as HypCheckoutBody;
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const lines = Array.isArray(body.lines)
    ? body.lines
        .filter((l) => typeof l?.slug === "string" && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 20)
        .map((l) => ({ slug: l.slug, quantity: l.quantity, color: l.color, size: l.size, offer: l.offer }))
    : [];
  const cart = priceCart(lines);
  if (cart.lines.length === 0) return json({ error: "empty_cart" }, 400);

  if (!body.shipping || Object.keys(validateShipping(body.shipping)).length > 0) {
    return json({ error: "invalid_shipping" }, 400);
  }
  const shipping = cleanShipping(body.shipping);
  const orderRef = newOrderRef();

  try {
    const url = await createHypPaymentUrl(cfg, {
      amount: cart.total,
      orderRef,
      info: `CU29 ${orderRef}`,
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      email: shipping.email,
      phone: shipping.phone.replace(/\D/g, ""),
      city: shipping.city,
      street: shipping.address,
    });
    return json({ url, orderRef, total: cart.total });
  } catch (err) {
    console.error("[hyp]", err);
    return json({ error: "hyp_failed" }, 502);
  }
}
