// GET /api/admin/orders?status=paid → latest orders (admin only)
import type { NextRequest } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { ORDER_ADMIN_COLUMNS, ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import { DB_NOT_CONFIGURED, getSupabaseAdmin, serverError } from "@/lib/supabase-admin";

async function handleGET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  const status = request.nextUrl.searchParams.get("status");
  let query = db.from("orders").select(ORDER_ADMIN_COLUMNS).order("created_at", { ascending: false }).limit(500);
  if (status && ORDER_STATUSES.includes(status as OrderStatus)) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("[admin/orders]", error);
    return Response.json({ error: "db_error" }, { status: 500 });
  }
  return Response.json({ orders: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(...args: Parameters<typeof handleGET>): Promise<Response> {
  try {
    return await handleGET(...args);
  } catch (err) {
    return serverError("admin/orders", err);
  }
}
