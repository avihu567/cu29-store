import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import LifestylePhoto from "@/components/LifestylePhoto";
import OrganicDivider from "@/components/OrganicDivider";
import ProductArt from "@/components/ProductArt";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/Reviews";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { getLifestyleImage } from "@/lib/lifestyle";
import { products } from "@/lib/products";

const pillars = [
  {
    title: "נחושת טהורה 99.9%",
    text: "ללא ציפוי, ללא לכה וללא סגסוגות. המים פוגשים את המתכת עצמה.",
  },
  {
    title: "חוכמה איורוודית",
    text: "טמרה ג׳לה – מים שנחו בנחושת – טקס טהרה בן למעלה מ־5,000 שנה.",
  },
  {
    title: "עבודת יד",
    text: "כל פריט מעוצב ומלוטש ביד. סימני העבודה הקטנים הם חלק מהיופי.",
  },
];

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const heroPhoto = getLifestyleImage("hero");
  const heroDetailPhoto = getLifestyleImage("hero-2");
  const philosophyPhoto = getLifestyleImage("philosophy");
  const bannerPhoto = getLifestyleImage("banner");

  return (
    <>
      {/* ───────── Hero: clean, airy, editorial ───────── */}
      <section className="overflow-hidden">
        <Container className="grid items-center gap-14 pb-20 pt-8 sm:pt-12 lg:min-h-[min(86vh,50rem)] lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:pb-24 lg:pt-6">
          {/* copy (right side in RTL) */}
          <div className="order-2 max-w-xl lg:order-1">
            <h1
              className="font-display text-[3.5rem] leading-[0.95] text-ink sm:text-[5rem] lg:text-[6.25rem]"
              dir="ltr"
              style={{ textAlign: "right" }}
            >
              Pure Flow.
              <br />
              <span className="text-copper-glow">Pure Metal.</span>
            </h1>

            <p className="text-subtle mt-8 max-w-md text-lg leading-9 text-ink/70">
              הזמנה לעצור, לנשום ולהתחבר מחדש לקצב הטבעי של הגוף. בקבוקים, מיכלי
              מים, כוסות וצמידים מנחושת טהורה, בהשראת חוכמה עתיקה.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/shop">לקולקציה</ButtonLink>
              <ButtonLink href="/ritual" variant="outline">
                גלו את הטקס
              </ButtonLink>
            </div>
          </div>

          {/* image composition (left side in RTL) */}
          <div className="relative order-1 mx-auto w-full max-w-[19rem] sm:max-w-sm lg:order-2 lg:max-w-none">
            {/* soft sand shape behind the photo */}
            <div
              className="absolute -inset-4 -z-10 translate-x-[-4%] translate-y-[5%] bg-cream sm:-inset-6"
              style={{ borderRadius: "46% 54% 42% 58% / 52% 44% 56% 48%" }}
            />
            <div className="relative aspect-[4/5] overflow-hidden bg-cream shadow-[var(--shadow-lift)]" style={{ borderRadius: "var(--radius-organic)" }}>
              {heroPhoto ? (
                <LifestylePhoto
                  src={heroPhoto}
                  alt="בקבוק נחושת CU29 ליד חלון, באור בוקר רך"
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  priority
                  tint={false}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ProductArt variant="bottle" ringColor="#9A3A06" className="h-[78%] w-auto drop-shadow-[18px_30px_28px_rgba(91,63,44,0.3)]" />
                </div>
              )}
            </div>

            {heroDetailPhoto && (
              <div className="absolute -bottom-10 -start-4 aspect-square w-36 overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-[var(--shadow-lift)] sm:-start-10 sm:w-48">
                <LifestylePhoto src={heroDetailPhoto} sizes="12rem" tint={false} />
              </div>
            )}

          </div>
        </Container>
      </section>

      {/* ───────── Philosophy ───────── */}
      <section className="py-28 sm:py-36 lg:py-44">
        <Container className="grid items-center gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-28">
          <div className="relative flex justify-center">
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-full bg-cream">
              {philosophyPhoto ? (
                <LifestylePhoto src={philosophyPhoto} sizes="(min-width: 1024px) 28rem, 90vw" />
              ) : (
                <BrandMark logo="element" decorative className="h-1/2 text-tobacco/80" />
              )}
              <span className="absolute bottom-6 end-6 rounded-full bg-paper px-5 py-2.5 text-sm text-copper-deep shadow-[0_12px_30px_-14px_rgba(91,63,44,0.4)]">
                Cu · 29 · נחושת
              </span>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="הפילוסופיה שלנו"
              title={<>חזרה אל היסודות.<br />טהרה יומיומית.</>}
              intro="בעולם מודרני שרץ קדימה, CU29 הוא ההזמנה שלך לעצור. מתוך חוכמת האיורוודה העתיקה וטהרת מתכת הנחושת, יצרנו שגרת בריאות שמעניקה צלילות, אנרגיה וחיוניות מחודשת בכל רגע."
            />
            <OrganicDivider mark={false} className="mt-14 justify-start [&>svg:last-child]:hidden" />
            <ul className="mt-10 grid gap-10 sm:grid-cols-3">
              {pillars.map((p, i) => (
                <li key={p.title} className="reveal">
                  <span className="font-serif text-2xl text-copper/70" dir="ltr">0{i + 1}</span>
                  <h3 className="mt-3 font-serif text-xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ───────── Featured products ───────── */}
      <section className="pb-28 sm:pb-40">
        <Container>
          <OrganicDivider className="mb-20 sm:mb-28" />
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="נבחרים" title="האהובים ביותר" />
            <Link href="/shop" className="text-sm text-copper-deep underline-offset-8 hover:underline">
              לכל המוצרים ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── Ritual teaser ───────── */}
      <section className="mb-28 px-3 sm:mb-40 sm:px-5">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-tobacco-deep text-ivory sm:rounded-[2.75rem]">
          {bannerPhoto && (
            <div className="absolute inset-0 -z-10">
              <LifestylePhoto src={bannerPhoto} sizes="100vw" tint={false} />
              <div className="absolute inset-0 bg-gradient-to-l from-tobacco-deep via-tobacco-deep/85 to-tobacco-deep/40" />
            </div>
          )}
          <Container className="grid items-center gap-14 py-24 sm:py-36 lg:grid-cols-2">
            <div>
              <Eyebrow light>הטקס · Tamra Jal</Eyebrow>
              <h2 className="font-serif text-4xl font-light leading-[1.1] sm:text-6xl">
                ממלאים בערב.
                <br />
                <span className="text-copper-light">שותים בבוקר.</span>
              </h2>
              <p className="mt-7 max-w-md leading-8 text-ivory/65">
                לפחות שש שעות של מגע בין המים לנחושת. זה כל הסוד. גלו את המסורת,
                את כוחה של המתכת ואת הדרך הנכונה לשמור עליה.
              </p>
              <ButtonLink href="/ritual" variant="cream" className="mt-10">
                לקריאה על הטקס
              </ButtonLink>
            </div>
            <ol className="grid gap-3 sm:grid-cols-3">
              {[
                ["ערב", "ממלאים במים נקיים"],
                ["לילה", "6–8 שעות של מנוחה"],
                ["בוקר", "כוס על בטן ריקה"],
              ].map(([t, d], i) => (
                <li key={t} className="reveal rounded-3xl bg-ivory/[0.06] p-7 ring-1 ring-ivory/10 backdrop-blur-sm transition-colors duration-500 hover:bg-ivory/[0.1] hover:ring-copper-light/30">
                  <span className="font-serif text-4xl text-copper-light" dir="ltr">{i + 1}</span>
                  <p className="mt-6 font-serif text-2xl">{t}</p>
                  <p className="mt-2 text-sm leading-6 text-ivory/55">{d}</p>
                </li>
              ))}
            </ol>
          </Container>
        </div>
      </section>

      <Reviews />
    </>
  );
}
