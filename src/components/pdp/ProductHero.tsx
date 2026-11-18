"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addToCart } from "@/lib/cart";
import {
  RING_COLORS,
  SLEEVE_COLORS,
  getProduct,
  isPurchasable,
  technicalSpecs,
  formatPrice,
  whatsappLink,
  type GalleryImage,
  type Product,
  type RingColorId,
} from "@/lib/products";
import { FREE_RING_VALUE, SLEEVE_BUMP_PRICE, SLEEVE_PRICE, SLEEVE_SLUG } from "@/lib/offers";
import { buildOrderMessage, isBottle, pixelContents, priceCart } from "@/lib/pricing";
import * as fpixel from "@/lib/fpixel";
import type { CartLine } from "@/lib/cart";
import { WhatsAppIcon } from "../icons";
import QuantitySelector from "../QuantitySelector";
import Gallery from "./Gallery";
import NotifyForm from "./NotifyForm";
import StarRating from "./StarRating";
import {
  DELIVERY_TIME,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/shipping";

interface Props {
  /** Size variants of the product family (or just the product itself). */
  variants: Product[];
  initialSlug: string;
  imagesBySlug: Record<string, GalleryImage[]>;
  categoryName: string;
  rating: { average: number; count: number };
}

export default function ProductHero({
  variants,
  initialSlug,
  imagesBySlug,
  categoryName,
  rating,
}: Props) {
  const [slug, setSlug] = useState(initialSlug);
  const product = variants.find((v) => v.slug === slug) ?? variants[0];
  const [color, setColor] = useState<RingColorId | undefined>(product.ringColors?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  // Accessory options (sleeve size/color, ring color)
  const [optSize, setOptSize] = useState<string | undefined>(product.sizeOptions?.[0]);
  const [optColor, setOptColor] = useState<string | undefined>(product.colorOptions?.[0]?.id);
  // Order bump: discounted, size-matched cooling sleeve (bottles only)
  const [bumpOn, setBumpOn] = useState(false);
  const [sleeveColor, setSleeveColor] = useState(SLEEVE_COLORS[0].id);

  const title = product.title ?? product.name;
  const price = product.price;
  const purchasable = isPurchasable(product);
  const ring = color ? RING_COLORS[color] : undefined;
  const accessoryColor = product.colorOptions?.find((c) => c.id === optColor);
  const sleeveProduct = getProduct(SLEEVE_SLUG);
  const bumpAvailable =
    isBottle(product) && Boolean(product.size) && Boolean(sleeveProduct && isPurchasable(sleeveProduct));
  const bumpActive = bumpAvailable && bumpOn;
  const sleeveColorName = SLEEVE_COLORS.find((c) => c.id === sleeveColor)?.name;

  // What "add to cart" will add — priced with the same rules as the cart.
  const pendingLines: CartLine[] =
    !purchasable
      ? []
      : product.accessory
        ? [{ slug: product.slug, quantity, color: optColor, size: optSize }]
        : [
            { slug: product.slug, quantity, color },
            ...(bumpActive
              ? [{ slug: SLEEVE_SLUG, quantity, color: sleeveColor, size: product.size, offer: "bump" as const }]
              : []),
          ];
  const pending = priceCart(pendingLines);

  function selectSize(next: Product) {
    setSlug(next.slug);
    setAdded(false);
    if (color && !next.ringColors?.includes(color)) setColor(next.ringColors?.[0]);
    // Keep the URL shareable without a full navigation.
    window.history.replaceState(null, "", `/product/${next.slug}`);
  }

  // Keep the tab title in sync with the selected size.
  useEffect(() => {
    document.title = `${product.name} – ${product.titleEn} | CU29`;
  }, [product.name, product.titleEn]);

  function add() {
    pendingLines.forEach((line) => addToCart(line));
    fpixel.addToCart({ contents: pixelContents(pending), value: pending.subtotal, name: product.name });
    setAdded(true);
  }

  /** Quick WhatsApp order = starting checkout for exactly these items. */
  function trackQuickOrder() {
    fpixel.initiateCheckout({ contents: pixelContents(pending), value: pending.total });
    fpixel.contact(pending.total);
  }

  // Meta ViewContent: on open, and again when another size is selected.
  useEffect(() => {
    fpixel.viewContent({
      id: product.slug,
      name: product.name,
      value: purchasable ? product.price : undefined,
    });
  }, [product.slug, product.name, product.price, purchasable]);

  // Sticky mobile buy bar: shown once the main CTA scrolls out above the viewport.
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const message = buildOrderMessage(pending);

  return (
    <section id="buy" className="scroll-mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-8 lg:pb-24">
        <div className="mx-auto w-full min-w-0 max-w-lg lg:sticky lg:top-32 lg:max-w-none lg:self-start">
          <Gallery
            key={product.slug}
            images={imagesBySlug[product.slug] ?? []}
            art={product.art}
            alt={product.name}
            badge={product.isComingSoon ? "בקרוב בקולקציה" : product.badge}
            placeholder={product.isComingSoon}
            ringColor={accessoryColor?.hex ?? ring?.hex}
          />
        </div>

        <div className="lg:py-4">
          <p className="text-xs tracking-[0.28em] text-copper-deep">{categoryName} · 99.9% נחושת</p>

          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.1] text-ink sm:text-5xl">
            {title}
            {product.size && product.sizeGroup && (
              <span className="whitespace-nowrap text-stone"> · {product.size}</span>
            )}
          </h1>
          <p className="mt-2 text-sm tracking-[0.2em] text-copper" dir="ltr" style={{ textAlign: "right" }}>
            {product.titleEn}
          </p>

          <a href="#reviews" className="mt-5 inline-flex items-center gap-2 text-sm text-stone hover:text-ink">
            <StarRating value={rating.average} />
            <span className="text-ink">{rating.average.toFixed(1)}/5</span>
            <span className="underline-offset-4 hover:underline">({rating.count} ביקורות)</span>
          </a>

          <div className="mt-9 flex items-baseline gap-3 border-t border-line/70 pt-9">
            {purchasable && price !== undefined ? (
              <>
                <span className="font-serif text-4xl font-light text-ink">{formatPrice(price)}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-stone line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs text-stone">כולל מע״מ</span>
              </>
            ) : (
              <span className="flex items-center gap-3">
                <span className="rounded-full bg-copper-pale/60 px-3.5 py-1 text-xs tracking-[0.1em] text-copper-deep ring-1 ring-copper/20">
                  בקרוב בקולקציה
                </span>
                <span className="text-lg font-light text-stone">השקה בקרוב</span>
              </span>
            )}
          </div>

          <p className="text-subtle mt-5 text-lg leading-8 text-ink/80">{product.shortDescription}</p>

          {product.sizeOptions && (
            <fieldset className="mt-8">
              <legend className="mb-3 text-sm text-stone">
                מידה: <span className="text-ink">{optSize}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((size) => {
                  const active = size === optSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setOptSize(size)}
                      aria-pressed={active}
                      className={`min-w-24 rounded-full border px-5 py-2.5 text-sm transition-colors ${
                        active
                          ? "border-ink bg-ink text-ivory"
                          : "border-line bg-paper/60 text-ink hover:-translate-y-0.5 hover:border-copper/60 hover:shadow-[var(--shadow-soft)]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {product.colorOptions && accessoryColor && (
            <fieldset className="mt-7">
              <legend className="mb-3 text-sm text-stone">
                צבע: <span className="text-ink">{accessoryColor.name}</span>
              </legend>
              <div className="flex gap-3">
                {product.colorOptions.map((c) => {
                  const active = c.id === optColor;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setOptColor(c.id)}
                      aria-pressed={active}
                      aria-label={c.name}
                      title={c.name}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                        active ? "border-ink" : "border-transparent hover:border-stone-muted"
                      }`}
                    >
                      <span className="h-8 w-8 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {variants.length > 1 && (
            <fieldset className="mt-8">
              <legend className="mb-3 text-sm text-stone">
                נפח: <span className="text-ink">{product.size}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const active = v.slug === product.slug;
                  return (
                    <button
                      key={v.slug}
                      type="button"
                      onClick={() => selectSize(v)}
                      aria-pressed={active}
                      className={`min-w-24 rounded-full border px-5 py-2.5 text-sm transition-colors ${
                        active
                          ? "border-ink bg-ink text-ivory"
                          : "border-line bg-paper/60 text-ink hover:-translate-y-0.5 hover:border-copper/60 hover:shadow-[var(--shadow-soft)]"
                      }`}
                    >
                      {v.size}
                      {v.price !== undefined && (
                        <span className={`ms-2 text-xs ${active ? "text-ivory/60" : "text-stone"}`}>
                          {formatPrice(v.price)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {product.ringColors && ring && (
            <fieldset className="mt-7">
              <legend className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone">
                <span>
                  צבע טבעת סיליקון: <span className="text-ink">{ring.name}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-copper-pale/60 px-3 py-1 text-xs text-copper-dark ring-1 ring-copper/20">
                  <span aria-hidden="true">🎁</span>
                  כלול במתנה (שווי {FREE_RING_VALUE} ₪)
                  <span className="text-stone">
                    <s>{FREE_RING_VALUE} ₪</s>
                  </span>
                  <strong className="font-medium text-copper-deep">חינם</strong>
                </span>
              </legend>
              <div className="flex gap-3">
                {product.ringColors.map((id) => {
                  const c = RING_COLORS[id];
                  const active = id === color;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setColor(id)}
                      aria-pressed={active}
                      aria-label={c.name}
                      title={c.name}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                        active ? "border-ink" : "border-transparent hover:border-stone-muted"
                      }`}
                    >
                      <span className="h-8 w-8 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {bumpAvailable && (
            <div
              className={`mt-6 rounded-2xl border p-4 transition-colors ${
                bumpOn ? "border-copper/50 bg-copper-pale/40" : "border-dashed border-copper/40 bg-copper-pale/20"
              }`}
            >
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink">
                <input
                  type="checkbox"
                  checked={bumpOn}
                  onChange={(e) => setBumpOn(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-copper"
                />
                <span>
                  הוסף שרוול קירור ממותג תואם מידה ב-{SLEEVE_BUMP_PRICE} ₪ בלבד{" "}
                  <span className="text-stone">
                    (במקום <s>{SLEEVE_PRICE} ₪</s>)
                  </span>
                </span>
              </label>
              {bumpOn && (
                <div className="mt-4 space-y-3 ps-7">
                  <p className="text-xs text-stone">
                    מידה: <span className="text-ink">{product.size}</span> · מותאם אוטומטית לבקבוק שבחרתם
                  </p>
                  <fieldset>
                    <legend className="mb-2 text-xs text-stone">
                      צבע השרוול: <span className="text-ink">{sleeveColorName}</span>
                    </legend>
                    <div className="flex gap-2.5">
                      {SLEEVE_COLORS.map((c) => {
                        const active = c.id === sleeveColor;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSleeveColor(c.id)}
                            aria-pressed={active}
                            aria-label={`שרוול ${c.name}`}
                            title={c.name}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                              active ? "border-ink" : "border-transparent hover:border-stone-muted"
                            }`}
                          >
                            <span className="h-7 w-7 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>
          )}

          <div ref={ctaRef} id="notify" className="mt-9 scroll-mt-40 space-y-3">
            {purchasable && price !== undefined ? (
              <>
                <div className="flex gap-3">
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                  <button
                    type="button"
                    onClick={add}
                    className="btn-copper flex-1 rounded-full px-6 text-sm tracking-[0.08em]"
                  >
                    הוספה לסל · {formatPrice(pending.subtotal)}
                  </button>
                </div>
                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackQuickOrder}
                  className="lift flex h-13 items-center justify-center gap-2 rounded-full border border-line bg-paper text-sm text-ink hover:border-[#25D366]/60"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  הזמנה מהירה בוואטסאפ
                </a>
              </>
            ) : (
              <NotifyForm productName={product.name} productSlug={product.slug} />
            )}

            {added && (
              <p role="status" className="flex items-center justify-between rounded-2xl bg-wood-light/60 px-5 py-3 text-sm text-ink">
                נוסף לסל: {product.name}
                {ring && ` · ${ring.name}`}
                {accessoryColor && ` · ${accessoryColor.name}`}
                {bumpActive && " + שרוול קירור"}
                <Link href="/cart" className="text-copper-deep underline underline-offset-4">
                  לסל ולתשלום ←
                </Link>
              </p>
            )}
          </div>

          {/* Shipping summary, linked to the shipping policy */}
          {purchasable && (
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl bg-cream/70 px-4 py-3 text-center text-xs text-stone ring-1 ring-line/60">
            <Link href="/shipping" className="underline-offset-4 hover:text-copper-deep hover:underline">
              משלוח תוך {DELIVERY_TIME}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/shipping" className="underline-offset-4 hover:text-copper-deep hover:underline">
              משלוח חינם מעל ₪{FREE_SHIPPING_THRESHOLD}
            </Link>
          </p>
          )}

          <div className="mt-8 divide-y divide-line/70 rounded-[var(--radius-card)] bg-paper/70 px-6 ring-1 ring-line/60">
            <Accordion title="על המוצר" defaultOpen>
              <div className="space-y-3">
                {product.description.map((d) => (
                  <p key={d}>{d}</p>
                ))}
              </div>
            </Accordion>
            <Accordion title="מפרט טכני">
              <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5">
                {technicalSpecs(product).map((s) =>
                  s.value ? (
                    <div key={s.label} className="contents">
                      <dt className="text-stone">{s.label}</dt>
                      <dd className="text-ink">{s.value}</dd>
                    </div>
                  ) : (
                    <div key={s.label} className="col-span-2">
                      <dt className="text-ink">{s.label}</dt>
                    </div>
                  ),
                )}
              </dl>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      {purchasable && price !== undefined && (
        <div
          className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 py-3 pe-4 ps-24 backdrop-blur transition-transform duration-300 lg:hidden ${
            showBar ? "translate-y-0" : "translate-y-full"
          }`}
          aria-hidden={!showBar}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink">
                {optSize ?? product.size ?? product.name}
                {ring && ` · ${ring.name}`}
                {accessoryColor && ` · ${accessoryColor.name}`}
                {bumpActive && " + שרוול"}
              </p>
              <p className="text-sm text-stone">{formatPrice(pending.subtotal)}</p>
            </div>
            <button
              type="button"
              onClick={add}
              tabIndex={showBar ? 0 : -1}
              className="btn-copper rounded-full px-5 py-3 text-sm"
            >
              {added ? "נוסף ✓" : "הוספה לסל"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Accordion({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-lg font-light text-copper transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-sm leading-7 text-ink/75">{children}</div>
    </details>
  );
}
