// POST /api/admin/login { password } → HTTP-only session cookie
// DELETE /api/admin/login → log out
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_SECONDS, checkPassword, createSessionToken } from "@/lib/admin-auth";
import { serverError } from "@/lib/supabase-admin";

const noStore = { "Cache-Control": "no-store" };

async function handlePOST(request: Request) {
  let password: unknown;
  try {
    ({ password } = (await request.json()) as { password?: unknown });
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400, headers: noStore });
  }

  if (!checkPassword(password)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401, headers: noStore });
  }

  const res = NextResponse.json({ ok: true }, { headers: noStore });
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

export async function POST(...args: Parameters<typeof handlePOST>): Promise<Response> {
  try {
    return await handlePOST(...args);
  } catch (err) {
    return serverError("admin/login", err);
  }
}
