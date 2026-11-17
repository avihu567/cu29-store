import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import LifestylePhoto from "@/components/LifestylePhoto";
import ProductArt from "@/components/ProductArt";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { braceletUsage, careSteps, vesselUsage } from "@/lib/care";
import { getLifestyleAlt, getLifestyleImage } from "@/lib/lifestyle";

export const metadata: Metadata = {
  title: "הטקס",
  description:
    "טמרה ג׳לה ותורת האיורוודה, כוחה האנטי־מיקרוביאלי של הנחושת הטהורה, איך לשמור על הברק הטבעי והוראות שימוש יומיומיות.",
};

// Content source: CU29 content document, "The Ritual" page.
const chapters = [
  { id: "ayurveda", label: "תורת האיורוודה" },
  { id: "copper", label: "כוחה של הנחושת" },
  { id: "collection", label: "עולם המוצרים" },
  { id: "care", label: "הברק הטבעי" },
  { id: "usage", label: "שימוש יומיומי" },
];

const collection = [
  {
    title: "בקבוקים וכוסות",
    text: "לליווי צמוד בדרך, בעבודה או באימון, ולשתייה מודעת בבית או במשרד המעניקה מים צלולים ומרעננים.",
    art: "bottle" as const,
    href: "/shop#bottles",
    tone: "bg-cream",
  },
  {
    title: "מיכלי מים",
    text: "פריטי נוי פונקציונליים למטבח ולחלל המגורים, המהווים את לב הבית ומאפשרים אגירת מים מטוהרים לכל בני המשפחה.",
    art: "dispenser" as const,
    href: "/shop#vessels",
    tone: "bg-wood-light/70",
  },
  {
    title: "צמידי נחושת",
    text: "תכשיטי וולנס המיועדים לענידה יומיומית, ומאפשרים לגוף לספוג את תכונות המתכת העתיקה דרך מגע ישיר עם העור.",
    art: "bracelet" as const,
    href: "/shop#jewelry",
    tone: "bg-copper-pale/70",
  },
];

const shineRecipe = [
  { icon: "🧂", title: "כפית מלח", text: "מערבבים עם מיץ לימון טרי לעיסה עדינה." },
  { icon: "🍋", title: "מיץ לימון", text: "החומצה הטבעית ממיסה את כתמי החמצון." },
  { icon: "🤲", title: "שפשוף עדין", text: "במטלית רכה, בתנועות סיבוביות, מבחוץ ומבפנים." },
  { icon: "💧", title: "שטיפה וייבוש", text: "במים פושרים, וייבוש מלא במגבת רכה." },
];

const dailyRitual = [
  { time: "ערב", title: "ממלאים", text: "מים נקיים בטמפרטורת החדר – בבקבוק, בכוס או במיכל." },
  { time: "לילה", title: "נותנים לנוח", text: "לפחות 6 שעות של מגע בין המים לנחושת." },
  { time: "בוקר", title: "שותים", text: "כוס ראשונה על בטן ריקה, בנחת ובכוונה." },
  { time: "כל היום", title: "ממשיכים", text: "את שאר המים שותים לאורך היום וממלאים מחדש." },
];

function Chapter({
  index,
  en,
  title,
  subtitle,
  light = false,
}: {
  index: number;
  en: string;
  title: string;
  subtitle: string;
  light?: boolean;
}) {
  return (
    <header className="reveal max-w-3xl">
      <div className={`flex items-baseline gap-5 ${light ? "text-copper-light" : "text-copper-deep"}`}>
        <span className="font-serif text-6xl font-light leading-none sm:text-7xl" dir="ltr">
          0{index}
        </span>
        <span className="font-display text-base italic tracking-[0.18em]" dir="ltr">{en}</span>
      </div>
      <h2 className={`mt-6 font-serif text-4xl font-light leading-[1.1] sm:text-6xl ${light ? "text-ivory" : "text-ink"}`}>
        {title}
      </h2>
      <p className={`text-subtle mt-4 text-xl ${light ? "text-ivory/60" : "text-stone"}`}>{subtitle}</p>
    </header>
  );
}

export default function RitualPage() {
  const coverPhoto = getLifestyleImage("ritual");
  const ayurvedaPhoto = getLifestyleImage("ritual-2");
  const carePhoto = getLifestyleImage("ritual-3");

  return (
    <>
      {/* ───────── Cover ───────── */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="window-light relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem]">
          <Container className="grid items-center gap-12 py-24 sm:py-36 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Eyebrow>The Ritual · הטקס</Eyebrow>
              <h1 className="font-serif text-5xl font-light leading-[1.05] text-ink sm:text-7xl">
                לעצור, לנשום
                <br />
                <span className="text-copper-glow">ולהתחבר מחדש.</span>
              </h1>
              <p className="mt-10 max-w-2xl text-lg leading-9 text-ink/75 first-letter:float-right first-letter:me-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.85] first-letter:text-copper-deep">
                בעולם מודרני שרץ קדימה, <span dir="ltr">Cu29</span> הוא ההזמנה שלך
                לעצור, לנשום ולהתחבר מחדש לקצב הטבעי של הגוף. מתוך חוכמת האיורוודה
                העתיקה וטהרת מתכת הנחושת, יצרנו מרחב של שגרת בריאות המשלבת בקבוקים,
                כוסות, מכלי מים וצמידים. זו אינה רק דרך לשתות מים או לענוד תכשיט –
                זוהי חזרה אל היסודות, טהרה יומיומית שמעניקה צלילות, אנרגיה וחיוניות
                מחודשת בכל רגע מחדש.
              </p>
            </div>
            {coverPhoto ? (
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[var(--radius-card)] bg-cream">
                  <LifestylePhoto src={coverPhoto} alt={getLifestyleAlt("ritual")} sizes="(min-width: 1024px) 40vw, 100vw" priority />
                </div>
                <span className="absolute -bottom-8 start-6 flex h-32 w-32 items-center justify-center rounded-full bg-ivory shadow-[0_18px_40px_-18px_rgba(91,63,44,0.55)]">
                  <BrandMark logo="seal" decorative className="h-24 animate-slow-spin text-copper-deep" />
                </span>
              </div>
            ) : (
              <div className="hidden justify-center lg:flex">
                <BrandMark logo="seal" decorative className="h-80 animate-slow-spin text-copper/45" />
              </div>
            )}
          </Container>
        </div>
      </section>

      {/* Table of contents */}
      <nav aria-label="פרקים" className="sticky top-[6.5rem] z-20 lg:top-[7.5rem]">
        <Container className="py-4">
          <div className="flex gap-2 overflow-x-auto rounded-full bg-paper/85 p-1.5 whitespace-nowrap shadow-[0_10px_30px_-18px_rgba(91,63,44,0.5)] ring-1 ring-line backdrop-blur-md sm:w-fit">
            {chapters.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink/75 transition-colors hover:bg-cream hover:text-copper-deep"
              >
                <span className="text-xs text-copper" dir="ltr">0{i + 1}</span>
                {c.label}
              </a>
            ))}
          </div>
        </Container>
      </nav>

      {/* ───────── 01 Ayurveda · Tamra Jal ───────── */}
      <section id="ayurveda" className="scroll-mt-44 py-24 sm:py-36">
        <Container className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <div>
            <Chapter index={1} en="AYURVEDA · TAMRA JAL" title="תורת האיורוודה" subtitle="מדע החיים העתיק שמאחורי המתכת." />
            <div className="mt-10 space-y-7 text-lg leading-9 text-ink/80">
              <p>
                איורוודה (<span dir="ltr">Ayurveda</span>), שפירושה בסנסקריט הוא
                ״מדע החיים״ (<span dir="ltr">Ayur</span> = חיים,{" "}
                <span dir="ltr">Veda</span> = ידע), היא אחת משיטות הרפואה
                ההוליסטיות העתיקות ביותר בעולם, המלווה את האנושות כבר למעלה
                מ־5,000 שנה. הפילוסופיה הזו רואה באדם מיקרוקוסמוס המחובר ישירות
                לכוחות הטבע, ושמה דגש עליון על מניעה, איזון אנרגטי והרמוניה מלאה
                בין הגוף, הנפש והתודעה.
              </p>
              <p>
                במסגרת האיורוודה, השימוש בנחושת טהורה – בין אם בשתיית מים מכלי
                חרס או נחושת, ובין אם בענידת תכשיטים היוצרים מגע ישיר עם העור –
                נחשב לטקס טהרה הכרחי. המים שנחים בכלי נחושת למשך הלילה נקראים
                בסנסקריט <strong className="font-normal text-copper-deep">״טמרה ג׳לה״</strong>.
                התורה מלמדת שהנחושת מזינה את הגוף באנרגיה עדינה המאזנת את שלוש
                הדושות, מעודדת חיוניות ומחברת אותנו שוב אל קצב הטבע הגולמי.
              </p>
            </div>
          </div>

          <aside className={`space-y-5 ${ayurvedaPhoto ? "lg:pt-6" : "lg:pt-40"}`}>
            {ayurvedaPhoto && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-cream">
                <LifestylePhoto src={ayurvedaPhoto} alt={getLifestyleAlt("ritual-2")} sizes="(min-width: 1024px) 35vw, 100vw" />
              </div>
            )}
            <blockquote className="rounded-[var(--radius-card)] bg-cream p-9 font-serif text-2xl font-light leading-[1.5] text-ink">
              ״הנחושת מזינה את הגוף באנרגיה עדינה, ומחברת אותנו שוב אל קצב הטבע.״
              <footer className="mt-5 font-sans text-xs tracking-[0.25em] text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
                TAMRA JAL
              </footer>
            </blockquote>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["ואטה", "Vata", "אוויר ואתר"],
                ["פיטה", "Pitta", "אש ומים"],
                ["קאפה", "Kapha", "אדמה ומים"],
              ].map(([he, en, el]) => (
                <div key={en} className="rounded-3xl bg-paper px-2 py-7 ring-1 ring-line">
                  <p className="font-serif text-2xl text-ink">{he}</p>
                  <p className="mt-1 text-[11px] tracking-[0.2em] text-copper" dir="ltr">{en}</p>
                  <p className="mt-3 text-xs text-stone">{el}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-stone">שלוש הדושות – האנרגיות הפיזיולוגיות של הגוף</p>
          </aside>
        </Container>
      </section>

      {/* ───────── 02 Copper · antimicrobial ───────── */}
      <section id="copper" className="scroll-mt-44 px-3 sm:px-5">
        <div className="overflow-hidden rounded-[2rem] bg-tobacco-deep text-ivory sm:rounded-[2.75rem]">
          <Container className="grid items-center gap-16 py-24 sm:py-36 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Chapter light index={2} en="THE POWER OF PURE COPPER" title="כוחה של הנחושת הטהורה" subtitle="טבע גולמי, אנרגיה טהורה ובריאות מתמשכת." />
              <div className="mt-10 space-y-7 text-lg leading-9 text-ivory/75">
                <p>
                  נחושת טהורה (<span dir="ltr">Cu29</span>) היא מתכת חיים בעלת
                  תכונות פיזיקליות וביולוגיות יוצאות דופן. בבקבוקים ובכוסות היא
                  יוצרת את <strong className="font-normal text-copper-light">״האפקט האוליגודינמי״</strong> –
                  טיהור טבעי של המים מחיידקים והעשרתם ביונים חיוניים. במיכלי מים
                  גדולים לבית היא מרכזת סביבה את טקס השתייה המשפחתי, ובצמידים היא
                  מעניקה מגע ישיר עם העור.
                </p>
                <p>
                  מים המאוחסנים בכלי נחושת מקבלים מרקם משיי וטעם נקי, בעוד שהשימוש
                  במוצרים נוספים מרחיב את הטקס לכל שעות היום.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex aspect-[5/4] flex-col items-center justify-center rounded-[var(--radius-card)] bg-ivory/[0.05] ring-1 ring-ivory/10 sm:col-span-2 lg:col-span-1">
                <span className="text-sm tracking-[0.3em] text-copper-light" dir="ltr">29</span>
                <span className="text-copper-glow font-serif text-8xl sm:text-9xl" dir="ltr">Cu</span>
                <span className="mt-2 text-sm tracking-[0.2em] text-ivory/50">נחושת · Copper</span>
              </div>
              {[
                ["אוליגודינמי", "יוני נחושת זעירים פועלים כנגד חיידקים ומיקרואורגניזמים במים."],
                ["אנטי־מיקרוביאלי", "תכונה טבעית של המתכת, ללא כימיקלים וללא תוספים."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-3xl bg-ivory/[0.05] p-6 ring-1 ring-ivory/10">
                  <p className="font-serif text-xl text-copper-light">{t}</p>
                  <p className="mt-2 text-sm leading-6 text-ivory/60">{d}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ───────── 03 Collection ───────── */}
      <section id="collection" className="scroll-mt-44 py-24 sm:py-36">
        <Container>
          <Chapter index={3} en="THE CU COLLECTION" title="הטקס היומיומי שלך" subtitle="שגרת בריאות שלמה מבוססת נחושת." />
          <p className="mt-8 max-w-3xl text-lg leading-9 text-ink/80">
            הסדרה שלנו נועדה להשתלב באופן טבעי בכל רגע ביום שלך:
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {collection.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className={`reveal group flex flex-col overflow-hidden rounded-[var(--radius-card)] ${c.tone} ring-1 ring-transparent transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] hover:ring-copper/35`}
              >
                <div className="flex h-60 items-center justify-center">
                  <ProductArt variant={c.art} className="h-48 w-auto drop-shadow-[10px_20px_18px_rgba(91,63,44,0.25)] transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex-1 px-8 pb-8">
                  <h3 className="font-serif text-2xl text-ink">{c.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone">{c.text}</p>
                  <span className="mt-6 inline-block text-sm text-copper-deep">לגלות ←</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── 04 Care: natural shine ───────── */}
      <section id="care" className="scroll-mt-44 px-3 sm:px-5">
        <div className="texture-stone bg-cream" style={{ borderRadius: "var(--radius-organic)" }}>
          <Container className="py-24 sm:py-36">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <div>
                <Chapter index={4} en="CARE & MAINTENANCE" title="איך לשמור על הברק הטבעי" subtitle="שומרים על הברק הטבעי של המתכת." />
                <p className="mt-8 text-lg leading-9 text-ink/80">
                  נחושת טהורה היא מתכת חיה שנושמת ומשתנה לאורך הזמן, מה שמעניק לכל
                  פריט מראה ייחודי ואותנטי (פאטינה). כדי לשמור על ההיגיינה והמראה של
                  המוצרים:
                </p>
                <ol className="mt-10 space-y-4">
                  {careSteps.map((s, i) => (
                    <li key={s.title} className="reveal lift flex gap-5 rounded-3xl bg-paper p-6 ring-1 ring-line/70 hover:ring-copper/30">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-copper font-serif text-lg text-paper">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-serif text-xl text-ink">{s.title}</h3>
                        <p className="mt-1.5 text-sm leading-7 text-stone">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-5 self-center">
              {carePhoto && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-sand">
                  <LifestylePhoto src={carePhoto} alt={getLifestyleAlt("ritual-3")} sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
              )}
              <div className="rounded-[2rem] bg-paper p-8 shadow-[0_30px_60px_-40px_rgba(91,63,44,0.6)] sm:p-10">
                <p className="text-xs tracking-[0.28em] text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
                  THE SHINE RECIPE
                </p>
                <h3 className="mt-4 font-serif text-3xl font-light text-ink">לימון ומלח: הנוסחה העתיקה</h3>
                <ul className="mt-8 grid grid-cols-2 gap-3">
                  {shineRecipe.map((r, i) => (
                    <li key={r.title} className="rounded-3xl bg-cream/70 p-5">
                      <span className="text-3xl" aria-hidden="true">{r.icon}</span>
                      <p className="mt-3 text-xs text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
                        שלב {i + 1}
                      </p>
                      <p className="font-serif text-lg text-ink">{r.title}</p>
                      <p className="mt-1 text-xs leading-5 text-stone">{r.text}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-2xl bg-clay/10 px-5 py-4 text-sm leading-6 text-tobacco">
                  <strong className="font-medium">להימנע:</strong> מדיח כלים, ספוגיות ברזל
                  וחומרי ניקוי כימיים חזקים.
                </p>
              </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ───────── 05 Daily usage ───────── */}
      <section id="usage" className="scroll-mt-44 py-24 sm:py-36">
        <Container>
          <Chapter index={5} en="HOW TO USE YOUR COPPERWARE" title="שימוש יומיומי נכון" subtitle="הדרך הנכונה למקסם את החוויה." />

          <ol className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dailyRitual.map((d, i) => (
              <li key={d.time} className="reveal lift relative rounded-[var(--radius-card)] bg-paper p-8 ring-1 ring-line/70 hover:ring-copper/30">
                <span className="rounded-full bg-cream px-3 py-1 text-xs text-copper-deep">{d.time}</span>
                <p className="mt-8 font-serif text-5xl font-light text-copper/60" dir="ltr">{i + 1}</p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{d.title}</h3>
                <p className="mt-2 text-sm leading-7 text-stone">{d.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="flex gap-6 rounded-[var(--radius-card)] bg-cream p-8">
              <ProductArt variant="bottle-slim" ringColor="#25282A" className="h-36 w-auto shrink-0" />
              <div>
                <h3 className="font-serif text-2xl text-ink">למיכלי מים, בקבוקים וכוסות</h3>
                <p className="mt-3 leading-8 text-ink/75">{vesselUsage}</p>
              </div>
            </div>
            <div className="flex gap-6 rounded-[var(--radius-card)] bg-copper-pale/60 p-8">
              <ProductArt variant="bracelet" className="h-36 w-auto shrink-0" />
              <div>
                <h3 className="font-serif text-2xl text-ink">לצמידי הנחושת</h3>
                <p className="mt-3 leading-8 text-ink/75">{braceletUsage}</p>
              </div>
            </div>
          </div>

          <p className="mt-10 max-w-3xl text-xs leading-6 text-stone">
            המידע בעמוד זה מבוסס על המסורת האיורוודית ומוגש לצורכי העשרה בלבד. הוא
            אינו מהווה ייעוץ רפואי ואינו מחליף התייעצות עם איש מקצוע.
          </p>
        </Container>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="px-3 pb-16 sm:px-5">
        <div className="flex flex-col items-center rounded-[2rem] bg-copper-deep px-6 py-20 text-center text-ivory sm:rounded-[2.75rem]">
          <BrandMark logo="mark" decorative className="h-10 text-ivory/80" />
          <h2 className="mt-8 font-serif text-4xl font-light sm:text-5xl">מוכנים להתחיל?</h2>
          <p className="mt-4 max-w-md text-ivory/75">כל מה שצריך זה כלי אחד מנחושת טהורה, ולילה אחד.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop#bottles" variant="cream">לבקבוקי הנחושת</ButtonLink>
            <ButtonLink href="/product/copper-water-vessel-4l" variant="light">למיכל 4 ליטר</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
