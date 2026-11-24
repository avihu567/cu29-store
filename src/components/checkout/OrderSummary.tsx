"use client";

import Link from "next/link";
import { FREE_RING_VALUE, SLEEVE_PRICE } from "@/lib/offers";
import { lineOptions, type PricedCart, type ResolvedGiftSleeve } from "@/lib/pricing";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import ProductImage from "../ProductImage";
import { lineImage } from "@/lib/variant-images";

export default function OrderSummary({
  cart,
  gift,
  images,
  editable = true,
}: {
  cart: PricedCart;
  gift?: ResolvedGiftSleeve;
  images: Record<string, string | undefined>;
  editable?: boolean;
}) {
  const giftActive = Boolean(gift?.active);
  const savings =
    cart.bottleCount * FREE_RING_VALUE +
    cart.lines.reduce((s, l) => s + (l.regularTotal - l.total), 0) +
    (giftActive ? SLEEVE_PRICE : 0);

  return (
    <section
      aria-labelledby="summary-title"
      className="h-fit min-w-0 rounded-[var(--radius-card)] bg-cream/70 p-6 shadow-[var(--shadow-soft)] ring-1 ring-line/60 sm:p-7"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="summary-title" className="font-serif text-2xl text-ink">
          סיכום הזמנה
        </h2>
        {editable && (
          <Link href="/cart" className="text-xs text-stone underline-offset-4 hover:text-copper hover:underline">
            עריכת הסל
          </Link>
        )}
      </div>

      <ul className="mt-5 divide-y divide-line/70">
        {cart.lines.map(({ line, product, total, regularTotal, freeRing }) => (
          <li key={[line.slug, line.color, line.size, line.offer].join(":")} className="flex gap-3.5 py-4">
            <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line/60">
              <ProductImage
                src={lineImage(product, line) ?? images[product.slug]}
                art={product.art}
                alt={product.name}
                sizes="64px"
                padded={false}
                artClassName="h-full w-auto p-2"
              />
              <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-ivory">
                {line.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-6 text-ink">{product.name}</p>
                <p className="shrink-0 text-sm text-ink">
                  {formatPrice(total)}
                  {regularTotal > total && <s className="block text-end text-xs text-stone">{formatPrice(regularTotal)}</s>}
                </p>
              </div>
              {lineOptions(product, line).length > 0 && (
                <p className="text-xs text-stone">{lineOptions(product, line).join(" · ")}</p>
              )}
              {freeRing && (
                <p className="mt-1 text-xs text-copper-dark">
                  🎁 טבעת נשיאה · {freeRing}
                  {line.quantity > 1 && ` × ${line.quantity}`} — חינם
                </p>
              )}
            </div>
          </li>
        ))}
        {giftActive && gift && (
          <li className="flex items-center justify-between gap-3 py-4 text-sm">
            <span className="text-ink">
              🎁 שרוול קירור במתנה
              <span className="block text-xs text-stone">
                מידה: {gift.size} · צבע: {gift.colorName}
              </span>
            </span>
            <span className="shrink-0 text-copper-deep">
              חינם <s className="text-xs text-stone">{formatPrice(SLEEVE_PRICE)}</s>
            </span>
          </li>
        )}
      </ul>

      <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone">סכום ביניים</dt>
          <dd>{formatPrice(cart.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">משלוח</dt>
          <dd>{cart.shipping === 0 ? "חינם" : formatPrice(cart.shipping)}</dd>
        </div>
        {cart.shipping > 0 && (
          <p className="text-xs text-copper-dark">
            נותרו {formatPrice(cart.toFreeShipping)} למשלוח חינם (מעל {FREE_SHIPPING_THRESHOLD} ₪)
          </p>
        )}
        {savings > 0 && (
          <div className="flex justify-between text-copper-deep">
            <dt>שווי ההטבות בהזמנה</dt>
            <dd>{formatPrice(savings)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-line pt-4 font-serif text-xl text-ink">
          <dt>סה״כ לתשלום</dt>
          <dd>{formatPrice(cart.total)}</dd>
        </div>
      </dl>
    </section>
  );
}
