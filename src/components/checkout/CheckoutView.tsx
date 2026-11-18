"use client";

import { useRef, useState } from "react";
import { clearCart, useCart, useGiftSleevePick } from "@/lib/cart";
import {
  cleanShipping,
  EMPTY_SHIPPING,
  newOrderRef,
  validateShipping,
  type ShippingDetails,
  type ShippingErrors,
  type ShippingField,
} from "@/lib/checkout";
import * as fpixel from "@/lib/fpixel";
import { pixelContents, priceCart, resolveGiftSleeve } from "@/lib/pricing";
import { ButtonLink } from "../ui";
import { LockIcon } from "./CardIcons";
import OrderConfirmation, { type ConfirmedOrder } from "./OrderConfirmation";
import OrderSummary from "./OrderSummary";
import PaymentStep from "./PaymentStep";
import ShippingForm, { fieldId } from "./ShippingForm";

type Step = "shipping" | "payment";

function StepBadge({ n, done, active }: { n: number; done: boolean; active: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
        done ? "bg-copper-deep text-ivory" : active ? "bg-copper text-ivory" : "bg-sand text-stone"
      }`}
      aria-hidden="true"
    >
      {done ? "✓" : n}
    </span>
  );
}

export default function CheckoutView({
  images,
  hypEnabled,
}: {
  images: Record<string, string | undefined>;
  hypEnabled: boolean;
}) {
  const cart = priceCart(useCart());
  const gift = resolveGiftSleeve(cart, useGiftSleevePick());
  const giftSleeve = gift?.active ? { size: gift.size, colorName: gift.colorName } : undefined;

  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingDetails>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [orderRef, setOrderRef] = useState("");
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);
  const paymentRef = useRef<HTMLElement>(null);

  if (confirmed) return <OrderConfirmation order={confirmed} />;

  if (cart.lines.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-start gap-6 border-t border-line pt-12">
        <p className="text-stone">הסל שלכם ריק כרגע.</p>
        <ButtonLink href="/shop">להתחלת קנייה</ButtonLink>
      </div>
    );
  }

  function updateField(name: ShippingField, value: string) {
    const next = { ...shipping, [name]: value };
    setShipping(next);
    // Once a field shows an error, re-check it live so the message clears as soon as it's fixed.
    if (errors[name]) {
      const fieldError = validateShipping(next)[name];
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  }

  function continueToPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateShipping(shipping);
    setErrors(found);
    const first = (Object.keys(found) as ShippingField[])[0];
    if (first) {
      document.getElementById(fieldId(first))?.focus();
      return;
    }
    setShipping(cleanShipping(shipping));
    if (!orderRef) setOrderRef(newOrderRef());
    setStep("payment");
    requestAnimationFrame(() => paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function handlePaid(order: { orderId: string; captureId?: string }) {
    fpixel.purchase({ contents: pixelContents(cart), value: cart.total, orderId: order.orderId });
    setConfirmed({ ...order, orderRef, shipping, cart, giftSleeve });
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const unlocked = step === "payment";

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.45fr] lg:gap-12">
      {/* Order summary first: top on mobile, first (right) column on desktop */}
      <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <OrderSummary cart={cart} gift={gift} images={images} />
      </div>

      <div className="min-w-0 space-y-6">
        {/* Step 1 — shipping */}
        <section
          aria-labelledby="step-shipping"
          className="rounded-[var(--radius-card)] bg-paper/80 p-5 shadow-[var(--shadow-soft)] ring-1 ring-line/60 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 id="step-shipping" className="flex items-center gap-3 font-serif text-2xl text-ink">
              <StepBadge n={1} done={unlocked} active={!unlocked} />
              פרטי משלוח
            </h2>
            {unlocked && (
              <button
                type="button"
                onClick={() => setStep("shipping")}
                className="text-xs text-stone underline-offset-4 hover:text-copper hover:underline"
              >
                עריכה
              </button>
            )}
          </div>

          {unlocked ? (
            <address className="space-y-1 text-sm not-italic leading-6 text-stone">
              <p className="text-ink">
                {shipping.firstName} {shipping.lastName}
              </p>
              <p>
                {shipping.address}, {shipping.city}
              </p>
              <p>
                <span dir="ltr">{shipping.phone}</span> · <span dir="ltr">{shipping.email}</span>
              </p>
              {shipping.notes && <p>הערות לשליח: {shipping.notes}</p>}
            </address>
          ) : (
            <ShippingForm values={shipping} errors={errors} onChange={updateField} onSubmit={continueToPayment} />
          )}
        </section>

        {/* Step 2 — payment */}
        <section
          ref={paymentRef}
          aria-labelledby="step-payment"
          className={`scroll-mt-28 rounded-[var(--radius-card)] p-5 ring-1 sm:p-8 ${
            unlocked ? "bg-paper/80 shadow-[var(--shadow-soft)] ring-line/60" : "bg-paper/40 ring-line/40"
          }`}
        >
          <h2 id="step-payment" className={`flex items-center gap-3 font-serif text-2xl ${unlocked ? "text-ink" : "text-stone"}`}>
            <StepBadge n={2} done={false} active={unlocked} />
            תשלום
          </h2>

          {unlocked ? (
            <div className="mt-6">
              <PaymentStep
                cart={cart}
                shipping={shipping}
                giftSleeve={giftSleeve}
                orderRef={orderRef}
                hypEnabled={hypEnabled}
                onPaid={handlePaid}
              />
            </div>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-sm text-stone">
              <LockIcon className="h-4 w-4 shrink-0" />
              יש למלא את כל פרטי המשלוח כדי להמשיך לתשלום
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
