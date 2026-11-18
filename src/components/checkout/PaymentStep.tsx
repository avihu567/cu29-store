"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { shippingLines, type ShippingDetails } from "@/lib/checkout";
import * as fpixel from "@/lib/fpixel";
import { buildOrderMessage, type GiftSleeveChoice, type PricedCart } from "@/lib/pricing";
import { formatPrice, whatsappLink } from "@/lib/products";
import { WhatsAppIcon } from "../icons";
import { CardIcons, LockIcon, PayPalWordmark } from "./CardIcons";
import PayPalCheckout, { type PaidOrder } from "./PayPalCheckout";

type Method = "paypal" | "card";

export default function PaymentStep({
  cart,
  shipping,
  giftSleeve,
  orderRef,
  hypEnabled,
  onPaid,
}: {
  cart: PricedCart;
  shipping: ShippingDetails;
  giftSleeve?: GiftSleeveChoice;
  orderRef: string;
  hypEnabled: boolean;
  onPaid: (order: PaidOrder, marketingOptIn: boolean) => void;
}) {
  const [method, setMethod] = useState<Method>("paypal");
  // Terms are required before any payment; marketing is optional and starts unchecked.
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [hypState, setHypState] = useState<"idle" | "loading" | "error">("idle");
  const termsRef = useRef<HTMLInputElement>(null);
  const termsId = useId();
  const marketingId = useId();
  const errorId = useId();

  const message = buildOrderMessage(cart, {
    giftSleeve,
    footer: [
      "",
      "פרטי משלוח:",
      ...shippingLines(shipping),
      "",
      `מס׳ הזמנה: ${orderRef}`,
      "✓ קראתי ואני מסכים/ה לתקנון האתר ולמדיניות הביטולים וההחזרות",
      `עדכונים ומבצעים במייל, SMS ו-WhatsApp: ${marketingOptIn ? "כן, מאשר/ת" : "לא"}`,
    ],
  });

  function requireTerms(): boolean {
    if (agreedToTerms) return true;
    setShowTermsError(true);
    termsRef.current?.focus();
    return false;
  }

  function onWhatsApp(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!requireTerms()) {
      e.preventDefault();
      return;
    }
    fpixel.contact(cart.total);
  }

  async function payWithHyp() {
    if (!requireTerms()) return;
    setHypState("loading");
    try {
      const res = await fetch("/api/payments/hyp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: cart.lines.map((l) => l.line), shipping }),
      });
      const data = (await res.json()) as { url?: string };
      if (!res.ok || !data.url) throw new Error(`HYP ${res.status}`);
      window.location.assign(data.url);
    } catch {
      setHypState("error");
    }
  }

  const option = (m: Method) =>
    `flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border bg-white px-4 py-4 text-start transition-colors sm:px-5 ${
      method === m ? "border-copper ring-1 ring-copper/40" : "border-line hover:border-copper/50"
    }`;
  const dot = (m: Method) =>
    `flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${method === m ? "border-copper" : "border-stone-muted"}`;

  return (
    <div className="space-y-6">
      {/* Payment method */}
      <div role="radiogroup" aria-label="אמצעי תשלום" className="space-y-3">
        <button type="button" role="radio" aria-checked={method === "paypal"} onClick={() => setMethod("paypal")} className={option("paypal")}>
          <span className={dot("paypal")}>{method === "paypal" && <span className="h-2.5 w-2.5 rounded-full bg-copper" />}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] text-ink">PayPal</span>
            <span className="block text-xs leading-5 text-stone">חשבון PayPal או כרטיס אשראי דרך PayPal</span>
          </span>
          <PayPalWordmark />
        </button>

        <button type="button" role="radio" aria-checked={method === "card"} onClick={() => setMethod("card")} className={option("card")}>
          <span className={dot("card")}>{method === "card" && <span className="h-2.5 w-2.5 rounded-full bg-copper" />}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] text-ink">כרטיס אשראי (מאובטח ע״י HYP)</span>
            <span className="mt-1.5 block">
              <CardIcons />
            </span>
          </span>
          <LockIcon className="h-5 w-5 shrink-0 text-stone" />
        </button>
      </div>

      {/* Consent — required before any payment */}
      <fieldset className="space-y-3 rounded-2xl bg-paper/70 px-4 py-4 text-sm leading-6 sm:px-5">
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

      {/* Method panel */}
      {method === "paypal" &&
        (agreedToTerms ? (
          <PayPalCheckout
            cart={cart}
            shipping={shipping}
            giftSleeve={giftSleeve}
            orderRef={orderRef}
            marketingOptIn={marketingOptIn}
            onPaid={(order) => onPaid(order, marketingOptIn)}
          />
        ) : (
          <button
            type="button"
            onClick={requireTerms}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-stone-muted px-6 py-4 text-sm text-stone"
          >
            <LockIcon />
            יש לאשר את התקנון כדי להציג את כפתורי התשלום
          </button>
        ))}

      {method === "card" &&
        (hypEnabled ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={payWithHyp}
              disabled={hypState === "loading"}
              className="btn-copper flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm tracking-[0.06em] disabled:opacity-60"
            >
              <LockIcon />
              {hypState === "loading" ? "מעבירים לדף התשלום המאובטח…" : `לתשלום מאובטח · ${formatPrice(cart.total)}`}
            </button>
            {hypState === "error" && (
              <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
                לא הצלחנו לפתוח את דף התשלום. נסו שוב, או שלמו ב-PayPal.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl border border-copper/30 bg-copper-pale/25 px-4 py-5 sm:px-5">
            <p className="text-sm leading-7 text-ink">
              סליקת אשראי ישירה תיפתח בקרוב. בינתיים ניתן לשלם בקלות ובבטחה באמצעות PayPal (כולל תשלום באשראי
              דרך פייפל) או להשלים הזמנה בוואטסאפ.
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => setMethod("paypal")}
                className="lift flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-3.5 text-sm text-ink"
              >
                תשלום ב-PayPal
              </button>
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsApp}
                className="lift flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm text-white"
              >
                <WhatsAppIcon />
                השלמת הזמנה בוואטסאפ
              </a>
            </div>
          </div>
        ))}

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-stone">
        <LockIcon className="h-3.5 w-3.5" />
        התשלום מתבצע בחיבור מוצפן. פרטי האשראי אינם נשמרים באתר.
      </p>
    </div>
  );
}
