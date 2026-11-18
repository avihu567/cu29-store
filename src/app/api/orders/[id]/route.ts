// PATCH /api/orders/[id] — the buyer's browser updates its own order.
// Requires the order's access token (returned by POST /api/orders).
//   { action: "update", token, lines, shipping, giftPick }  → edit details (only while unpaid)
//   { action: "paid", token, paypalOrderId, paypalCaptureId, marketingOptIn }
//       → status 'paid' + stock taken (atomic, once). With PAYPAL_CLIENT_SECRET
//         set, PayPal is asked first; a wrong amount becomes 'payment_review'.
import { createHash, timingSafeEqual } from "node:crypto";
import { after } from "next/server";
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation";
import type { OrderRow } from "@/lib/orders";
import { verifyPayPalOrder } from "@/lib/payments/paypal-server";
import { DB_NOT_CONFIGURED, getSupabaseAdmin, serverError } from "@/lib/supabase-admin";
import { buildOrderFields, type OrderDraftBody } from "@/lib/order-draft";

interface PatchBody extends OrderDraftBody {
  action?: "update" | "paid";
  token?: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  marketingOptIn?: boolean;
}

const UUID = /^[0-9a-f-]{36}$/i;
const sameToken = (a: string, b: string) =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

async function handlePATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "not_found" }, { status: 404 });

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const { data: order } = await db.from("orders").select("id, status, total, access_token").eq("id", id).maybeSingle();
  if (!order || typeof body.token !== "string" || !sameToken(body.token, order.access_token)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  if (body.action === "update") {
    if (order.status !== "pending_payment") return Response.json({ error: "already_paid" }, { status: 409 });
    const built = buildOrderFields(body);
    if ("error" in built) return Response.json({ error: built.error }, { status: 400 });
    const { data, error } = await db
      .from("orders")
      .update({ ...built.fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "pending_payment")
      .select("id, order_number, total")
      .single();
    if (error || !data) return Response.json({ error: "db_error" }, { status: 500 });
    return Response.json({ id: data.id, orderNumber: data.order_number, total: data.total });
  }

  if (body.action === "paid") {
    const paypalOrderId = typeof body.paypalOrderId === "string" ? body.paypalOrderId.slice(0, 64) : "";
    if (!paypalOrderId) return Response.json({ error: "missing_paypal_order" }, { status: 400 });

    const check = await verifyPayPalOrder(paypalOrderId, Number(order.total));
    const { data, error } = await db.rpc("mark_order_paid", {
      p_order_id: id,
      p_status: check === "mismatch" ? "payment_review" : "paid",
      p_paypal_order_id: paypalOrderId,
      p_paypal_capture_id: typeof body.paypalCaptureId === "string" ? body.paypalCaptureId.slice(0, 64) : null,
      p_marketing_opt_in: typeof body.marketingOptIn === "boolean" ? body.marketingOptIn : null,
    });
    if (error) {
      console.error("[orders] mark paid failed", error);
      return Response.json({ error: "db_error" }, { status: 500 });
    }
    const row = (Array.isArray(data) ? data[0] : data) as OrderRow | undefined;
    // Emails only on the first transition to paid (not on browser retries).
    // after(): sent once the response is out, so checkout never waits on email.
    if (row && order.status === "pending_payment" && (row.status === "paid" || row.status === "payment_review")) {
      after(() => sendOrderConfirmation(row).then((r) => console.log("[email]", row.order_number, r)));
    }
    return Response.json({ status: row?.status, orderNumber: row?.order_number, verification: check });
  }

  return Response.json({ error: "bad_action" }, { status: 400 });
}

export async function PATCH(...args: Parameters<typeof handlePATCH>): Promise<Response> {
  try {
    return await handlePATCH(...args);
  } catch (err) {
    return serverError("orders/[id]", err);
  }
}
