// POST /api/cancel-order — the online cancellation form (חוק הגנת הצרכן).
// Records the request (Supabase, if available), emails the store owner and
// sends the customer a receipt with a reference number.
import { isIsraeliMobile, formatPhone } from "@/lib/checkout";
import { sendCancellationEmails } from "@/lib/email/send-cancellation";
import type { CancellationRequest } from "@/lib/email/templates";
import { getSupabaseAdmin, serverError } from "@/lib/supabase-admin";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function newReference(): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `BT-${ymd}-${rand}`;
}

async function handlePOST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (str(body.website, 200)) return Response.json({ reference: newReference() });

  const fullName = str(body.fullName, 120);
  const phone = str(body.phone, 30);
  const email = str(body.email, 160);
  const orderNumber = str(body.orderNumber, 60);
  const reason = str(body.reason, 1000);

  const errors: Record<string, string> = {};
  if (fullName.length < 2) errors.fullName = "נא להזין שם מלא";
  if (!isIsraeliMobile(phone)) errors.phone = "נא להזין מספר נייד תקין";
  if (!EMAIL.test(email)) errors.email = "נא להזין כתובת אימייל תקינה";
  if (orderNumber.length < 3) errors.orderNumber = "נא להזין מספר הזמנה";
  if (Object.keys(errors).length) return Response.json({ error: "פרטים חסרים", fields: errors }, { status: 400 });

  const req: CancellationRequest = {
    reference: newReference(),
    fullName,
    phone: formatPhone(phone),
    email,
    orderNumber,
    reason: reason || undefined,
    createdAt: new Intl.DateTimeFormat("he-IL", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Jerusalem",
    }).format(new Date()),
  };

  // Record it and look up the order (both best-effort).
  let stored = false;
  let orderInfo: string | undefined;
  const db = getSupabaseAdmin();
  if (db) {
    const { error } = await db.from("cancellation_requests").insert({
      reference: req.reference,
      full_name: req.fullName,
      phone: req.phone,
      email: req.email,
      order_number: req.orderNumber,
      reason: req.reason ?? null,
    });
    if (error) console.error("[cancel-order] store failed", error.message);
    else stored = true;

    const { data: order } = await db
      .from("orders")
      .select("order_number, status, total, email, created_at")
      .ilike("order_number", req.orderNumber)
      .maybeSingle();
    if (order) {
      const sameEmail = String(order.email).toLowerCase() === req.email.toLowerCase();
      orderInfo = `הזמנה ${order.order_number} נמצאה במערכת: סטטוס ${order.status}, סה״כ ₪${order.total}${sameEmail ? "" : " · שימו לב: האימייל בבקשה שונה מהאימייל בהזמנה"}.`;
    } else {
      orderInfo = "מספר ההזמנה לא נמצא במערכת (ייתכן שההזמנה בוצעה בוואטסאפ) – יש לבדוק ידנית.";
    }
  }

  const sent = await sendCancellationEmails(req, orderInfo);
  if (!stored && !sent.admin) {
    // Nothing reached the business — tell the customer to use another channel.
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }
  return Response.json({ reference: req.reference, emailed: sent.customer });
}

export async function POST(request: Request): Promise<Response> {
  try {
    return await handlePOST(request);
  } catch (err) {
    return serverError("cancel-order", err);
  }
}
