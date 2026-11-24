"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { lineKey, setGiftSleevePick, setQuantity, useCart, useGiftSleevePick } from "@/lib/cart";
import { formatPrice, getProduct, SLEEVE_COLORS, whatsappLink } from "@/lib/products";
import {
  FREE_RING_VALUE,
  GIFT_SLEEVE_THRESHOLD,
  SLEEVE_BUMP_PRICE,
  SLEEVE_PRICE,
  SLEEVE_SLUG,
} from "@/lib/offers";
import { buildOrderMessage, lineOptions, pixelContents, priceCart, resolveGiftSleeve } from "@/lib/pricing";
import * as fpixel from "@/lib/fpixel";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { WhatsAppIcon } from "./icons";
import ProductArt from "./ProductArt";
import ProductImage from "./ProductImage";
import { lineImage, sleeveImages } from "@/lib/variant-images";
import QuantitySelector from "./QuantitySelector";
import { ButtonLink } from "./ui";

export default function CartView({
  images,
}: {
  images: Record<string, string | undefined>;
}) {
  // Checkout consent. Terms are required; marketing is optional and must
  // always start unchecked (never pre-checked, never required).
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const termsRef = useRef<HTMLInputElement>(null);
  const termsId = useId();
  const marketingId = useId();
  const errorId = useId();

  const cart = priceCart(useCart());
  const sleeve = getProduct(SLEEVE_SLUG);
  // Gift sleeve (tier 2) choice, shared with /checkout; size defaults to the first bottle's size.
  const gift = resolveGiftSleeve(cart, useGiftSleevePick());
  const sleeveSizes = gift?.sizes ?? [];
  const setGiftSize = (size: string) => setGiftSleevePick({ size });
  const setGiftColor = (color: string) => setGiftSleevePick({ color });

  if (cart.lines.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-start gap-6 border-t border-line pt-12">
        <p className="text-stone">הסל שלכם ריק כרגע.</p>
        <ButtonLink href="/shop">להתחלת קנייה</ButtonLink>
      </div>
    );
  }

  const giftSize = gift?.size;
  const giftColor = gift?.colorId;
  const giftColorName = gift?.colorName ?? "";
  const giftActive = cart.giftSleeveUnlocked && Boolean(sleeve) && Boolean(giftSize);

  // Value of everything the customer gets for free or discounted.
  const savings =
    cart.bottleCount * FREE_RING_VALUE +
    cart.lines.reduce((s, l) => s + (l.regularTotal - l.total), 0) +
    (giftActive ? SLEEVE_PRICE : 0);

  const message = buildOrderMessage(cart, {
    giftSleeve: giftActive && giftSize ? { size: giftSize, colorName: giftColorName } : undefined,
    footer: [
      "",
      "✓ קראתי ואני מסכים/ה לתקנון האתר ולמדיניות הביטולים וההחזרות",
      `עדכונים ומבצעים במייל, SMS ו-WhatsApp: ${marketingOptIn ? "כן, מאשר/ת" : "לא"}`,
    ],
  });

  function guardSubmit(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!agreedToTerms) {
      e.preventDefault();
      setShowTermsError(true);
      termsRef.current?.focus();
      return;
    }
    // The order really goes out: track checkout + the WhatsApp contact.
    fpixel.initiateCheckout({ contents: pixelContents(cart), value: cart.total });
    fpixel.contact(cart.total);
  }

  // Progress bar: 0 → tier 2 (₪310), with a marker at tier 1 (₪250).
  const progress = Math.min(100, (cart.subtotal / GIFT_SLEEVE_THRESHOLD) * 100);
  const tier1At = (FREE_SHIPPING_THRESHOLD / GIFT_SLEEVE_THRESHOLD) * 100;
  const freeShipping = cart.toFreeShipping === 0;

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      <ul className="h-fit min-w-0 divide-y divide-line/70 rounded-[var(--radius-card)] bg-paper/80 px-4 sm:px-6 shadow-[var(--shadow-soft)] ring-1 ring-line/60">
        {cart.lines.map(({ line, product, total, regularTotal, bumpUnits, freeRing }) => {
          const key = lineKey(line);
          const options = lineOptions(product, line);
          const isBumpLine = line.offer === "bump";
          return (
            <li key={key} className="flex gap-4 py-6 sm:gap-5">
              <Link
                href={`/product/${product.slug}`}
                className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-line/60 sm:w-24"
              >
                <ProductImage
                  src={lineImage(product, line) ?? images[product.slug]}
                  art={product.art}
                  alt={product.name}
                  sizes="96px"
                  padded={false}
                  artClassName="h-full w-auto p-3"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <Link href={`/product/${product.slug}`} className="font-serif text-lg text-ink hover:text-copper">
                    {product.name}
                  </Link>
                  <p className="text-sm text-stone">
                    {options.length > 0 && <>{options.join(" · ")} · </>}
                    {isBumpLine && bumpUnits > 0 ? (
                      <>
                        {formatPrice(SLEEVE_BUMP_PRICE)} <s>{formatPrice(SLEEVE_PRICE)}</s>
                      </>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </p>
                  {isBumpLine && bumpUnits < line.quantity && (
                    <p className="mt-1 text-xs text-copper-dark">
                      {bumpUnits === 0
                        ? `המחיר המוזל (${formatPrice(SLEEVE_BUMP_PRICE)}) זמין עם רכישת בקבוק`
                        : `המחיר המוזל חל על שרוול אחד לכל בקבוק בסל`}
                    </p>
                  )}
                  {freeRing && (
                    <p className="mt-1.5 inline-flex flex-wrap items-center gap-x-1.5 rounded-full bg-copper-pale/50 px-3 py-1 text-xs text-copper-dark">
                      <span aria-hidden="true">🎁</span>
                      טבעת נשיאה מסיליקון · {freeRing}
                      {line.quantity > 1 && ` × ${line.quantity}`} — חינם
                      <span className="text-stone">
                        (שווי <s>{formatPrice(FREE_RING_VALUE)}</s>)
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <QuantitySelector size="sm" value={line.quantity} onChange={(q) => setQuantity(key, q)} />
                  <span className="w-16 text-end text-sm text-ink">
                    {formatPrice(total)}
                    {regularTotal > total && (
                      <s className="block text-xs text-stone">{formatPrice(regularTotal)}</s>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(key, 0)}
                    className="text-xs text-stone underline-offset-4 hover:text-copper hover:underline"
                  >
                    הסרה
                  </button>
                </div>
              </div>
            </li>
          );
        })}

        {giftActive && sleeve && (
          <li className="flex gap-4 py-6 sm:gap-5">
            <div className="relative flex aspect-square w-20 shrink-0 sm:w-24 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-copper/40">
              {(sleeveImages(giftSize, giftColor)[0]?.src ?? images[SLEEVE_SLUG]) ? (
                <ProductImage
                  src={sleeveImages(giftSize, giftColor)[0]?.src ?? images[SLEEVE_SLUG]}
                  art="sleeve"
                  alt={sleeve.name}
                  sizes="96px"
                  padded={false}
                />
              ) : (
                <ProductArt
                  variant="sleeve"
                  ringColor={SLEEVE_COLORS.find((c) => c.id === giftColor)?.hex}
                  className="h-full w-auto p-3"
                />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-serif text-lg text-ink">
                  <span aria-hidden="true">🎁 </span>
                  {sleeve.name} · במתנה
                </p>
                <p className="text-sm text-copper-deep">
                  חינם <s className="text-xs text-stone">{formatPrice(SLEEVE_PRICE)}</s>
                </p>
              </div>
              <fieldset>
                <legend className="mb-1.5 text-xs text-stone">
                  מידה: <span className="text-ink">{giftSize}</span>
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {sleeveSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setGiftSize(size)}
                      aria-pressed={size === giftSize}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        size === giftSize ? "border-action bg-action text-white" : "border-line bg-paper text-ink hover:border-copper/60"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-1.5 text-xs text-stone">
                  צבע: <span className="text-ink">{giftColorName}</span>
                </legend>
                <div className="flex gap-2">
                  {SLEEVE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setGiftColor(c.id)}
                      aria-pressed={c.id === giftColor}
                      aria-label={`שרוול מתנה ${c.name}`}
                      title={c.name}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                        c.id === giftColor ? "border-ink" : "border-transparent hover:border-stone-muted"
                      }`}
                    >
                      <span className="h-6 w-6 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </li>
        )}
      </ul>

      <aside className="h-fit min-w-0 space-y-4 rounded-[var(--radius-card)] bg-cream p-6 sm:p-8 shadow-[var(--shadow-soft)] ring-1 ring-line/60">
        <h2 className="font-serif text-2xl text-ink">סיכום הזמנה</h2>
        <dl className="space-y-3 border-b border-line pb-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone">סכום ביניים</dt>
            <dd>{formatPrice(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">משלוח</dt>
            <dd>{cart.shipping === 0 ? "חינם" : formatPrice(cart.shipping)}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-copper-deep">
              <dt>🎁 שווי ההטבות בהזמנה</dt>
              <dd>{formatPrice(savings)}</dd>
            </div>
          )}
        </dl>

        {/* Two-tier progress: free shipping (₪250) → free sleeve (₪310) */}
        <div className="space-y-3">
          <p className="text-sm text-copper-dark">
            {!freeShipping
              ? `נותרו לך ${formatPrice(cart.toFreeShipping)} למשלוח חינם`
              : !cart.giftSleeveUnlocked
                ? `✓ משלוח חינם · נותרו לך ${formatPrice(cart.toGiftSleeve)} לשרוול קירור במתנה`
                : "✓ משלוח חינם ושרוול קירור במתנה!"}
          </p>
          <div
            className="relative h-2 rounded-full bg-sand"
            role="progressbar"
            aria-label="התקדמות להטבות: משלוח חינם ושרוול קירור במתנה"
            aria-valuemin={0}
            aria-valuemax={GIFT_SLEEVE_THRESHOLD}
            aria-valuenow={Math.min(cart.subtotal, GIFT_SLEEVE_THRESHOLD)}
          >
            <div
              className="h-full rounded-full bg-copper transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            <span
              className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-cream ${freeShipping ? "bg-copper" : "bg-stone-muted"}`}
              style={{ insetInlineStart: `${tier1At}%` }}
              aria-hidden="true"
            />
          </div>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            <li className={freeShipping ? "text-copper-deep" : "text-stone"}>
              {freeShipping ? "✓ " : ""}משלוח חינם בקנייה מעל {FREE_SHIPPING_THRESHOLD} ₪
            </li>
            <li className={`text-end ${cart.giftSleeveUnlocked ? "text-copper-deep" : "text-stone"}`}>
              {cart.giftSleeveUnlocked ? "✓ " : ""}שרוול קירור במתנה בקנייה מעל {GIFT_SLEEVE_THRESHOLD} ₪
            </li>
          </ul>
        </div>

        <div className="flex justify-between font-serif text-xl">
          <span>סה״כ</span>
          <span>{formatPrice(cart.total)}</span>
        </div>

        <Link
          href="/checkout"
          onClick={() => fpixel.initiateCheckout({ contents: pixelContents(cart), value: cart.total })}
          className="btn-copper flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm tracking-[0.08em]"
        >
          המשך לתשלום
          <span aria-hidden="true">←</span>
        </Link>
        <p className="text-center text-xs text-stone">PayPal · כרטיס אשראי · תשלום מאובטח</p>

        <p className="flex items-center gap-3 pt-2 text-xs text-stone before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
          או הזמנה מהירה בוואטסאפ
        </p>
        {/* Checkout consent */}
        <fieldset className="space-y-3 border-t border-line pt-5 text-sm leading-6">
          <legend className="sr-only">אישורים להזמנה</legend>

          <div className="flex items-start gap-3">
            <input
              ref={termsRef}
              id={termsId}
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (e.target.checked) setShowTermsError(false);
              }}
              aria-invalid={showTermsError || undefined}
              aria-describedby={showTermsError ? errorId : undefined}
              className={`mt-1 h-4 w-4 shrink-0 accent-copper ${showTermsError ? "outline outline-2 outline-offset-2 outline-red-600" : ""}`}
            />
            <label htmlFor={termsId} className="text-ink">
              קראתי ואני מסכים/ה ל
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-copper-deep underline underline-offset-4">
                תקנון האתר
              </Link>{" "}
              ול
              <Link href="/returns" target="_blank" rel="noopener noreferrer" className="text-copper-deep underline underline-offset-4">
                מדיניות הביטולים וההחזרות
              </Link>
              <span className="text-red-700" aria-hidden="true"> *</span>
            </label>
          </div>
          {showTermsError && (
            <p id={errorId} role="alert" className="ps-7 text-xs text-red-700">
              יש לאשר את תקנון האתר ומדיניות הביטולים וההחזרות כדי להשלים את ההזמנה.
            </p>
          )}

          <div className="flex items-start gap-3">
            <input
              id={marketingId}
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-copper"
            />
            <label htmlFor={marketingId} className="text-stone">
              אני מעוניין/ת לקבל עדכונים ומבצעים במייל, SMS ו-WhatsApp
            </label>
          </div>
        </fieldset>

        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={guardSubmit}
          aria-disabled={!agreedToTerms}
          className={`flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm text-white transition-opacity ${agreedToTerms ? "lift" : "opacity-50"}`}
        >
          <WhatsAppIcon />
          הזמנה בוואטסאפ
        </a>
        <p className="text-center text-xs leading-5 text-stone">
          נציג יחזור אליכם לאישור ההזמנה ולתיאום תשלום ומשלוח.
        </p>
      </aside>
    </div>
  );
}
