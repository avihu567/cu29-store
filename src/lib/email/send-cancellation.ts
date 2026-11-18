// Cancellation-request emails: an alert to the store owner (ADMIN_EMAIL) and
// a receipt to the customer. Server-only; never throws.
import { Resend } from "resend";
import { SUPPORT_EMAIL } from "../business";
import { cleanEnv } from "../env";
import { cancellationAdminEmail, cancellationCustomerEmail, type CancellationRequest } from "./templates";

const FALLBACK_FROM = "CU29 <onboarding@resend.dev>";

export async function sendCancellationEmails(
  req: CancellationRequest,
  orderInfo?: string,
): Promise<{ admin: boolean; customer: boolean }> {
  const out = { admin: false, customer: false };
  const key = cleanEnv(process.env.RESEND_API_KEY);
  if (!key || key.startsWith("PASTE_")) {
    console.warn("[cancel-order] RESEND_API_KEY not set — emails skipped", req.reference);
    return out;
  }
  try {
    const resend = new Resend(key);
    const fromEnv = cleanEnv(process.env.RESEND_FROM_EMAIL);
    const from = fromEnv ? (fromEnv.includes("<") ? fromEnv : `CU29 <${fromEnv}>`) : FALLBACK_FROM;
    const adminTo = cleanEnv(process.env.ADMIN_EMAIL);
    const a = cancellationAdminEmail(req, orderInfo);
    const c = cancellationCustomerEmail(req);
    const [ra, rc] = await Promise.allSettled([
      adminTo && !adminTo.startsWith("PASTE_")
        ? resend.emails.send({ from, to: adminTo, replyTo: req.email, subject: a.subject, html: a.html, text: a.text })
        : Promise.resolve(null),
      resend.emails.send({ from, to: req.email, replyTo: SUPPORT_EMAIL, subject: c.subject, html: c.html, text: c.text }),
    ]);
    const ok = (r: PromiseSettledResult<unknown>, who: string) => {
      if (r.status === "rejected") {
        console.error(`[cancel-order] ${who} email threw`, r.reason);
        return false;
      }
      const v = r.value as { error?: { message?: string } | null } | null;
      if (!v) return false;
      if (v.error) {
        console.error(`[cancel-order] ${who} email rejected:`, v.error.message ?? v.error);
        return false;
      }
      return true;
    };
    out.admin = ok(ra, "admin");
    out.customer = ok(rc, "customer");
  } catch (err) {
    console.error("[cancel-order] emails failed", err);
  }
  return out;
}
