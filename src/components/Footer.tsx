import Link from "next/link";
import BrandMark from "./BrandMark";
import OrganicDivider from "./OrganicDivider";
import { POLICY_LINKS } from "./legal/LegalPage";
import { BUSINESS, MEDICAL_DISCLAIMER, SUPPORT_WHATSAPP_URL } from "@/lib/business";
import { categories } from "@/lib/products";

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
  {
    title: "מידע ומדיניות",
    links: POLICY_LINKS,
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto rounded-t-[2.5rem] bg-tobacco-deep text-ivory/65">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 pb-10 pt-16 sm:flex-row sm:px-8 lg:px-10">
        <p className="font-display text-center text-4xl text-ivory sm:text-start sm:text-6xl" dir="ltr">
          Pure Flow. <span className="text-copper-glow">Pure Metal.</span>
        </p>
        <BrandMark logo="mark" className="h-16 text-ivory sm:h-20" />
      </div>
      <OrganicDivider light mark={false} className="mx-auto max-w-7xl px-5" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.15fr] lg:px-10">
        <div className="space-y-5">
          <p className="max-w-xs text-sm leading-7">
            כלים מנחושת טהורה 99.9%, בהשראת המסורת האיורוודית.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-ivory" dir="ltr">
                {BUSINESS.email}
              </a>
            </li>
            <li>
              <a href={SUPPORT_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                טלפון / וואטסאפ: <span dir="ltr">{BUSINESS.phone}</span>
              </a>
            </li>
            <li>{BUSINESS.hours}</li>
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
        <div className="mx-auto max-w-7xl space-y-3 px-5 py-7 text-center text-xs leading-6 text-ivory/55 sm:px-8 lg:px-10">
          <p>
            {BUSINESS.legalName} | {BUSINESS.idLabel} {BUSINESS.id} | {BUSINESS.address} |{" "}
            <a href={`mailto:${BUSINESS.email}`} className="hover:text-ivory" dir="ltr">
              {BUSINESS.email}
            </a>{" "}
            | <span dir="ltr">{BUSINESS.phone}</span>
          </p>
          <p className="mx-auto max-w-3xl text-ivory/45">
            <span className="text-ivory/60">גילוי נאות: </span>
            {MEDICAL_DISCLAIMER}
          </p>
          <p className="text-ivory/40">משלוחים בלבד – אין איסוף עצמי ואין קבלת קהל בכתובת העסק. © CU29. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
