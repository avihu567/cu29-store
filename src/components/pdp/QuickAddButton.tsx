"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import * as fpixel from "@/lib/fpixel";

export default function QuickAddButton({
  slug,
  color,
  size,
  price,
  label,
}: {
  slug: string;
  color?: string;
  size?: string;
  /** Unit price in ILS (for the Meta AddToCart value). */
  price: number;
  label: string;
}) {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        addToCart({ slug, quantity: 1, color, size });
        fpixel.addToCart({ contents: [{ id: slug, quantity: 1, item_price: price }], value: price, name: label });
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      aria-label={`הוספה מהירה לסל: ${label}`}
      className={`w-full rounded-full border px-4 py-3 text-sm tracking-[0.06em] transition-all duration-300 ${
        added
          ? "btn-copper border-transparent"
          : "border-ink/20 bg-paper/60 text-ink hover:-translate-y-0.5 hover:border-copper/60 hover:text-copper-deep hover:shadow-[var(--shadow-soft)]"
      }`}
    >
      {added ? "נוסף לסל ✓" : "+ הוספה מהירה"}
    </button>
  );
}
