// Server-only Supabase client (service-role key — bypasses Row Level Security).
// Import ONLY from route handlers / server code. Never from a "use client" file.
//
// Initialization never throws: a missing or malformed env var (e.g. a URL
// pasted with quotes, as a Markdown link, or without https://) makes getSupabaseAdmin() return
// null with a reason, instead of crashing every route with an HTTP 500.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { unstable_rethrow } from "next/navigation";
import { cleanEnv, cleanUrlEnv } from "./env";

const DEFAULT_SUPABASE_URL = "https://iaunbxxrdrfyhqiqadkq.supabase.co";

export type DbStatus = "ok" | "missing_key" | "invalid_url" | "client_error";

let client: SupabaseClient | null = null;
let status: DbStatus | null = null;

function init() {
  if (status) return;
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ? cleanUrlEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) : DEFAULT_SUPABASE_URL;
  if (!key || key.startsWith("PASTE_")) {
    status = "missing_key";
    return;
  }
  if (!url) {
    status = "invalid_url";
    console.error("[supabase-admin] NEXT_PUBLIC_SUPABASE_URL is not a valid URL");
    return;
  }
  try {
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    status = "ok";
  } catch (err) {
    console.error("[supabase-admin] createClient failed:", err instanceof Error ? err.message : err);
    status = "client_error";
  }
}

/** The admin client, or null while Supabase isn't configured correctly. */
export function getSupabaseAdmin(): SupabaseClient | null {
  init();
  return client;
}

/** Why the client is (not) available — safe to show to a logged-in admin (no secrets). */
export function getDbStatus(): DbStatus {
  init();
  return status ?? "client_error";
}

export const DB_NOT_CONFIGURED = { error: "db_not_configured" } as const;

/** JSON 500 for unexpected errors in route handlers (logged server-side). */
export function serverError(where: string, err: unknown): Response {
  // Let Next.js internals through (e.g. the "bail out of prerendering" signal
  // thrown when a route reads cookies) — catching them would make routes static.
  unstable_rethrow(err);
  console.error(`[${where}]`, err);
  return Response.json({ error: "server_error" }, { status: 500 });
}
