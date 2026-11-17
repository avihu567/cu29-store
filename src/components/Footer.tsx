import Link from "next/link";
import BrandMark from "./BrandMark";
import Logo from "./Logo";
import OrganicDivider from "./OrganicDivider";
import { WHATSAPP_DISPLAY, categories, whatsappLink } from "@/lib/products";

const columns = [
  {
    title: "הטקס",
    links: [
      { href: "/ritual#ayurveda", label: "תורת האיורוודה" },
      { href: "/ritual#copper", label: "כוחה של הנחושת" },
      { href: "/ritual#care", label: "ניקוי ותחזוקה" },
      { href: "/ritual#usage", label: "הוראות שימוש" },
    ],
  },
  {
    title: "חנות",
    links: categories.map((c) => ({ href: `/shop#${c.id}`, label: c.name })),
  },
  {
    title: "הסיפור שלנו",
    links: [
      { href: "/our-story", label: "הסיפור והחזון" },
      { href: "/contact", label: "צור קשר" },
      { href: "/cart", label: "סל קניות" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto rounded-t-[2.5rem] bg-tobacco-deep text-ivory/65">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 pb-10 pt-16 sm:flex-row sm:px-8 lg:px-10">
        <p className="font-display text-center text-4xl text-ivory sm:text-start sm:text-6xl" dir="ltr">
          Pure Flow. <span className="text-copper-glow">Pure Metal.</span>
        </p>
        <BrandMark logo="seal" decorative className="h-28 animate-slow-spin text-copper-light/80" />
      </div>
      <OrganicDivider light className="mx-auto max-w-7xl px-5" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div className="space-y-5">
          <Logo light size="lg" />
          <p className="max-w-xs text-sm leading-7">
            כלים מנחושת טהורה 99.9%, בהשראת המסורת האיורוודית.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={whatsappLink("שלום CU29, אשמח לקבל פרטים")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ivory"
              >
                וואטסאפ: <span dir="ltr">{WHATSAPP_DISPLAY}</span>
              </a>
            </li>
            <li>א׳–ה׳ 9:00–18:00</li>
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-5 text-xs tracking-[0.25em] text-copper-light">{col.title}</h3>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-ivory/40 sm:flex-row sm:px-8 lg:px-10">
          <span>© CU29. כל הזכויות שמורות.</span>
          <span dir="ltr">Pure Flow. Pure Metal.</span>
        </div>
      </div>
    </footer>
  );
}
