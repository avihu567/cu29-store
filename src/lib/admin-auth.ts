// Admin login: one shared password (ADMIN_PASSWORD) → signed, HTTP-only
// session cookie. Server-only (node:crypto). No password is ever sent back to
// the browser; the cookie holds only an expiry time and its HMAC signature.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "cu29_admin";
export const SESSION_SECONDS = 60 * 60 * 12; // 12 hours

/**
 * Fallback so login works before ADMIN_PASSWORD reaches a deployment.
 * ⚠️ Anyone who can read this source can log in while the env var is unset:
 * set ADMIN_PASSWORD in Vercel (and change it from this value) to close that.
 */
const FALLBACK_ADMIN_PASSWORD = "CU29Admin2026!";

/** Env values pasted as "value" or 'value' (or with spaces/newlines) are cleaned. */
const cleanEnv = (v: string | undefined) => (v ?? "").trim().replace(/^["']+|["']+$/g, "").trim();

function password(): string {
  return cleanEnv(process.env.ADMIN_PASSWORD) || FALLBACK_ADMIN_PASSWORD;
}

export const isAdminConfigured = () => password().length > 0;

/** Signing key: changes when the password changes, so old sessions die with it. */
function key(pw: string): Buffer {
  return createHash("sha256")
    .update(`cu29-admin|${pw}|${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`)
    .digest();
}

const sign = (pw: string, payload: string) => createHmac("sha256", key(pw)).update(payload).digest("hex");

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(attempt: unknown): boolean {
  return typeof attempt === "string" && safeEqual(attempt.trim(), password());
}

export function createSessionToken(): string {
  const pw = password();
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${exp}.${sign(pw, exp)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const pw = password();
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(pw, exp));
}

export function isAdminRequest(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export const unauthorized = () => Response.json({ error: "unauthorized" }, { status: 401 });
