// Server-only Supabase client (service-role key — bypasses Row Level Security).
// Import ONLY from route handlers / server code. Never from a "use client" file.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const isReal = (v: string | undefined): v is string => Boolean(v && !v.startsWith("PASTE_"));

let client: SupabaseClient | null | undefined;

/** The admin client, or null while the Supabase env vars aren't set yet. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client =
    isReal(url) && isReal(key)
      ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
      : null;
  return client;
}

export const DB_NOT_CONFIGURED = { error: "db_not_configured" } as const;
