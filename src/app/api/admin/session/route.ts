// GET /api/admin/session → is this browser logged in, and is the DB connected?
import type { NextRequest } from "next/server";
import { isAdminConfigured, isAdminRequest } from "@/lib/admin-auth";
import { unstable_rethrow } from "next/navigation";
import { getDbStatus } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const authenticated = isAdminRequest(request);
    const dbStatus = getDbStatus();
    return Response.json(
      {
        authenticated,
        adminConfigured: isAdminConfigured(),
        dbConfigured: dbStatus === "ok",
        // Only reveal the reason to a logged-in admin.
        ...(authenticated && { dbStatus }),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin/session]", err);
    return Response.json(
      { authenticated: false, adminConfigured: true, dbConfigured: false },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
