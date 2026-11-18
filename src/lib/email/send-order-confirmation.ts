// Order emails via Resend: a confirmation to the customer and an alert to
// the store owner. Server-only. Never throws — a failed email (missing key,
// unverified sending domain, Resend outage…) is logged and the order flow
// carries on untouched.
import { Resend } from "resend";
import { SUPPORT_EMAIL } from "../business";
import { cleanEnv } from "../env";
import type { OrderRow } from "../orders";
import { adminEmail, customerEmail } from "./templates";

/** Resend's shared test sender — works without a verified domain, but only
 *  delivers to the Resend account owner's own address. */
const FALLBACK_FROM = "CU29 <onboarding@resend.dev>";

function sender(): string {
  const from = cleanEnv(process.env.RESEND_FROM_EMAIL);
  if (!from) return FALLBACK_FROM;
  return from.includes("<") ? from : `CU29 <${from}>`;
}

export interface EmailResult {
  customer: "sent" | "skipped" | "failed";
  admin: "sent" | "skipped" | "failed";
}

export async function sendOrderConfirmation(order: OrderRow): Promise<EmailResult> {
  const result: EmailResult = { customer: "skipped", admin: "skipped" };
  const key = cleanEnv(process.env.RESEND_API_KEY);
  if (!key || key.startsWith("PASTE_")) {
    console.warn("[email] RESEND_API_KEY not set — order emails skipped for", order.order_number);
    return result;
  }

  try {
    const resend = new Resend(key);
    const from = sender();
    const adminTo = cleanEnv(process.env.ADMIN_EMAIL);

    const customer = customerEmail(order);
    const admin = adminEmail(order);

    const [c, a] = await Promise.allSettled([
      resend.emails.send({
        from,
        to: order.email,
        // Customers reply to the public support address, never the private admin inbox.
        replyTo: SUPPORT_EMAIL,
        subject: customer.subject,
        html: customer.html,
        text: customer.text,
      }),
      adminTo && !adminTo.startsWith("PASTE_")
        ? resend.emails.send({
            from,
            to: adminTo,
            replyTo: order.email,
            subject: admin.subject,
            html: admin.html,
            text: admin.text,
          })
        : Promise.resolve(null),
    ]);

    const outcome = (r: PromiseSettledResult<unknown>, who: string): "sent" | "skipped" | "failed" => {
      if (r.status === "rejected") {
        console.error(`[email] ${who} email threw for ${order.order_number}:`, r.reason);
        return "failed";
      }
      const v = r.value as { error?: { message?: string } | null } | null;
      if (v === null) return "skipped";
      if (v.error) {
        console.error(`[email] ${who} email rejected for ${order.order_number}:`, v.error.message ?? v.error);
        return "failed";
      }
      return "sent";
    };
    result.customer = outcome(c, "customer");
    result.admin = outcome(a, "admin");
  } catch (err) {
    console.error("[email] order emails failed for", order.order_number, err);
  }
  return result;
}
