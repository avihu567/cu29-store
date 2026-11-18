// PATCH /api/admin/orders/[id] { status } → change an order's status (admin only)
import type { NextRequest } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { ORDER_ADMIN_COLUMNS, ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import { DB_NOT_CONFIGURED, getSupabaseAdmin, serverError } from "@/lib/supabase-admin";

const STAMP: Partial<Record<OrderStatus, string>> = {
  paid: "paid_at",
  shipped: "shipped_at",
  delivered: "delivered_at",
};

async function handlePATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return unauthorized();
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  const { id } = await params;
  let status: unknown;
  try {
    ({ status } = (await request.json()) as { status?: unknown });
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return Response.json({ error: "bad_status" }, { status: 400 });

  const now = new Date().toISOString();
  const stamp = STAMP[status as OrderStatus];
  const { data, error } = await db
    .from("orders")
    .update({ status, updated_at: now, ...(stamp && { [stamp]: now }) })
    .eq("id", id)
    .select(ORDER_ADMIN_COLUMNS)
    .single();
  if (error || !data) return Response.json({ error: "db_error" }, { status: 500 });
  return Response.json({ order: data });
}

export async function PATCH(...args: Parameters<typeof handlePATCH>): Promise<Response> {
  try {
    return await handlePATCH(...args);
  } catch (err) {
    return serverError("admin/orders/[id]", err);
  }
}
