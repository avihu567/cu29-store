"use client";

import { useEffect, useState } from "react";
import type { InventoryRow } from "@/lib/orders";
import { ApiError, api, errorText, formatDate } from "./api";

const LOW_STOCK = 5;

function Row({ item, onSaved, onError }: { item: InventoryRow; onSaved: (r: InventoryRow) => void; onError: (m: string) => void }) {
  const [value, setValue] = useState(String(item.stock_count));
  const [saving, setSaving] = useState(false);
  const parsed = Number(value);
  const dirty = value.trim() !== "" && Number.isInteger(parsed) && parsed !== item.stock_count;

  async function save() {
    if (!dirty) return;
    setSaving(true);
    try {
      const { item: saved } = await api<{ item: InventoryRow }>("/api/admin/inventory", {
        method: "PATCH",
        json: { sku: item.sku, stockCount: parsed },
      });
      onSaved(saved);
      setValue(String(saved.stock_count));
    } catch (err) {
      onError(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  const n = item.stock_count;
  const badge =
    n <= 0 ? ["אזל", "bg-red-100 text-red-800"] : n <= LOW_STOCK ? ["מלאי נמוך", "bg-amber-100 text-amber-900"] : ["במלאי", "bg-cream text-ink"];

  return (
    <tr className="border-t border-line/70">
      <td className="px-4 py-3">
        <p className="text-ink">{item.name}</p>
        {item.variant && <p className="text-xs text-stone">{item.variant}</p>}
      </td>
      <td className="hidden px-4 py-3 text-xs text-stone sm:table-cell" dir="ltr">
        {item.sku}
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs ${badge[1]}`}>{badge[0]}</span>
      </td>
      <td className="px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="number"
            inputMode="numeric"
            step={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={`מלאי: ${item.name} ${item.variant ?? ""}`}
            className="w-20 rounded-xl border border-line bg-white px-3 py-2 text-center text-ink focus:border-copper focus:outline-none"
          />
          <button
            type="submit"
            disabled={!dirty || saving}
            className="rounded-full bg-copper px-3.5 py-2 text-xs text-ivory transition-opacity hover:bg-copper-deep disabled:opacity-0"
          >
            {saving ? "…" : "שמירה"}
          </button>
        </form>
      </td>
      <td className="hidden px-4 py-3 text-xs text-stone md:table-cell">{formatDate(item.updated_at)}</td>
    </tr>
  );
}

export default function InventoryTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [items, setItems] = useState<InventoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api<{ inventory: InventoryRow[] }>("/api/admin/inventory")
      .then((d) => alive && setItems(d.inventory))
      .catch((err) => {
        if (!alive) return;
        if (err instanceof ApiError && err.status === 401) onUnauthorized();
        setError(errorText(err));
        setItems([]);
      });
    return () => {
      alive = false;
    };
  }, [onUnauthorized]);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-stone">
        המלאי יורד אוטומטית בכל הזמנה ששולמה ב-PayPal (בקבוקים, שרוולים ושרוול המתנה). כאן אפשר לעדכן ספירה ידנית.
      </p>
      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {items === null ? (
        <p className="text-sm text-stone">טוען מלאי…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-ivory px-5 py-10 text-center text-sm text-stone ring-1 ring-line/70">
          אין פריטי מלאי. יש להריץ את supabase/schema.sql כדי ליצור אותם.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-ivory ring-1 ring-line/70">
          <table className="w-full text-start text-sm">
            <thead className="bg-cream/60 text-xs text-stone">
              <tr>
                <th className="px-4 py-3 text-start font-normal">מוצר</th>
                <th className="hidden px-4 py-3 text-start font-normal sm:table-cell">SKU</th>
                <th className="px-4 py-3 text-start font-normal">מצב</th>
                <th className="px-4 py-3 text-start font-normal">יחידות במלאי</th>
                <th className="hidden px-4 py-3 text-start font-normal md:table-cell">עודכן</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <Row
                  key={item.sku}
                  item={item}
                  onSaved={(saved) => setItems((list) => list?.map((r) => (r.sku === saved.sku ? saved : r)) ?? null)}
                  onError={setError}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
