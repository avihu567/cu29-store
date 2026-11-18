// Admin login: one shared password (ADMIN_PASSWORD) → signed, HTTP-only
// session cookie. Server-only (node:crypto). No password is ever sent back to
// the browser; the cookie holds only an expiry time and its HMAC signature.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "cu29_admin";
export const SESSION_SECONDS = 60 * 60 * 12; // 12 hours

function password(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  return p && p.length >= 8 ? p : null;
}

export const isAdminConfigured = () => password() !== null;

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
  const pw = password();
  return Boolean(pw && typeof attempt === "string" && safeEqual(attempt, pw));
}

export function createSessionToken(): string {
  const pw = password();
  if (!pw) throw new Error("ADMIN_PASSWORD not set");
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${exp}.${sign(pw, exp)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const pw = password();
  if (!pw || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(pw, exp));
}

export function isAdminRequest(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export const unauthorized = () => Response.json({ error: "unauthorized" }, { status: 401 });
