"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import type { RingColorId } from "@/lib/products";

export default function QuickAddButton({
  slug,
  color,
  label,
}: {
  slug: string;
  color?: RingColorId;
  label: string;
}) {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(slug, 1, color);
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
