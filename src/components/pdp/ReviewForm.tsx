"use client";

import { useState } from "react";
import { StarIcon } from "../icons";
import { whatsappLink } from "@/lib/products";

const field =
  "mt-1.5 w-full rounded-xl border border-stone-muted bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-copper";

/**
 * No reviews backend yet: submissions are sent to CU29 on WhatsApp for
 * moderation, then added to src/lib/reviews.ts.
 */
export default function ReviewForm({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = [
      "שלום CU29, אשמח לשתף ביקורת:",
      `מוצר: ${productName}`,
      `דירוג: ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)`,
      `שם: ${data.get("name")}`,
      data.get("city") ? `עיר: ${data.get("city")}` : "",
      "",
      String(data.get("text") ?? ""),
    ]
      .filter((l, i) => l !== "" || i === 5)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lift mt-8 w-full rounded-full border border-ink/20 bg-paper px-6 py-3.5 text-sm text-ink hover:border-copper/60 hover:text-copper-deep"
      >
        כתיבת ביקורת
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-line bg-paper p-6">
      <fieldset>
        <legend className="text-sm text-ink">הדירוג שלך</legend>
        <div className="mt-2 flex gap-1" dir="ltr" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} כוכבים`}
              aria-pressed={n === rating}
              className={(hover || rating) >= n ? "text-copper" : "text-stone-muted"}
            >
              <StarIcon className="h-6 w-6" />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-ink">
          שם
          <input name="name" required autoComplete="given-name" className={field} />
        </label>
        <label className="text-sm text-ink">
          עיר
          <input name="city" autoComplete="address-level2" className={field} />
        </label>
      </div>
      <label className="block text-sm text-ink">
        הביקורת שלך
        <textarea name="text" required rows={4} className={field} />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-copper flex-1 rounded-full px-5 py-3 text-sm">
          שליחה
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-3 text-sm text-stone hover:text-ink">
          ביטול
        </button>
      </div>
      <p className="text-xs leading-5 text-stone">
        הביקורת תישלח אלינו בוואטסאפ ותפורסם לאחר אישור.
      </p>
    </form>
  );
}
