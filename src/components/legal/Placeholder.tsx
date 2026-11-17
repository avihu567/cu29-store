import type { ReactNode } from "react";

/**
 * A "[…]" placeholder in legal text that still needs to be filled in.
 * Rendered with its brackets on a yellow highlight so it's easy to spot.
 * Search the codebase for "<Ph>" to find every remaining one.
 */
export default function Ph({ children }: { children: ReactNode }) {
  return (
    <mark
      title="ממלא מקום – יש להשלים"
      className="rounded-md bg-yellow-200 px-1 py-0.5 text-ink [box-decoration-break:clone]"
    >
      [{children}]
    </mark>
  );
}
