import type { Metadata } from "next";
import BrandMark, { type BrandLogo } from "@/components/BrandMark";
import LifestylePhoto from "@/components/LifestylePhoto";
import ProductArt from "@/components/ProductArt";
import { ButtonLink, Container, Eyebrow, PageHero } from "@/components/ui";
import { getLifestyleImage } from "@/lib/lifestyle";

export const metadata: Metadata = {
  title: "הסיפור שלנו",
  description: "הסיפור והחזון של CU29 – נחושת טהורה, עבודת יד ומסורת עתיקה.",
};

const values = [
  {
    title: "טוהר",
    text: "נחושת טהורה 99.9% בלבד. אין סגסוגות, אין ציפוי פנימי ואין לכה. אם זה לא טהור, זה לא CU29.",
  },
  {
    title: "מלאכת יד",
    text: "כל כלי נוצר בידי אומנים שעובדים בנחושת דורות. סימני העבודה הקטנים הם חלק מהיופי.",
  },
  {
    title: "פשטות",
    text: "עיצוב נקי ועדין, שמתאים לבית של היום ונשאר יפה גם בעוד עשרים שנה.",
  },
];

const identity: { logo: BrandLogo; size: string; title: string; text: string; tone: string }[] = [
  {
    logo: "mark",
    size: "h-20",
    title: "הסימן",
    text: "האותיות C ו־U זורמות זו לתוך זו בקו אחד רציף – כמו מים שזורמים, ללא התחלה וללא סוף.",
    tone: "texture-stone bg-cream",
  },
  {
    logo: "element",
    size: "h-32",
    title: "היסוד",
    text: "Cu, יסוד מספר 29 בטבלה המחזורית. השם שלנו הוא פשוט המתכת עצמה – Pure Flow. Pure Metal.",
    tone: "texture-stone bg-stone-warm/70",
  },
  {
    logo: "seal",
    size: "h-36",
    title: "החותם",
    text: "99.9% נחושת טהורה. החותם שלנו הוא ההבטחה: Pure Flow. Pure Vida.",
    tone: "texture-clay",
  },
];

export default function OurStoryPage() {
  const storyPhoto = getLifestyleImage("story-2");

  return (
    <>
      <PageHero
        eyebrow="הסיפור שלנו"
        title="CU29. המספר האטומי של נחושת."
        intro="קראנו למותג על שם המתכת עצמה, כי בסוף הכול מתחיל ונגמר בה."
        emblem="element"
        image={getLifestyleImage("story")}
      />

      {/* Background */}
      <section className="py-24 sm:py-36">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          {storyPhoto ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[var(--radius-card)] bg-cream lg:max-w-none">
              <LifestylePhoto src={storyPhoto} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          ) : (
            <div className="flex items-end justify-center gap-2 rounded-[var(--radius-card)] bg-cream py-14">
              <ProductArt variant="bottle" ringColor="#9A3A06" className="h-64 w-auto drop-shadow-[10px_20px_18px_rgba(91,63,44,0.25)] sm:h-80" />
              <ProductArt variant="tumbler" className="-ms-16 h-40 w-auto drop-shadow-[10px_20px_18px_rgba(91,63,44,0.25)] sm:h-52" />
            </div>
          )}
          <div className="space-y-6 text-lg leading-9 text-ink/80">
            <Eyebrow>איך הכול התחיל</Eyebrow>
            <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
              התחלנו מבקבוק אחד
            </h2>
            <p>
              CU29 נולד מחיפוש פשוט: בקבוק נחושת אמיתי, טהור, שלא מתקלף ושלא מצופה
              מבפנים. מה שמצאנו היה בעיקר חיקויים. אז החלטנו ליצור אותו בעצמנו.
            </p>
            <p>
              היום אנחנו עובדים ישירות עם בתי מלאכה קטנים, בוחרים כל פריט בקפידה
              ובודקים אותו לפני שהוא יוצא אליכם – מבקבוקים בשלוש מידות, דרך מיכלי
              מים וכוסות, ועד צמידי נחושת עדינים.
            </p>
          </div>
        </Container>
      </section>

      {/* Brand identity: the three logo variants */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>הזהות שלנו</Eyebrow>
            <h2 className="font-serif text-3xl font-light text-ink sm:text-5xl">סימן אחד, שלושה סיפורים</h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {identity.map((item) => (
              <figure key={item.title} className={`flex flex-col items-center rounded-[var(--radius-card)] px-8 pb-9 pt-12 text-center ${item.tone}`}>
                <div className="flex h-36 items-center">
                  <BrandMark logo={item.logo} decorative className={`${item.size} text-tobacco`} />
                </div>
                <figcaption className="mt-8">
                  <p className="font-serif text-2xl text-ink">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-stone">{item.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Vision */}
      <section className="px-3 sm:px-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-tobacco-deep py-20 text-ivory sm:rounded-[2.75rem] sm:py-28">
        <BrandMark logo="seal" decorative className="pointer-events-none absolute -bottom-20 -end-16 h-80 animate-slow-spin text-copper-light/10" />
        <Container className="relative mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs tracking-[0.25em] text-copper-light">החזון שלנו</p>
          <blockquote className="font-serif text-3xl font-light leading-snug sm:text-4xl">
            להחזיר את הטקס העתיק של שתייה מנחושת אל הבית הישראלי – בכלים טהורים,
            יפים ופשוטים, שמלווים אתכם שנים.
          </blockquote>
          <p className="mx-auto mt-8 max-w-xl leading-8 text-ivory/65">
            אנחנו מאמינים שבריאות מתחילה בהרגלים קטנים. כוס מים בבוקר, מכלי
            שנבחר בכוונה, יכולה להיות הרגע השקט הראשון של היום.
          </p>
        </Container>
        </div>
      </section>

      {/* Values */}
      <section className="texture-stone mt-24 bg-cream py-24 sm:mt-36 sm:py-36">
        <Container>
          <h2 className="text-center font-serif text-3xl font-light text-ink sm:text-4xl">
            במה אנחנו מאמינים
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="text-center">
                <span className="font-serif text-5xl text-copper/40" dir="ltr">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-2xl text-ink">{v.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-stone">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/shop">לקולקציה</ButtonLink>
            <ButtonLink href="/ritual" variant="outline">לטקס</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
