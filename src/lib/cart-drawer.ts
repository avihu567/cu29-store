"use client";

// Open/closed state of the slide-out cart, shared by the header, the
// product page and quick-add buttons.
import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function openCartDrawer() {
  open = true;
  emit();
}

export function closeCartDrawer() {
  open = false;
  emit();
}

export function useCartDrawerOpen(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => open,
    () => false,
  );
}
