"use client";

import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import type { ShippingDetails } from "@/lib/checkout";
import { buildPayPalOrder, PAYPAL_CLIENT_ID } from "@/lib/payments/paypal";
import type { GiftSleeveChoice, PricedCart } from "@/lib/pricing";

export interface PaidOrder {
  /** PayPal order ID. */
  orderId: string;
  /** PayPal capture (transaction) ID. */
  captureId?: string;
}

function ScriptStatus() {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  if (isRejected) {
    return (
      <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
        לא הצלחנו לטעון את PayPal. נסו לרענן את העמוד, או השלימו את ההזמנה בוואטסאפ.
      </p>
    );
  }
  if (!isPending) return null;
  return (
    <div className="space-y-2.5" aria-busy="true" aria-label="טוען את PayPal">
      <div className="h-12 animate-pulse rounded-full bg-sand/60" />
      <div className="h-12 animate-pulse rounded-full bg-sand/40" />
    </div>
  );
}

export default function PayPalCheckout({
  cart,
  shipping,
  giftSleeve,
  orderRef,
  marketingOptIn,
  onPaid,
}: {
  cart: PricedCart;
  shipping: ShippingDetails;
  giftSleeve?: GiftSleeveChoice;
  orderRef: string;
  marketingOptIn: boolean;
  onPaid: (order: PaidOrder) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: "ILS",
        intent: "capture",
        locale: "he_IL",
        components: "buttons",
      }}
    >
      <div className="space-y-3">
        <ScriptStatus />
        {processing && (
          <p role="status" className="rounded-2xl bg-paper px-4 py-3 text-center text-sm text-ink">
            מאשרים את התשלום… נא לא לסגור את העמוד.
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
            {error}
          </p>
        )}
        <div className={processing ? "pointer-events-none opacity-40" : undefined}>
          <PayPalButtons
            style={{ layout: "vertical", shape: "pill", color: "black", label: "pay", height: 48 }}
            forceReRender={[cart.total, orderRef, marketingOptIn, giftSleeve?.size, giftSleeve?.colorName]}
            createOrder={async (_data, actions) => {
              setError(null);
              const args = { cart, shipping, giftSleeve, orderRef, marketingOptIn };
              try {
                return await actions.order.create(buildPayPalOrder(args));
              } catch (err) {
                // Fallback: PayPal may reject the local address format — retry
                // without the shipping block (the address goes in the description).
                console.warn("[paypal] create with shipping failed, retrying without it", err);
                return actions.order.create(buildPayPalOrder({ ...args, withShipping: false }));
              }
            }}
            onApprove={async (data, actions) => {
              setProcessing(true);
              try {
                if (!actions.order) throw new Error("No order actions");
                const details = await actions.order.capture();
                const capture = details.purchase_units?.[0]?.payments?.captures?.[0];
                if (details.status !== "COMPLETED" || (capture && capture.status === "DECLINED")) {
                  throw new Error(`Capture status ${details.status}/${capture?.status}`);
                }
                onPaid({ orderId: details.id ?? data.orderID, captureId: capture?.id });
              } catch (err) {
                setProcessing(false);
                if (String(err).includes("INSTRUMENT_DECLINED")) {
                  setError("אמצעי התשלום נדחה. נא לבחור אמצעי תשלום אחר בחלון של PayPal.");
                  return actions.restart();
                }
                console.error("[paypal] capture failed", err);
                setError("התשלום לא הושלם ולא חויבתם. אפשר לנסות שוב או להשלים את ההזמנה בוואטסאפ.");
              }
            }}
            onCancel={() => setError("התשלום בוטל. ההזמנה שמורה — אפשר לנסות שוב בכל רגע.")}
            onError={(err) => {
              console.error("[paypal]", err);
              setProcessing(false);
              setError("אירעה שגיאה בחיבור ל-PayPal. נסו שוב בעוד רגע, או השלימו את ההזמנה בוואטסאפ.");
            }}
          />
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
