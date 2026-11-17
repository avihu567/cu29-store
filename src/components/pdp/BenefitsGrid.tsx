import BrandMark from "../BrandMark";
import type { CategoryId } from "@/lib/products";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons = {
  pure: (
    <svg viewBox="0 0 48 48" className="h-10 w-10" {...stroke}>
      <circle cx="24" cy="24" r="17" />
      <text x="24" y="28.5" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fontFamily="Georgia, serif">Cu</text>
      <text x="33" y="15" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none">29</text>
    </svg>
  ),
  water: (
    <svg viewBox="0 0 48 48" className="h-10 w-10" {...stroke}>
      <path d="M24 7c6 8 12 15 12 22a12 12 0 0 1-24 0c0-7 6-14 12-22Z" />
      <path d="M18 31a6 6 0 0 0 6 5" />
      <circle cx="34" cy="12" r="1.6" />
      <circle cx="39" cy="19" r="1.1" />
    </svg>
  ),
  balance: (
    <svg viewBox="0 0 48 48" className="h-10 w-10" {...stroke}>
      <path d="M24 8v32M14 40h20" />
      <path d="M10 16h28" />
      <path d="M10 16l-5 11a5 5 0 0 0 10 0Z" />
      <path d="M38 16l-5 11a5 5 0 0 0 10 0Z" />
      <circle cx="24" cy="8" r="1.6" />
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 48 48" className="h-10 w-10" {...stroke}>
      <path d="M14 26V13a2.5 2.5 0 0 1 5 0v10M19 22V10a2.5 2.5 0 0 1 5 0v12M24 22V11a2.5 2.5 0 0 1 5 0v12M29 23v-7a2.5 2.5 0 0 1 5 0v12c0 7-5 12-11 12h-1c-4 0-7-2-9-5l-5-8a2.5 2.5 0 0 1 4-3l2 2" />
    </svg>
  ),
  skin: (
    <svg viewBox="0 0 48 48" className="h-10 w-10" {...stroke}>
      <ellipse cx="24" cy="24" rx="17" ry="8" />
      <ellipse cx="24" cy="24" rx="11" ry="4" />
    </svg>
  ),
};

type Benefit = { icon: keyof typeof icons; title: string; text: string };

const waterBenefits: Benefit[] = [
  { icon: "pure", title: "99.9% נחושת טהורה", text: "נחושת בדרגת טוהר 99.9%, ללא ציפוי פנימי וללא לכה." },
  { icon: "water", title: "יינון וטיהור טבעי", text: "האפקט האוליגודינמי מטהר את המים ומעשיר אותם ביונים." },
  { icon: "balance", title: "איזון איורוודי", text: "טמרה ג׳לה – מים שנחו בנחושת לאיזון שלוש הדושות." },
  { icon: "hand", title: "עבודת יד אומנותית", text: "כל פריט מעוצב ומלוטש ביד, ונבדק לפני שהוא יוצא אליכם." },
];

const jewelryBenefits: Benefit[] = [
  { icon: "pure", title: "99.9% נחושת טהורה", text: "נחושת בדרגת טוהר 99.9%, ללא ציפוי וללא סגסוגות." },
  { icon: "skin", title: "מגע ישיר עם העור", text: "עונדים יום־יום ומאפשרים לגוף לפגוש את המתכת העתיקה." },
  { icon: "balance", title: "איזון איורוודי", text: "על פי המסורת, הנחושת מאזנת את שלוש הדושות." },
  { icon: "hand", title: "עבודת יד אומנותית", text: "כל צמיד מעוצב ומלוטש ביד, בעיצוב עדין ונקי." },
];

export default function BenefitsGrid({ category }: { category: CategoryId }) {
  const items = category === "jewelry" ? jewelryBenefits : waterBenefits;
  return (
    <section aria-label="יתרונות המוצר" className="px-3 sm:px-5">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-3 texture-stone rounded-[var(--radius-organic)] bg-cream p-3 sm:gap-4 sm:p-4 lg:grid-cols-4">
        {items.map((b) => (
          <li
            key={b.title}
            className="reveal lift flex flex-col items-center rounded-3xl bg-paper/70 px-4 py-12 text-center sm:px-8"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-copper-pale/70 text-copper-deep">
              {b.icon === "pure" ? (
                // The brand seal doubles as the "99.9% pure copper" stamp.
                <BrandMark logo="seal" className="h-12" />
              ) : (
                icons[b.icon]
              )}
            </span>
            <h3 className="mt-5 font-serif text-lg text-ink">{b.title}</h3>
            <p className="mt-2 max-w-[15rem] text-sm leading-6 text-stone">{b.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
