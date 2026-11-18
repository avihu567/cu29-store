"use client";

import { useEffect, useState } from "react";
import type { WaitlistRow } from "@/lib/orders";
import { ApiError, api, errorText, formatDate } from "./api";

function toCsv(rows: WaitlistRow[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ["תאריך", "מוצר", "slug", "פרטי קשר", "סוג"];
  const lines = rows.map((r) =>
    [formatDate(r.created_at), r.product_name, r.product_slug, r.contact, r.contact_type === "email" ? "מייל" : "טלפון"]
      .map(esc)
      .join(","),
  );
  // BOM so Excel opens Hebrew correctly.
  return "﻿" + [header.map(esc).join(","), ...lines].join("\r\n");
}

export default function WaitlistTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [rows, setRows] = useState<WaitlistRow[] | null>(null);
  const [product, setProduct] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api<{ waitlist: WaitlistRow[] }>("/api/admin/waitlist")
      .then((d) => alive && setRows(d.waitlist))
      .catch((err) => {
        if (!alive) return;
        if (err instanceof ApiError && err.status === 401) onUnauthorized();
        setError(errorText(err));
        setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [onUnauthorized]);

  const all = rows ?? [];
  const products = [...new Map(all.map((r) => [r.product_slug, r.product_name])).entries()];
  const shown = product === "all" ? all : all.filter((r) => r.product_slug === product);

  function exportCsv() {
    const blob = new Blob([toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cu29-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="סינון לפי מוצר">
          {[["all", "הכל"] as [string, string], ...products].map(([slug, name]) => (
            <button
              key={slug}
              type="button"
              onClick={() => setProduct(slug)}
              aria-pressed={product === slug}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                product === slug ? "border-copper bg-copper text-ivory" : "border-line bg-ivory text-ink hover:border-copper/60"
              }`}
            >
              {name}
              <span className="ms-1.5 text-xs opacity-75">
                {slug === "all" ? all.length : all.filter((r) => r.product_slug === slug).length}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={shown.length === 0}
          className="btn-copper rounded-full px-5 py-2.5 text-sm disabled:opacity-50"
        >
          ייצוא CSV ⤓
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {rows === null ? (
        <p className="text-sm text-stone">טוען…</p>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl bg-ivory px-5 py-10 text-center text-sm text-stone ring-1 ring-line/70">
          עדיין אין נרשמים לרשימת ההמתנה.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-ivory ring-1 ring-line/70">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-xs text-stone">
              <tr>
                <th className="px-4 py-3 text-start font-normal">תאריך</th>
                <th className="px-4 py-3 text-start font-normal">מוצר</th>
                <th className="px-4 py-3 text-start font-normal">פרטי קשר</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-t border-line/70">
                  <td className="px-4 py-3 text-xs text-stone">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-ink">{r.product_name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={r.contact_type === "email" ? `mailto:${r.contact}` : `tel:${r.contact}`}
                      dir="ltr"
                      className="text-copper-deep hover:underline"
                    >
                      {r.contact}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
