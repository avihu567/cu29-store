// POST /api/admin/login { password } → HTTP-only session cookie
// DELETE /api/admin/login → log out
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_SECONDS, checkPassword, createSessionToken, isAdminConfigured } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) return Response.json({ error: "admin_not_configured" }, { status: 503 });

  let password: unknown;
  try {
    ({ password } = (await request.json()) as { password?: unknown });
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return Response.json({ error: "wrong_password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
