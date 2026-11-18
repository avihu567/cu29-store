// POST /api/orders — checkout step 1: save the order as 'pending_payment'
// (also serves as the abandoned-cart lead). Prices are recalculated on the
// server from the catalog; nothing price-related is trusted from the browser.
import { buildOrderFields, type OrderDraftBody } from "@/lib/order-draft";
import { DB_NOT_CONFIGURED, getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  let body: OrderDraftBody;
  try {
    body = (await request.json()) as OrderDraftBody;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const built = buildOrderFields(body);
  if ("error" in built) return Response.json({ error: built.error }, { status: 400 });

  const { data, error } = await db
    .from("orders")
    .insert({ ...built.fields, status: "pending_payment" })
    .select("id, order_number, access_token, total")
    .single();

  if (error || !data) {
    console.error("[orders] insert failed", error);
    return Response.json({ error: "db_error" }, { status: 500 });
  }
  return Response.json({ id: data.id, orderNumber: data.order_number, token: data.access_token, total: data.total });
}
