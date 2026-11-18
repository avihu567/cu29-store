"use client";

import { useSyncExternalStore } from "react";
import { getProduct } from "./products";

export interface CartLine {
  slug: string;
  quantity: number;
  /** Color id: the bottle's free-ring color, or an accessory color option. */
  color?: string;
  /** Size option chosen on an accessory (e.g. the sleeve's "700 מ״ל"). */
  size?: string;
  /** "bump": added via the bottle page order bump (discounted sleeve). */
  offer?: "bump";
}

/** What identifies a line: same product + same options = same line. */
type LineIdentity = Omit<CartLine, "quantity">;

const STORAGE_KEY = "cu29-cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const sameLine = (a: LineIdentity, b: LineIdentity) =>
  a.slug === b.slug && a.color === b.color && a.size === b.size && a.offer === b.offer;

export function lineKey(l: LineIdentity): string {
  return [l.slug, l.color, l.size, l.offer].filter(Boolean).join(":");
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // Drop items whose product was removed or is no longer purchasable.
    // (Carts saved before options existed are still valid: the fields are optional.)
    if (raw)
      lines = (JSON.parse(raw) as CartLine[]).filter(
        (l) => getProduct(l.slug)?.price !== undefined,
      );
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode) — cart still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return lines;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount() {
  return useCart().reduce((sum, l) => sum + l.quantity, 0);
}

/** Add a line; merges with an existing line that has the same options. */
export function addToCart(item: CartLine) {
  load();
  const clean: CartLine = {
    slug: item.slug,
    quantity: item.quantity,
    ...(item.color && { color: item.color }),
    ...(item.size && { size: item.size }),
    ...(item.offer && { offer: item.offer }),
  };
  const existing = lines.find((l) => sameLine(l, clean));
  commit(
    existing
      ? lines.map((l) => (sameLine(l, clean) ? { ...l, quantity: l.quantity + clean.quantity } : l))
      : [...lines, clean],
  );
}

/** Set a line's quantity by its key (0 removes it). */
export function setQuantity(key: string, quantity: number) {
  load();
  commit(
    quantity <= 0
      ? lines.filter((l) => lineKey(l) !== key)
      : lines.map((l) => (lineKey(l) === key ? { ...l, quantity } : l)),
  );
}

export function clearCart() {
  commit(EMPTY);
}
