"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartCount } from "@/lib/cart";
import { categories } from "@/lib/products";
import Logo from "./Logo";

const shopLinks = categories.map((c) => ({ href: `/shop#${c.id}`, label: c.name }));

export default function Header() {
  const [open, setOpen] = useState(false);
  const count = useCartCount();
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ivory/85 backdrop-blur-md">
      <div className="bg-tobacco-deep py-2 text-center text-xs tracking-[0.12em] text-copper-pale/90">
        משלוח חינם בהזמנה מעל ₪250 · הזמנות גם בוואטסאפ
      </div>
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-20 lg:px-8">
        <div className="flex items-center">
          <button
            type="button"
            className="-ms-2 p-2 text-ink lg:hidden"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>

          <nav className="hidden items-center gap-10 lg:flex" aria-label="ניווט ראשי">
            <NavLink href="/ritual">הטקס</NavLink>

            {/* Shop with hover / focus dropdown */}
            <div className="group relative">
              <NavLink href="/shop">
                חנות
                <svg className="ms-1 inline h-3 w-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 4.5l3 3 3-3" />
                </svg>
              </NavLink>
              <div className="invisible absolute start-0 top-full pt-4 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="w-64 rounded-3xl border border-line bg-paper p-2 shadow-[0_24px_50px_-20px_rgba(91,63,44,0.35)]">
                  {shopLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="block rounded-2xl px-4 py-3 text-sm text-ink/80 transition-colors hover:bg-cream hover:text-copper-deep"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-1 border-t border-line pt-1">
                    <Link href="/shop" className="block rounded-2xl px-4 py-3 text-sm text-copper-deep hover:bg-cream">
                      לכל המוצרים ←
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <NavLink href="/our-story">הסיפור שלנו</NavLink>
          </nav>
        </div>

        <Link href="/" onClick={close} aria-label="CU29 דף הבית">
          <Logo />
        </Link>

        <Link
          href="/cart"
          onClick={close}
          className="relative -me-2 flex items-center gap-2 justify-self-end p-2 text-sm text-ink/80 transition-colors hover:text-copper"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          <span className="hidden sm:inline">סל קניות</span>
          {count > 0 && (
            <span className="absolute -top-0.5 end-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1 text-[11px] font-medium text-white sm:static">
              {count}
            </span>
          )}
        </Link>
      </div>

      {open && (
        <nav className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-line bg-ivory px-4 pb-6 lg:hidden" aria-label="ניווט נייד">
          <ul className="divide-y divide-line">
            <MobileLink href="/ritual" onClick={close}>הטקס</MobileLink>
            <li className="py-4">
              <Link href="/shop" onClick={close} className="block font-serif text-xl text-ink">
                חנות
              </Link>
              <ul className="mt-3 space-y-1 border-s border-copper/30 ps-4">
                {shopLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close} className="block py-1.5 text-stone">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <MobileLink href="/our-story" onClick={close}>הסיפור שלנו</MobileLink>
            <MobileLink href="/contact" onClick={close}>צור קשר</MobileLink>
          </ul>
        </nav>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-underline py-1 text-sm tracking-[0.12em] text-ink/80 hover:text-copper-deep">
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} onClick={onClick} className="block py-4 font-serif text-xl text-ink">
        {children}
      </Link>
    </li>
  );
}
