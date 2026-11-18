// GET /api/admin/inventory → all SKUs
// PATCH /api/admin/inventory { sku, stockCount } → set a stock count (admin only)
import type { NextRequest } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { DB_NOT_CONFIGURED, getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  const { data, error } = await db.from("inventory").select("*").order("sort_order").order("sku");
  if (error) return Response.json({ error: "db_error" }, { status: 500 });
  return Response.json({ inventory: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  let body: { sku?: unknown; stockCount?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const { sku, stockCount } = body;
  if (typeof sku !== "string" || !Number.isInteger(stockCount) || (stockCount as number) < -9999 || (stockCount as number) > 99999) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const { data, error } = await db
    .from("inventory")
    .update({ stock_count: stockCount, updated_at: new Date().toISOString() })
    .eq("sku", sku)
    .select("*")
    .single();
  if (error || !data) return Response.json({ error: "db_error" }, { status: 500 });
  return Response.json({ item: data });
}
