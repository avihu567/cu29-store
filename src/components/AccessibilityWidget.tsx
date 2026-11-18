"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

// ───────────── settings store (localStorage, shared across pages) ─────────────

interface A11ySettings {
  /** 0 = 100%, each step +12.5% (max 4 → 150%) */
  text: number;
  contrast: boolean;
  grayscale: boolean;
  links: boolean;
  noMotion: boolean;
}

const KEY = "cu29-a11y";
const DEFAULTS: A11ySettings = { text: 0, contrast: false, grayscale: false, links: false, noMotion: false };
const MAX_TEXT = 4;

let settings: A11ySettings = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

function getSnapshot(): A11ySettings {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) settings = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<A11ySettings>) };
    } catch {
      settings = DEFAULTS;
    }
  }
  return settings;
}

function update(patch: Partial<A11ySettings>) {
  settings = { ...getSnapshot(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // storage blocked — settings still apply for this visit
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Apply the settings to <html> (classes + root font size). */
function apply(s: A11ySettings) {
  const root = document.documentElement;
  root.style.fontSize = s.text ? `${100 + s.text * 12.5}%` : "";
  root.classList.toggle("a11y-contrast", s.contrast);
  root.classList.toggle("a11y-grayscale", s.grayscale);
  root.classList.toggle("a11y-links", s.links);
  root.classList.toggle("a11y-no-motion", s.noMotion);
}

// ───────────── UI ─────────────

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-start text-sm transition-colors ${
        on ? "border-copper bg-copper-pale/50 text-ink" : "border-line bg-white text-ink hover:border-copper/60"
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-copper" : "bg-stone-muted/60"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "start-[1.125rem]" : "start-0.5"}`} />
      </span>
    </button>
  );
}

export default function AccessibilityWidget() {
  const s = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULTS);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep <html> in sync with the saved settings (also on first load).
  useEffect(() => apply(s), [s]);

  // Esc closes; focus moves into the panel on open and back to the button on close.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const changed = s.text !== 0 || s.contrast || s.grayscale || s.links || s.noMotion;

  return (
    <div className="a11y-widget fixed end-0 top-[38%] z-40 flex items-start" dir="rtl">
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="me-2 w-72 max-w-[calc(100vw-4.5rem)] rounded-2xl bg-ivory p-4 shadow-[var(--shadow-lift)] ring-1 ring-line"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 id={titleId} className="text-base text-ink">
              תפריט נגישות
            </h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="סגירת תפריט הנגישות"
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone hover:bg-cream hover:text-ink"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-3.5 py-2">
              <span className="text-sm text-ink">גודל טקסט</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => update({ text: Math.max(0, getSnapshot().text - 1) })}
                  disabled={s.text === 0}
                  aria-label="הקטנת טקסט"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink hover:border-copper disabled:opacity-40"
                >
                  א-
                </button>
                <span className="w-11 text-center text-xs text-stone" aria-live="polite">
                  {100 + s.text * 12.5}%
                </span>
                <button
                  type="button"
                  onClick={() => update({ text: Math.min(MAX_TEXT, getSnapshot().text + 1) })}
                  disabled={s.text === MAX_TEXT}
                  aria-label="הגדלת טקסט"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink hover:border-copper disabled:opacity-40"
                >
                  א+
                </button>
              </div>
            </div>
            <Toggle label="ניגודיות גבוהה" on={s.contrast} onClick={() => update({ contrast: !getSnapshot().contrast })} />
            <Toggle label="גווני אפור" on={s.grayscale} onClick={() => update({ grayscale: !getSnapshot().grayscale })} />
            <Toggle label="הדגשת קישורים" on={s.links} onClick={() => update({ links: !getSnapshot().links })} />
            <Toggle label="עצירת אנימציות" on={s.noMotion} onClick={() => update({ noMotion: !getSnapshot().noMotion })} />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => update(DEFAULTS)}
              disabled={!changed}
              className="rounded-full border border-line px-3.5 py-1.5 text-ink hover:border-copper disabled:opacity-40"
            >
              איפוס הגדרות
            </button>
            <Link href="/accessibility" onClick={() => setOpen(false)} className="text-copper-deep underline underline-offset-4">
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label="תפריט נגישות"
        title="נגישות"
        className="flex h-12 w-11 items-center justify-center rounded-s-2xl bg-tobacco-deep text-ivory shadow-lg shadow-black/15 transition-colors hover:bg-copper-deep"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
          <path d="M5 8.5c2.3.7 4.6 1 7 1s4.7-.3 7-1M12 9.5v4.5m0 0-3 6.5m3-6.5 3 6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
