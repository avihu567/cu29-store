"use client";

import { useId, useState } from "react";
import { whatsappLink } from "@/lib/products";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Israeli phone: 05x-xxxxxxx / 0x-xxxxxxx / +972…, dashes and spaces allowed
const PHONE = /^(\+972|0)[\d\s-]{8,12}$/;

/**
 * "Notify me at launch" form for coming-soon products.
 *
 * There is no mailing backend yet, so the signup is handed to CU29 via a
 * pre-filled WhatsApp message (the same channel as orders and the contact
 * form). To collect signups automatically, replace `submit` with a call to
 * a mailing service or a Server Action.
 */
export default function NotifyForm({ productName }: { productName: string }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const inputId = useId();
  const errorId = useId();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const contact = value.trim();
    if (!EMAIL.test(contact) && !PHONE.test(contact)) {
      setError(true);
      return;
    }
    window.open(
      whatsappLink(
        `שלום CU29, אשמח לקבל עדכון כשהמוצר "${productName}" יושק.\nפרטי קשר: ${contact}`,
      ),
      "_blank",
      "noopener,noreferrer",
    );
    setDone(true);
  }

  if (done) {
    return (
      <p
        role="status"
        className="rounded-2xl bg-copper-pale/45 px-5 py-4 text-sm leading-7 text-ink ring-1 ring-copper/20"
      >
        תודה! נעדכן אותך ברגע שהפריט ינחת באתר.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="texture-stone rounded-[var(--radius-card)] bg-cream/80 p-5 ring-1 ring-line/60 sm:p-6"
    >
      <label htmlFor={inputId} className="block text-sm leading-7 text-ink">
        הקולקציה בייצור מוקפד. השאירו מייל או טלפון ונעדכן אתכם ראשונים עם ההשקה:
      </label>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <input
          id={inputId}
          type="text"
          inputMode="email"
          autoComplete="email"
          required
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          placeholder="מייל או טלפון"
          aria-invalid={error || undefined}
          aria-describedby={error ? errorId : undefined}
          className={`min-w-0 flex-1 rounded-full border bg-paper px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-stone/60 focus:border-copper ${
            error ? "border-red-600" : "border-line"
          }`}
        />
        <button type="submit" className="btn-copper shrink-0 rounded-full px-7 py-3 text-sm tracking-[0.06em]">
          עדכנו אותי
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 ps-2 text-xs text-red-700">
          נא להזין כתובת מייל או מספר טלפון תקינים.
        </p>
      )}
      <p className="mt-3 ps-2 text-xs text-stone/80">הפרטים יישלחו אלינו בהודעת וואטסאפ.</p>
    </form>
  );
}
