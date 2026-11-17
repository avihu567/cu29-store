"use client";

import { useSyncExternalStore } from "react";
import { getProduct, type RingColorId } from "./products";

export interface CartLine {
  slug: string;
  quantity: number;
  /** Silicone ring color, for products that offer one. */
  color?: RingColorId;
}

const STORAGE_KEY = "cu29-cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const sameLine = (l: CartLine, slug: string, color?: RingColorId) =>
  l.slug === slug && l.color === color;

export function lineKey(l: CartLine): string {
  return l.color ? `${l.slug}:${l.color}` : l.slug;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // Drop items whose product was removed or is no longer purchasable.
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

export function addToCart(slug: string, quantity: number, color?: RingColorId) {
  load();
  const existing = lines.find((l) => sameLine(l, slug, color));
  commit(
    existing
      ? lines.map((l) =>
          sameLine(l, slug, color) ? { ...l, quantity: l.quantity + quantity } : l,
        )
      : [...lines, { slug, quantity, ...(color && { color }) }],
  );
}

export function setQuantity(slug: string, quantity: number, color?: RingColorId) {
  load();
  commit(
    quantity <= 0
      ? lines.filter((l) => !sameLine(l, slug, color))
      : lines.map((l) => (sameLine(l, slug, color) ? { ...l, quantity } : l)),
  );
}

export function clearCart() {
  commit(EMPTY);
}
