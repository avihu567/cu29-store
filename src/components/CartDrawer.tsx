"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { lineKey, setQuantity, useCart } from "@/lib/cart";
import { closeCartDrawer, useCartDrawerOpen } from "@/lib/cart-drawer";
import * as fpixel from "@/lib/fpixel";
import { lineOptions, pixelContents, priceCart } from "@/lib/pricing";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { lineImage } from "@/lib/variant-images";
import ProductArt from "./ProductArt";
import QuantitySelector from "./QuantitySelector";

/** Slide-out cart (from the start/right side in RTL). */
export default function CartDrawer() {
  const open = useCartDrawerOpen();
  const cart = priceCart(useCart());
  const panelRef = useRef<HTMLDivElement>(null);
  const progress = Math.min(100, (cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCartDrawer();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div
        className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={closeCartDrawer}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="סל הקניות"
        className={`absolute inset-y-0 start-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg text-ink">סל הקניות</h2>
          <button
            type="button"
            onClick={closeCartDrawer}
            aria-label="סגירת הסל"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-paper"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-stone">הסל שלכם ריק כרגע.</p>
            <Link href="/shop" onClick={closeCartDrawer} className="btn-primary rounded-full px-8 py-3.5 text-sm">
              לבחירת הבקבוק שלך
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-3.5">
              <p className="text-xs text-ink">
                {cart.toFreeShipping > 0
                  ? `נותרו ${formatPrice(cart.toFreeShipping)} למשלוח חינם`
                  : "✓ המשלוח שלך חינם"}
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-paper" aria-hidden="true">
                <div className="h-full rounded-full bg-action transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.lines.map(({ line, product, total, freeRing }) => {
                const key = lineKey(line);
                const img = lineImage(product, line);
                return (
                  <li key={key} className="flex gap-4 py-4">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeCartDrawer}
                      className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line"
                    >
                      {img ? (
                        <Image src={img} alt={product.name} fill sizes="80px" className="object-contain" />
                      ) : (
                        <ProductArt variant={product.art} className="h-full w-auto p-2" />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-5 text-ink">{product.name}</p>
                        <p className="shrink-0 text-sm text-ink">{formatPrice(total)}</p>
                      </div>
                      {lineOptions(product, line).length > 0 && (
                        <p className="mt-0.5 text-xs text-stone">{lineOptions(product, line).join(" · ")}</p>
                      )}
                      {freeRing && <p className="mt-0.5 text-xs text-copper-deep">🎁 טבעת {freeRing} – מתנה</p>}
                      <div className="mt-2 flex items-center gap-4">
                        <QuantitySelector size="sm" value={line.quantity} onChange={(q) => setQuantity(key, q)} />
                        <button
                          type="button"
                          onClick={() => setQuantity(key, 0)}
                          className="text-xs text-stone underline-offset-4 hover:text-ink hover:underline"
                        >
                          הסרה
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-3 border-t border-line px-5 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-stone">סכום ביניים</span>
                <span className="text-ink">{formatPrice(cart.subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => {
                  fpixel.initiateCheckout({ contents: pixelContents(cart), value: cart.total });
                  closeCartDrawer();
                }}
                className="btn-primary flex w-full items-center justify-center rounded-full px-6 py-4 text-sm"
              >
                מעבר לתשלום · {formatPrice(cart.total)}
              </Link>
              <Link
                href="/cart"
                onClick={closeCartDrawer}
                className="block text-center text-xs text-stone underline-offset-4 hover:text-ink hover:underline"
              >
                לצפייה בסל המלא והזמנה בוואטסאפ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
