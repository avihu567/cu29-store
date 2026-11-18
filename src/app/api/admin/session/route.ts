// GET /api/admin/session → is this browser logged in, and is the DB connected?
import type { NextRequest } from "next/server";
import { isAdminConfigured, isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  return Response.json(
    {
      authenticated: isAdminRequest(request),
      adminConfigured: isAdminConfigured(),
      dbConfigured: getSupabaseAdmin() !== null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
