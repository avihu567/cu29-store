import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/Reviews";
import { GIFT_SLEEVE_THRESHOLD } from "@/lib/offers";
import { getProduct, isPurchasable, type Product } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { LIFESTYLE } from "@/lib/variant-images";

// ───────────── content ─────────────

const COLLECTION_SLUGS = [
  "copper-bottle-500ml",
  "copper-bottle-700ml",
  "copper-bottle-950ml",
  "cu29-cooling-sleeve",
  "silicone-carry-ring",
];

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const BENEFITS = [
  {
    title: "99.9% נחושת טהורה",
    text: "ללא ציפוי וללא לכה",
    icon: (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect x="6" y="6" width="20" height="20" rx="3" {...stroke} />
        <text x="16" y="20.5" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor" fontFamily="inherit">
          Cu
        </text>
      </svg>
    ),
  },
  {
    title: "איורוודה וטיהור טבעי",
    text: "מסורת מים בת אלפי שנים",
    icon: (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path d="M16 5c5 6.5 8 11 8 14.5a8 8 0 0 1-16 0C8 16 11 11.5 16 5Z" {...stroke} />
        <path d="M12.5 20.5a3.6 3.6 0 0 0 3.5 3" {...stroke} />
      </svg>
    ),
  },
  {
    title: "טבעת סיליקון מתנה",
    text: "עם כל בקבוק, בפחם או בוורוד עתיק",
    icon: (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <circle cx="11" cy="16" r="5.5" {...stroke} />
        <path d="M16.2 13.2h9.3a2.8 2.8 0 0 1 0 5.6h-9.3" {...stroke} />
      </svg>
    ),
  },
  {
    title: "משלוח מהיר עד הבית",
    text: `חינם ברכישה מעל ₪${FREE_SHIPPING_THRESHOLD - 1}`,
    icon: (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path d="M4 9h14v13H4zM18 13h5.5l4 4.5V22H18" {...stroke} />
        <circle cx="9" cy="23.5" r="2.2" {...stroke} />
        <circle cx="22.5" cy="23.5" r="2.2" {...stroke} />
      </svg>
    ),
  },
];

const RITUAL_STEPS = [
  ["ערב", "ממלאים את הבקבוק במים נקיים"],
  ["לילה", "6–8 שעות של מנוחה בנחושת"],
  ["בוקר", "כוס ראשונה על בטן ריקה"],
];

// ───────────── page ─────────────

export default function Home() {
  const collection = COLLECTION_SLUGS.map(getProduct).filter(
    (p): p is Product => Boolean(p && isPurchasable(p)),
  );

  return (
    <>
      {/* ───────── Hero: full-bleed, editorial ───────── */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-14 pt-6 sm:px-8 lg:min-h-[min(82vh,46rem)] lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:px-10 lg:py-10">
          <div className="order-2 lg:order-1">
            <p className="font-display text-sm tracking-[0.3em] text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
              THE CU RITUAL
            </p>
            <h1 className="mt-4 text-[2.6rem] text-ink sm:text-6xl lg:text-[4.25rem]">
              הריטואל היומי שלך.
              <br />
              <span className="text-copper-deep">נחושת טהורה.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-stone">
              בקבוקי נחושת טהורה 99.9%, בהשראת טקס המים האיורוודי. ממלאים בערב, שותים בבוקר – וכל לגימה
              הופכת לרגע של איזון.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="#collection" className="btn-primary inline-flex items-center justify-center rounded-full px-10 py-4 text-[15px]">
                לבחירת הבקבוק שלך
              </Link>
              <Link href="/ritual" className="link-underline text-[15px] font-medium text-ink">
                איך זה עובד?
              </Link>
            </div>
            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone">
              <span>🎁 טבעת סיליקון במתנה</span>
              <span>· משלוח חינם מעל ₪{FREE_SHIPPING_THRESHOLD - 1}</span>
              <span>· ביטול עסקה עד 14 יום</span>
            </p>
          </div>

          <div className="relative order-1 aspect-[4/3] w-full lg:order-2">
            <Image
              src={LIFESTYLE.family5.src}
              alt={LIFESTYLE.family5.alt}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ───────── 4-pillar benefit strip ───────── */}
      <section aria-label="היתרונות שלנו" className="border-b border-line bg-paper">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
          {BENEFITS.map((b) => (
            <li key={b.title} className="flex flex-col items-center gap-2.5 px-3 py-8 text-center text-ink sm:flex-row sm:text-start">
              <span className="shrink-0 text-ink">{b.icon}</span>
              <span>
                <span className="block text-[15px] font-semibold">{b.title}</span>
                <span className="block text-sm text-stone">{b.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── Product showcase ───────── */}
      <section id="collection" className="scroll-mt-32 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-copper-deep">הקולקציה</p>
              <h2 className="mt-2 text-3xl text-ink sm:text-5xl">בחרו את הבקבוק שלכם</h2>
            </div>
            <Link href="/shop" className="link-underline text-sm font-medium text-ink">
              לכל המוצרים ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3">
            {collection.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
            {/* Offer tile completes the grid */}
            <Link
              href="/shop#bottles"
              className="reveal col-span-2 flex min-h-56 flex-col justify-between rounded-2xl bg-action p-7 text-white transition-colors hover:bg-action-hover lg:col-span-1"
            >
              <span className="text-sm text-white/70">הטבה</span>
              <span>
                <span className="block text-2xl font-bold leading-tight">שרוול קירור במתנה</span>
                <span className="mt-2 block text-sm leading-6 text-white/75">
                  ברכישה מעל ₪{GIFT_SLEEVE_THRESHOLD}, יחד עם משלוח חינם וטבעת סיליקון לכל בקבוק.
                </span>
              </span>
              <span className="mt-6 text-sm font-semibold">לבחירת הבקבוק ←</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Ritual & care: editorial split ───────── */}
      <section className="border-y border-line bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-5 sm:space-y-28 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white ring-1 ring-line">
              <Image
                src={LIFESTYLE.bottleRings.src}
                alt={LIFESTYLE.bottleRings.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-copper-deep">הריטואל · Tamra Jal</p>
              <h2 className="mt-2 text-3xl text-ink sm:text-5xl">ממלאים בערב. שותים בבוקר.</h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-stone">
                במסורת האיורוודית, מים שנחו לילה שלם בכלי נחושת טהורה נחשבים מאוזנים ונקיים. הטקס
                פשוט: מספיקות כמה שעות של מגע בין המים למתכת.
              </p>
              <ol className="mt-8 grid gap-3 sm:grid-cols-3">
                {RITUAL_STEPS.map(([t, d], i) => (
                  <li key={t} className="rounded-2xl bg-paper p-5 ring-1 ring-line">
                    <span className="text-sm font-semibold text-copper-deep" dir="ltr">
                      0{i + 1}
                    </span>
                    <p className="mt-2 text-lg font-semibold text-ink">{t}</p>
                    <p className="mt-1 text-sm leading-6 text-stone">{d}</p>
                  </li>
                ))}
              </ol>
              <Link href="/ritual" className="link-underline mt-8 inline-block text-[15px] font-medium text-ink">
                לקריאה על הריטואל ←
              </Link>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white ring-1 ring-line lg:order-2">
              <Image
                src={LIFESTYLE.bottleBox.src}
                alt={LIFESTYLE.bottleBox.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="lg:order-1">
              <p className="text-sm font-medium text-copper-deep">טיפוח</p>
              <h2 className="mt-2 text-3xl text-ink sm:text-5xl">ברק טבעי, בשתי דקות.</h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-stone">
                נחושת אמיתית מתכהה עם הזמן – זה סימן לטוהר שלה. להחזרת הברק מספיקים חצי לימון ומעט מלח
                גס.
              </p>
              <ul className="mt-7 space-y-3 text-[15px] text-ink">
                {[
                  "שפשוף עדין עם חצי לימון ומלח גס",
                  "שטיפה במים פושרים וייבוש במטלית רכה",
                  "מים קרים או בטמפרטורת החדר בלבד, בלי מדיח",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/ritual#care" className="link-underline mt-8 inline-block text-[15px] font-medium text-ink">
                המדריך המלא לטיפוח ←
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Reviews />
    </>
  );
}
