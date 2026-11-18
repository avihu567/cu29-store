"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import BrandMark from "../BrandMark";
import { api, errorText } from "./api";
import InventoryTab from "./InventoryTab";
import OrdersTab from "./OrdersTab";
import WaitlistTab from "./WaitlistTab";

interface Session {
  authenticated: boolean;
  adminConfigured: boolean;
  dbConfigured: boolean;
  dbStatus?: "ok" | "missing_key" | "invalid_url" | "client_error";
}

const DB_HINT: Record<string, string> = {
  missing_key: "חסר המפתח הסודי SUPABASE_SERVICE_ROLE_KEY (או שעדיין מופיע בו PASTE_…).",
  invalid_url: "הכתובת ב-NEXT_PUBLIC_SUPABASE_URL אינה תקינה (צריכה להיות https://….supabase.co, בלי מירכאות).",
  client_error: "לא ניתן היה ליצור חיבור ל-Supabase עם המפתחות שהוגדרו.",
};

type Tab = "orders" | "inventory" | "waitlist";
const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "הזמנות ונטישות" },
  { id: "inventory", label: "ניהול מלאי" },
  { id: "waitlist", label: "רשימת המתנה" },
];

function Login({ adminConfigured, onLogin }: { adminConfigured: boolean; onLogin: (s: Session) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const errorId = useId();
  const id = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await api("/api/admin/login", { method: "POST", json: { password } });
      // Confirm the session cookie really arrived before switching screens.
      const session = await api<Session>("/api/admin/session");
      if (!session.authenticated) {
        setError("הסיסמה נכונה, אבל הדפדפן לא שמר את ההתחברות. ודאו שעוגיות מופעלות ונסו שוב.");
        return;
      }
      onLogin(session);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-5 py-16">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-[var(--radius-card)] bg-ivory p-8 shadow-[var(--shadow-soft)] ring-1 ring-line/70"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <BrandMark logo="mark" decorative className="h-10 text-ink" />
          <h1 className="text-xl text-ink">כניסה לניהול החנות</h1>
        </div>
        {!adminConfigured ? (
          <p className="rounded-2xl bg-cream px-4 py-3 text-sm leading-6 text-ink">
            הכניסה סגורה: לא הוגדרה סיסמת ניהול (ADMIN_PASSWORD) בשרת.
          </p>
        ) : (
          <>
            <div>
              <label htmlFor={id} className="mb-1.5 block text-sm text-ink">
                סיסמה
              </label>
              <input
                id={id}
                type="password"
                autoComplete="current-password"
                dir="ltr"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-ink focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/25 ${
                  error ? "border-red-600/70" : "border-line"
                }`}
              />
              {error && (
                <p id={errorId} role="alert" className="mt-2 text-sm leading-6 text-red-700">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="btn-copper w-full rounded-full px-6 py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? "מתחברים…" : "כניסה"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default function AdminApp() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("orders");
  const [reloadKey, setReloadKey] = useState(0);
  const recheckSession = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let alive = true;
    api<Session>("/api/admin/session")
      .then((s) => alive && setSession(s))
      .catch(() => alive && setSession({ authenticated: false, adminConfigured: true, dbConfigured: false }));
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  async function logout() {
    await api("/api/admin/login", { method: "DELETE" }).catch(() => undefined);
    setSession((s) => (s ? { ...s, authenticated: false } : s));
  }

  return (
    // Full-screen layer over the storefront chrome (header, footer, WhatsApp button).
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-paper text-ink">
      {!session ? (
        <p className="p-10 text-center text-sm text-stone">טוען…</p>
      ) : !session.authenticated ? (
        <Login
          adminConfigured={session.adminConfigured}
          onLogin={(s) => {
            setSession(s);
            router.refresh();
          }}
        />
      ) : (
        <div className="min-h-full">
          <header className="sticky top-0 z-10 bg-tobacco-deep text-ivory">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
              <div className="flex items-center gap-3">
                <BrandMark logo="mark" decorative className="h-7 text-ivory" />
                <span className="text-sm tracking-[0.12em] text-copper-pale">ניהול החנות</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <a href="/" target="_blank" rel="noopener noreferrer" className="text-ivory/70 hover:text-ivory">
                  לאתר ↗
                </a>
                <button type="button" onClick={logout} className="rounded-full border border-ivory/25 px-3.5 py-1.5 hover:border-ivory/60">
                  יציאה
                </button>
              </div>
            </div>
            <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-8" aria-label="לשוניות ניהול">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? "page" : undefined}
                  className={`shrink-0 border-b-2 px-4 py-3 text-sm transition-colors ${
                    tab === t.id ? "border-copper-light text-ivory" : "border-transparent text-ivory/60 hover:text-ivory"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
            {!session.dbConfigured && (
              <div className="mb-6 rounded-2xl border border-copper/40 bg-copper-pale/40 px-5 py-4 text-sm leading-7">
                <strong className="font-medium">מסד הנתונים עדיין לא מחובר.</strong>{" "}
                {session.dbStatus && DB_HINT[session.dbStatus] && <>{DB_HINT[session.dbStatus]} </>}
                יש להדביק את המפתחות של Supabase
                (NEXT_PUBLIC_SUPABASE_ANON_KEY ו-SUPABASE_SERVICE_ROLE_KEY) ב-‎.env.local וב-Vercel, ולהריץ פעם אחת את
                הקובץ supabase/schema.sql ב-SQL Editor של Supabase.
              </div>
            )}
            {tab === "orders" && <OrdersTab onUnauthorized={recheckSession} />}
            {tab === "inventory" && <InventoryTab onUnauthorized={recheckSession} />}
            {tab === "waitlist" && <WaitlistTab onUnauthorized={recheckSession} />}
          </main>
        </div>
      )}
    </div>
  );
}
