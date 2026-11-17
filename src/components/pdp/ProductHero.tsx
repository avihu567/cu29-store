"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addToCart } from "@/lib/cart";
import {
  RING_COLORS,
  formatPrice,
  orderMessage,
  whatsappLink,
  type Product,
  type RingColorId,
} from "@/lib/products";
import { WhatsAppIcon } from "../icons";
import QuantitySelector from "../QuantitySelector";
import Gallery from "./Gallery";
import StarRating from "./StarRating";

export const FREE_SHIPPING_FROM = 250;

interface Props {
  /** Size variants of the product family (or just the product itself). */
  variants: Product[];
  initialSlug: string;
  imagesBySlug: Record<string, string[]>;
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

  const title = product.title ?? product.name;
  const price = product.price;
  const ring = color ? RING_COLORS[color] : undefined;

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
    addToCart(product.slug, quantity, color);
    setAdded(true);
  }

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

  const message = orderMessage([{ product, quantity, color }], [
    price !== undefined ? `סה״כ: ${formatPrice(price * quantity)}` : "",
  ].filter(Boolean));

  return (
    <section id="buy" className="scroll-mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-8 lg:pb-24">
        <div className="mx-auto w-full max-w-lg lg:sticky lg:top-32 lg:max-w-none lg:self-start">
          <Gallery
            key={product.slug}
            images={imagesBySlug[product.slug] ?? []}
            art={product.art}
            alt={product.name}
            badge={product.badge}
            ringColor={ring?.hex}
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
            {price !== undefined ? (
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
              <span className="text-2xl font-light text-copper-deep">בקרוב</span>
            )}
          </div>

          <p className="text-subtle mt-5 text-lg leading-8 text-ink/80">{product.shortDescription}</p>

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
              <legend className="mb-3 text-sm text-stone">
                צבע טבעת סיליקון: <span className="text-ink">{ring.name}</span>
                <span className="ms-2 text-xs text-stone" dir="ltr">{ring.pantone}</span>
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
                      aria-label={`${c.name} (${c.pantone})`}
                      title={`${c.name} · ${c.pantone}`}
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

          <div ref={ctaRef} className="mt-9 space-y-3">
            {price !== undefined ? (
              <>
                <div className="flex gap-3">
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                  <button
                    type="button"
                    onClick={add}
                    className="btn-copper flex-1 rounded-full px-6 text-sm tracking-[0.08em]"
                  >
                    הוספה לסל · {formatPrice(price * quantity)}
                  </button>
                </div>
                <a
                  href={whatsappLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift flex h-13 items-center justify-center gap-2 rounded-full border border-line bg-paper text-sm text-ink hover:border-[#25D366]/60"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  הזמנה מהירה בוואטסאפ
                </a>
              </>
            ) : (
              <a
                href={whatsappLink(`שלום CU29, אשמח לקבל עדכון כשהמוצר "${product.name}" יהיה זמין`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-copper flex h-13 items-center justify-center gap-2 rounded-full text-sm"
              >
                <WhatsAppIcon className="h-5 w-5" />
                עדכנו אותי כשיגיע
              </a>
            )}

            {added && (
              <p role="status" className="flex items-center justify-between rounded-2xl bg-wood-light/60 px-5 py-3 text-sm text-ink">
                נוסף לסל: {product.name}
                {ring && ` · ${ring.name}`}
                <Link href="/cart" className="text-copper-deep underline underline-offset-4">
                  לסל ולתשלום ←
                </Link>
              </p>
            )}
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-stone">
            {[
              ["משלוח חינם", `מעל ₪${FREE_SHIPPING_FROM}`],
              ["החזרה קלה", "תוך 14 יום"],
              ["אחריות", "שנה מלאה"],
            ].map(([a, b]) => (
              <li key={a} className="rounded-2xl bg-cream/80 px-2 py-4 ring-1 ring-line/60">
                <span className="block text-ink">{a}</span>
                {b}
              </li>
            ))}
          </ul>

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
                {product.specs.map((s) => (
                  <div key={s.label} className="contents">
                    <dt className="text-stone">{s.label}</dt>
                    <dd className="text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      {price !== undefined && (
        <div
          className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 py-3 pe-4 ps-24 backdrop-blur transition-transform duration-300 lg:hidden ${
            showBar ? "translate-y-0" : "translate-y-full"
          }`}
          aria-hidden={!showBar}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink">
                {product.size ?? product.name}
                {ring && ` · ${ring.name}`}
              </p>
              <p className="text-sm text-stone">{formatPrice(price * quantity)}</p>
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
