"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { isIsraeliMobile } from "@/lib/checkout";

type Field = "fullName" | "phone" | "email" | "orderNumber" | "reason";
type Values = Record<Field, string>;
const EMPTY: Values = { fullName: "", phone: "", email: "", orderNumber: "", reason: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (v.fullName.trim().length < 2) e.fullName = "נא להזין שם מלא";
  if (!isIsraeliMobile(v.phone)) e.phone = "נא להזין מספר נייד תקין (לדוגמה 050-1234567)";
  if (!EMAIL.test(v.email.trim())) e.email = "נא להזין כתובת אימייל תקינה";
  if (v.orderNumber.trim().length < 3) e.orderNumber = "נא להזין את מספר ההזמנה (לדוגמה CU29-1001)";
  return e;
}

const FIELDS: { name: Exclude<Field, "reason">; label: string; type?: string; autoComplete: string; ltr?: boolean; placeholder?: string }[] = [
  { name: "fullName", label: "שם מלא", autoComplete: "name" },
  { name: "phone", label: "טלפון נייד", type: "tel", autoComplete: "tel-national", ltr: true, placeholder: "050-1234567" },
  { name: "email", label: "אימייל", type: "email", autoComplete: "email", ltr: true, placeholder: "name@example.com" },
  { name: "orderNumber", label: "מספר הזמנה", autoComplete: "off", ltr: true, placeholder: "CU29-1001" },
];

const input =
  "w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-stone-muted focus:outline-none focus:ring-2 focus:ring-copper/25";

export default function CancelOrderForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState<{ reference: string; emailed: boolean } | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const uid = useId();
  const id = (f: Field) => `${uid}-${f}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("/api/cancel-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reference?: string;
        emailed?: boolean;
        fields?: Partial<Record<Field, string>>;
      };
      if (res.ok && data.reference) {
        setDone({ reference: data.reference, emailed: Boolean(data.emailed) });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (data.fields) {
        setErrors(data.fields);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-paper px-6 py-10 text-center ring-1 ring-line/70 sm:px-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-copper-pale/60 text-copper-deep">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl text-ink">בקשת הביטול התקבלה</h2>
        <p className="mt-3 text-stone">
          מספר אסמכתא:{" "}
          <strong className="font-medium text-ink" dir="ltr">
            {done.reference}
          </strong>
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone">
          {done.emailed ? "אישור נשלח לכתובת האימייל שהזנת. " : ""}
          נחזור אליך בהקדם עם הנחיות להחזרת המוצר. ההחזר הכספי יבוצע תוך 14 ימים מקבלת הודעת הביטול,
          בהתאם ל<Link href="/returns" className="text-copper-deep underline underline-offset-4">מדיניות הביטולים וההחזרות</Link>.
        </p>
        <p className="mt-4 text-sm text-stone">
          לשאלות:{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-copper-deep underline underline-offset-4" dir="ltr">
            {BUSINESS.email}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-5 rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-line/70 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => {
          const err = errors[f.name];
          return (
            <div key={f.name}>
              <label htmlFor={id(f.name)} className="mb-1.5 block text-sm text-ink">
                {f.label}
                <span className="text-copper-deep" aria-hidden="true">
                  {" "}
                  *
                </span>
              </label>
              <input
                id={id(f.name)}
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                dir={f.ltr ? "ltr" : undefined}
                placeholder={f.placeholder}
                required
                value={values[f.name]}
                onChange={(e) => {
                  setValues((v) => ({ ...v, [f.name]: e.target.value }));
                  if (err) setErrors((x) => ({ ...x, [f.name]: undefined }));
                }}
                aria-invalid={err ? true : undefined}
                aria-describedby={err ? `${id(f.name)}-err` : undefined}
                className={`${input} ${f.ltr ? "text-end" : ""} ${err ? "border-red-600/70" : "border-line focus:border-copper/60"}`}
              />
              {err && (
                <p id={`${id(f.name)}-err`} className="mt-1.5 text-xs text-red-700">
                  {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <label htmlFor={id("reason")} className="mb-1.5 block text-sm text-ink">
          סיבת הביטול <span className="text-stone">(לא חובה)</span>
        </label>
        <textarea
          id={id("reason")}
          name="reason"
          rows={3}
          value={values.reason}
          onChange={(e) => setValues((v) => ({ ...v, reason: e.target.value }))}
          className={`${input} resize-y border-line focus:border-copper/60`}
        />
      </div>

      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label>
          אתר
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {failed && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
          לא הצלחנו לשלוח את הבקשה. אפשר לבטל גם בדוא&quot;ל{" "}
          <a href={`mailto:${BUSINESS.email}`} dir="ltr" className="underline">
            {BUSINESS.email}
          </a>{" "}
          או בוואטסאפ{" "}
          <a href={`https://wa.me/${BUSINESS.phoneIntl}`} dir="ltr" className="underline" target="_blank" rel="noopener noreferrer">
            {BUSINESS.phone}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading || undefined}
        className="btn-copper w-full rounded-full px-8 py-4 text-sm tracking-[0.06em] disabled:opacity-70 sm:w-auto"
      >
        {loading ? "שולחים…" : "שליחת בקשת ביטול"}
      </button>
    </form>
  );
}
