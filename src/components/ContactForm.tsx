"use client";

import { whatsappLink } from "@/lib/products";

const field =
  "mt-2 w-full rounded-2xl border border-line bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-stone/60 focus:border-copper";

/**
 * No backend yet: the form composes a WhatsApp message from the fields.
 * Swap the submit handler for a Server Action once an email service is wired up.
 */
export default function ContactForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = [
      "שלום CU29,",
      `שם: ${data.get("name")}`,
      data.get("phone") ? `טלפון: ${data.get("phone")}` : "",
      data.get("topic") ? `נושא: ${data.get("topic")}` : "",
      "",
      String(data.get("message") ?? ""),
    ]
      .filter((l, i) => l !== "" || i === 4)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <label className="text-sm text-ink">
        שם מלא
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-sm text-ink">
        טלפון
        <input name="phone" type="tel" autoComplete="tel" dir="ltr" className={`${field} text-right`} />
      </label>
      <label className="text-sm text-ink sm:col-span-2">
        נושא
        <select name="topic" className={field} defaultValue="">
          <option value="">בחרו נושא</option>
          <option>שאלה על מוצר</option>
          <option>הזמנה קיימת</option>
          <option>הזמנה לאירוע / מתנות</option>
          <option>אחר</option>
        </select>
      </label>
      <label className="text-sm text-ink sm:col-span-2">
        הודעה
        <textarea name="message" required rows={5} className={field} />
      </label>
      <button
        type="submit"
        className="btn-copper rounded-full px-9 py-4 text-sm tracking-[0.08em] sm:col-span-2 sm:justify-self-start"
      >
        שליחה בוואטסאפ
      </button>
    </form>
  );
}
