"use client";

import { useEffect, useState } from "react";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, waPhone, type OrderRow, type OrderStatus } from "@/lib/orders";
import { DELIVERY_BUSINESS_DAYS } from "@/lib/shipping";
import { WhatsAppIcon } from "../icons";
import { ApiError, api, errorText, formatDate, ils } from "./api";

type Filter = "all" | "paid" | "pending_payment" | "shipped";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "paid", label: "שולם - מוכן למשלוח" },
  { id: "pending_payment", label: "ממתין לתשלום / נטישה" },
  { id: "shipped", label: "נשלח" },
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending_payment: "bg-sand text-ink",
  paid: "bg-copper text-ivory",
  payment_review: "bg-red-100 text-red-800",
  shipped: "bg-tobacco-deep text-ivory",
  delivered: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-stone/15 text-stone line-through",
};

const PAID_LIKE: OrderStatus[] = ["paid", "payment_review", "shipped", "delivered"];
const matches = (o: OrderRow, f: Filter) => f === "all" || o.status === f || (f === "paid" && o.status === "payment_review");

function whatsappMessage(o: OrderRow): string {
  const items = o.items.map((i) => `${i.name}${i.quantity > 1 ? ` × ${i.quantity}` : ""}`).join(", ");
  switch (o.status) {
    case "pending_payment":
      return `היי ${o.first_name}, כאן CU29 🌿\nראינו שהתחלת הזמנה באתר (${items}) והתשלום לא הושלם.\nאפשר להשלים את ההזמנה כאן: https://cu29ritual.com/cart\nאו פשוט להשיב להודעה הזו ונשמח לעזור.`;
    case "paid":
    case "payment_review":
      return `היי ${o.first_name}, תודה על ההזמנה ${o.order_number} ב-CU29!\nההזמנה התקבלה ונמצאת בהכנה. נעדכן ברגע שהיא יוצאת למשלוח.`;
    case "shipped":
      return `היי ${o.first_name}, ההזמנה ${o.order_number} מ-CU29 יצאה למשלוח 📦\nכתובת: ${o.address}, ${o.city}\nזמן אספקה משוער: עד ${DELIVERY_BUSINESS_DAYS} ימי עסקים.`;
    case "delivered":
      return `היי ${o.first_name}, מקווים שהטקס עם הנחושת כבר מתחיל 🌿\nנשמח לשמוע איך היה, ותודה שבחרת ב-CU29.`;
    default:
      return `היי ${o.first_name}, כאן CU29 לגבי הזמנה ${o.order_number}.`;
  }
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-ivory px-5 py-4 ring-1 ring-line/70">
      <p className="text-xs text-stone">{label}</p>
      <p className="mt-1 text-2xl text-ink">{value}</p>
    </div>
  );
}

function OrderCard({ order, onStatus }: { order: OrderRow; onStatus: (s: OrderStatus) => void }) {
  const o = order;
  return (
    <details className="group rounded-2xl bg-ivory ring-1 ring-line/70 open:shadow-[var(--shadow-soft)]">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-24 font-medium text-ink" dir="ltr">
          {o.order_number}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-ink">
          {o.first_name} {o.last_name} · <span className="text-stone">{o.city}</span>
        </span>
        <span className="text-xs text-stone">{formatDate(o.created_at)}</span>
        <span className="w-16 text-end text-sm text-ink">{ils(o.total)}</span>
        <span className={`rounded-full px-3 py-1 text-xs ${STATUS_STYLE[o.status]}`}>{ORDER_STATUS_LABELS[o.status]}</span>
        <span className="text-stone transition-transform group-open:rotate-180" aria-hidden="true">
          ⌄
        </span>
      </summary>

      <div className="grid gap-6 border-t border-line/70 px-4 py-5 text-sm sm:px-5 lg:grid-cols-3">
        <section className="space-y-1.5 leading-6">
          <h3 className="mb-2 text-xs tracking-[0.15em] text-copper-dark">פרטי משלוח</h3>
          <p className="text-ink">
            {o.first_name} {o.last_name}
          </p>
          <p>
            {o.address}, {o.city}
          </p>
          <p>
            <a href={`tel:${o.phone}`} dir="ltr" className="text-copper-deep hover:underline">
              {o.phone}
            </a>
          </p>
          <p>
            <a href={`mailto:${o.email}`} dir="ltr" className="break-all text-copper-deep hover:underline">
              {o.email}
            </a>
          </p>
          {o.notes && <p className="rounded-xl bg-cream px-3 py-2">הערות לשליח: {o.notes}</p>}
          <p className="text-xs text-stone">דיוור שיווקי: {o.marketing_opt_in ? "מאשר/ת" : "לא"}</p>
        </section>

        <section>
          <h3 className="mb-2 text-xs tracking-[0.15em] text-copper-dark">פריטים</h3>
          <ul className="space-y-2.5 leading-6">
            {o.items.map((i, n) => (
              <li key={n} className="flex justify-between gap-3">
                <span>
                  <span className="text-ink">
                    {i.name} × {i.quantity}
                  </span>
                  {i.options.length > 0 && <span className="block text-xs text-stone">{i.options.join(" · ")}</span>}
                  {i.freeRing && <span className="block text-xs text-copper-dark">🎁 טבעת סיליקון: {i.freeRing}</span>}
                </span>
                <span className="shrink-0">{ils(i.total)}</span>
              </li>
            ))}
            {o.gift_sleeve && (
              <li className="text-copper-dark">
                🎁 שרוול קירור במתנה · {o.gift_sleeve.size} · {o.gift_sleeve.colorName}
              </li>
            )}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-line/70 pt-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-stone">משלוח</dt>
              <dd>{Number(o.shipping) === 0 ? "חינם" : ils(o.shipping)}</dd>
            </div>
            <div className="flex justify-between text-sm text-ink">
              <dt>סה״כ</dt>
              <dd>{ils(o.total)}</dd>
            </div>
          </dl>
        </section>

        <section className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs tracking-[0.15em] text-copper-dark" htmlFor={`status-${o.id}`}>
              סטטוס
            </label>
            <select
              id={`status-${o.id}`}
              value={o.status}
              onChange={(e) => onStatus(e.target.value as OrderStatus)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-copper focus:outline-none"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <a
            href={`https://wa.me/${waPhone(o.phone)}?text=${encodeURIComponent(whatsappMessage(o))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lift flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm text-white"
          >
            <WhatsAppIcon />
            שלח וואטסאפ ללקוח
          </a>

          <dl className="space-y-1 text-xs text-stone">
            {o.paypal_order_id && (
              <div className="flex justify-between gap-2">
                <dt>PayPal</dt>
                <dd dir="ltr">{o.paypal_order_id}</dd>
              </div>
            )}
            {o.paid_at && (
              <div className="flex justify-between gap-2">
                <dt>שולם</dt>
                <dd>{formatDate(o.paid_at)}</dd>
              </div>
            )}
            {o.shipped_at && (
              <div className="flex justify-between gap-2">
                <dt>נשלח</dt>
                <dd>{formatDate(o.shipped_at)}</dd>
              </div>
            )}
          </dl>
          {o.status === "payment_review" && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-800">
              הסכום ב-PayPal לא תאם את ההזמנה. יש לבדוק בחשבון PayPal לפני משלוח.
            </p>
          )}
        </section>
      </div>
    </details>
  );
}

export default function OrdersTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    api<{ orders: OrderRow[] }>("/api/admin/orders")
      .then((d) => {
        if (!alive) return;
        setOrders(d.orders);
        setError(null);
      })
      .catch((err) => {
        if (!alive) return;
        if (err instanceof ApiError && err.status === 401) onUnauthorized();
        setError(errorText(err));
        setOrders([]);
      });
    return () => {
      alive = false;
    };
  }, [reload, onUnauthorized]);

  async function changeStatus(id: string, status: OrderStatus) {
    const before = orders;
    setOrders((list) => list?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null);
    try {
      const { order } = await api<{ order: OrderRow }>(`/api/admin/orders/${id}`, { method: "PATCH", json: { status } });
      setOrders((list) => list?.map((o) => (o.id === id ? order : o)) ?? null);
    } catch (err) {
      setOrders(before);
      setError(errorText(err));
    }
  }

  const list = orders ?? [];
  const shown = list.filter((o) => matches(o, filter));
  const revenue = list.filter((o) => PAID_LIKE.includes(o.status)).reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="מוכנות למשלוח" value={list.filter((o) => matches(o, "paid")).length} />
        <Stat label="נטישות / ממתין לתשלום" value={list.filter((o) => o.status === "pending_payment").length} />
        <Stat label="נשלחו" value={list.filter((o) => o.status === "shipped").length} />
        <Stat label="הכנסות (הזמנות ששולמו)" value={ils(revenue)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="סינון הזמנות">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filter === f.id ? "border-copper bg-copper text-ivory" : "border-line bg-ivory text-ink hover:border-copper/60"
              }`}
            >
              {f.label}
              <span className="ms-1.5 text-xs opacity-75">{list.filter((o) => matches(o, f.id)).length}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setReload((r) => r + 1)}
          className="rounded-full border border-line bg-ivory px-4 py-2 text-sm text-ink hover:border-copper/60"
        >
          רענון ↻
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {orders === null ? (
        <p className="text-sm text-stone">טוען הזמנות…</p>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl bg-ivory px-5 py-10 text-center text-sm text-stone ring-1 ring-line/70">אין הזמנות להצגה.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((o) => (
            <OrderCard key={o.id} order={o} onStatus={(s) => changeStatus(o.id, s)} />
          ))}
        </div>
      )}
    </div>
  );
}
