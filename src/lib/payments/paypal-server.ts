// Server-side PayPal check (optional). With PAYPAL_CLIENT_SECRET set, the
// server asks PayPal directly whether an order was really captured for the
// expected amount before marking it paid. Without it, verification is skipped.
import { PAYPAL_CLIENT_ID } from "./paypal";

export type PayPalVerification = "verified" | "mismatch" | "skipped";

const API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

export async function verifyPayPalOrder(paypalOrderId: string, expectedTotal: number): Promise<PayPalVerification> {
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!secret) return "skipped";
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${secret}`).toString("base64");
    const tokenRes = await fetch(`${API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });
    if (!tokenRes.ok) return "skipped";
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const orderRes = await fetch(`${API_BASE}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: "no-store",
    });
    if (!orderRes.ok) return "mismatch";
    const order = (await orderRes.json()) as {
      status?: string;
      purchase_units?: { amount?: { value?: string; currency_code?: string } }[];
    };
    const amount = order.purchase_units?.[0]?.amount;
    const ok =
      order.status === "COMPLETED" &&
      amount?.currency_code === "ILS" &&
      Math.abs(Number(amount.value) - expectedTotal) < 0.01;
    return ok ? "verified" : "mismatch";
  } catch (err) {
    console.error("[paypal-server] verification failed", err);
    return "skipped";
  }
}
