"use client";

import Link from "next/link";
import type { ShippingDetails } from "@/lib/checkout";
import { lineOptions, type GiftSleeveChoice, type PricedCart } from "@/lib/pricing";
import { formatPrice, whatsappLink } from "@/lib/products";
import { DELIVERY_BUSINESS_DAYS } from "@/lib/shipping";
import { WhatsAppIcon } from "../icons";

export interface ConfirmedOrder {
  orderId: string;
  captureId?: string;
  orderRef: string;
  shipping: ShippingDetails;
  cart: PricedCart;
  giftSleeve?: GiftSleeveChoice;
}

export default function OrderConfirmation({ order }: { order: ConfirmedOrder }) {
  const { orderId, orderRef, shipping, cart, giftSleeve } = order;

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <div className="rounded-[var(--radius-card)] bg-paper/80 px-6 py-10 text-center shadow-[var(--shadow-soft)] ring-1 ring-line/60 sm:px-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-copper-pale/60 text-copper-deep">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-6 font-serif text-3xl font-light text-ink sm:text-4xl" role="status">
          תודה, {shipping.firstName}. ההזמנה התקבלה.
        </h2>
        <p className="text-subtle mx-auto mt-4 max-w-md text-[15px] leading-8 text-stone">
          התשלום אושר והטקס שלך כבר בדרך. אישור תשלום נשלח מ-PayPal, ואנחנו נעדכן אותך כשהחבילה יוצאת.
        </p>

        <dl className="mx-auto mt-8 grid max-w-md gap-3 rounded-2xl bg-white px-5 py-5 text-start text-sm ring-1 ring-line/60">
          <div className="flex justify-between gap-4">
            <dt className="text-stone">מספר הזמנה (PayPal)</dt>
            <dd className="font-medium text-ink" dir="ltr">
              {orderId}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone">אסמכתא CU29</dt>
            <dd className="text-ink" dir="ltr">
              {orderRef}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line/70 pt-3">
            <dt className="text-stone">סה״כ שולם</dt>
            <dd className="font-serif text-lg text-ink">{formatPrice(cart.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-[var(--radius-card)] bg-cream/60 p-6 ring-1 ring-line/60">
          <h3 className="font-serif text-xl text-ink">פרטי משלוח</h3>
          <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-stone">
            <p className="text-ink">
              {shipping.firstName} {shipping.lastName}
            </p>
            <p>
              {shipping.address}, {shipping.city}
            </p>
            <p dir="ltr" className="text-end">
              {shipping.phone}
            </p>
            <p dir="ltr" className="text-end">
              {shipping.email}
            </p>
            {shipping.notes && <p>הערות לשליח: {shipping.notes}</p>}
          </address>
          <p className="mt-4 text-xs text-copper-dark">זמן אספקה משוער: עד {DELIVERY_BUSINESS_DAYS} ימי עסקים</p>
        </section>

        <section className="rounded-[var(--radius-card)] bg-cream/60 p-6 ring-1 ring-line/60">
          <h3 className="font-serif text-xl text-ink">מה בהזמנה</h3>
          <ul className="mt-3 space-y-2.5 text-sm leading-6">
            {cart.lines.map((l) => (
              <li key={[l.line.slug, l.line.color, l.line.size, l.line.offer].join(":")}>
                <span className="text-ink">
                  {l.product.name} × {l.line.quantity}
                </span>
                {lineOptions(l.product, l.line).length > 0 && (
                  <span className="block text-xs text-stone">{lineOptions(l.product, l.line).join(" · ")}</span>
                )}
                {l.freeRing && <span className="block text-xs text-copper-dark">🎁 טבעת נשיאה · {l.freeRing} — מתנה</span>}
              </li>
            ))}
            {giftSleeve && (
              <li className="text-copper-dark">
                🎁 שרוול קירור במתנה · {giftSleeve.size} · {giftSleeve.colorName}
              </li>
            )}
            <li className="border-t border-line/70 pt-2.5 text-stone">
              משלוח: {cart.shipping === 0 ? "חינם" : formatPrice(cart.shipping)}
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="btn-copper inline-flex items-center justify-center rounded-full px-9 py-4 text-sm tracking-[0.08em]"
        >
          חזרה לחנות
        </Link>
        <a
          href={whatsappLink(`שלום CU29, יש לי שאלה לגבי הזמנה ${orderRef} (PayPal ${orderId})`)}
          target="_blank"
          rel="noopener noreferrer"
          className="lift inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-7 py-4 text-sm text-ink"
        >
          <WhatsAppIcon />
          שאלה על ההזמנה
        </a>
      </div>
    </div>
  );
}
