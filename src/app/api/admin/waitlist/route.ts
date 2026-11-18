// GET /api/admin/waitlist → all signups, newest first (admin only)
import type { NextRequest } from "next/server";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { DB_NOT_CONFIGURED, getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  const { data, error } = await db.from("waitlist").select("*").order("created_at", { ascending: false }).limit(5000);
  if (error) return Response.json({ error: "db_error" }, { status: 500 });
  return Response.json({ waitlist: data }, { headers: { "Cache-Control": "no-store" } });
}
