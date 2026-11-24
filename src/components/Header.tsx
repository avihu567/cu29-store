"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartCount } from "@/lib/cart";
import { openCartDrawer } from "@/lib/cart-drawer";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import Logo from "./Logo";

const NAV = [
  { href: "/shop#bottles", label: "הבקבוקים" },
  { href: "/ritual", label: "הריטואל" },
  { href: "/contact#faq", label: "שאלות נפוצות" },
];

const MOBILE_EXTRA = [
  { href: "/shop", label: "כל המוצרים" },
  { href: "/our-story", label: "הסיפור שלנו" },
  { href: "/contact", label: "צור קשר" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const count = useCartCount();
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40">
      {/* Minimal announcement bar */}
      <div className="bg-action px-4 py-2 text-center text-[12px] font-medium tracking-[0.02em] text-white">
        משלוח חינם ברכישה מעל ₪{FREE_SHIPPING_THRESHOLD - 1} <span className="mx-2 opacity-50">|</span> 100% נחושת טהורה 99.9%
      </div>

      <div className="border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
          <div className="flex items-center">
            <button
              type="button"
              className="-ms-2 p-2 text-ink lg:hidden"
              aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
              </svg>
            </button>
            <nav className="hidden items-center gap-9 lg:flex" aria-label="ניווט ראשי">
              {NAV.map((l) => (
                <Link key={l.href} href={l.href} className="link-underline py-1 text-[15px] font-medium text-ink hover:text-action">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" onClick={close} aria-label="CU29 דף הבית">
            <Logo />
          </Link>

          <button
            type="button"
            onClick={() => {
              close();
              openCartDrawer();
            }}
            aria-label={count > 0 ? `פתיחת סל הקניות, ${count} פריטים` : "פתיחת סל הקניות"}
            className="relative -me-2 flex items-center gap-2 justify-self-end p-2 text-[15px] font-medium text-ink transition-colors hover:text-action"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            <span className="hidden sm:inline">סל</span>
            {count > 0 && (
              <span className="absolute -top-0.5 end-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-action px-1 text-[11px] font-semibold text-white sm:static">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-b border-line bg-white px-4 pb-6 lg:hidden"
          aria-label="ניווט נייד"
        >
          <ul className="divide-y divide-line">
            {[...NAV, ...MOBILE_EXTRA].map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className="block py-4 text-lg font-semibold text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
