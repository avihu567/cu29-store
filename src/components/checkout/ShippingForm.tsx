"use client";

import type { ShippingDetails, ShippingErrors, ShippingField } from "@/lib/checkout";

type FieldDef = {
  name: ShippingField;
  label: string;
  autoComplete: string;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  ltr?: boolean;
  placeholder?: string;
  wide?: boolean;
};

const FIELDS: FieldDef[] = [
  { name: "firstName", label: "שם פרטי", autoComplete: "given-name" },
  { name: "lastName", label: "שם משפחה", autoComplete: "family-name" },
  { name: "phone", label: "מספר טלפון נייד", autoComplete: "tel-national", type: "tel", inputMode: "tel", ltr: true, placeholder: "050-1234567" },
  { name: "email", label: "כתובת אימייל", autoComplete: "email", type: "email", inputMode: "email", ltr: true, placeholder: "name@example.com" },
  { name: "city", label: "עיר", autoComplete: "address-level2", wide: true },
  { name: "address", label: "כתובת מדויקת", autoComplete: "street-address", placeholder: "רחוב, מספר בית, דירה/קומה", wide: true },
];

export const fieldId = (name: ShippingField) => `ship-${name}`;

const inputClass =
  "w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-stone-muted transition-colors focus:outline-none focus:ring-2 focus:ring-copper/25";

export default function ShippingForm({
  values,
  errors,
  onChange,
  onSubmit,
}: {
  values: ShippingDetails;
  errors: ShippingErrors;
  onChange: (name: ShippingField, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {FIELDS.map((f) => {
          const error = errors[f.name];
          return (
            <div key={f.name} className={f.wide ? "sm:col-span-2" : undefined}>
              <label htmlFor={fieldId(f.name)} className="mb-1.5 block text-sm text-ink">
                {f.label}
                <span className="text-copper-deep" aria-hidden="true"> *</span>
              </label>
              <input
                id={fieldId(f.name)}
                name={f.name}
                type={f.type ?? "text"}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                dir={f.ltr ? "ltr" : undefined}
                placeholder={f.placeholder}
                required
                value={values[f.name] ?? ""}
                onChange={(e) => onChange(f.name, e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${fieldId(f.name)}-error` : undefined}
                className={`${inputClass} ${f.ltr ? "text-end" : ""} ${error ? "border-red-600/70" : "border-line focus:border-copper/60"}`}
              />
              {error && (
                <p id={`${fieldId(f.name)}-error`} className="mt-1.5 text-xs text-red-700">
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <div className="sm:col-span-2">
          <label htmlFor={fieldId("notes")} className="mb-1.5 block text-sm text-ink">
            הערות לשליח <span className="text-stone">(לא חובה)</span>
          </label>
          <textarea
            id={fieldId("notes")}
            name="notes"
            rows={2}
            value={values.notes ?? ""}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="קוד לבניין, שעות נוחות למסירה…"
            className={`${inputClass} resize-none border-line focus:border-copper/60`}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-copper flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm tracking-[0.08em]"
      >
        המשך לבחירת אמצעי תשלום
        <span aria-hidden="true">←</span>
      </button>
    </form>
  );
}
