// Tiny fetch helper for the admin dashboard.
export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

export async function api<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  const res = await fetch(url, {
    cache: "no-store",
    ...rest,
    headers: json !== undefined ? { "Content-Type": "application/json", ...rest.headers } : rest.headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new ApiError(res.status, data.error ?? `http_${res.status}`);
  return data;
}

export function errorText(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return "פג תוקף ההתחברות. נא להתחבר מחדש.";
    if (err.code === "db_not_configured") return "מסד הנתונים עדיין לא מחובר (חסרים מפתחות Supabase).";
    return `שגיאה (${err.code}). נסו שוב.`;
  }
  return "שגיאת רשת. בדקו את החיבור ונסו שוב.";
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(
    new Date(iso),
  );

export const ils = (n: number) => `₪${Number(n).toLocaleString("he-IL", { maximumFractionDigits: 2 })}`;
