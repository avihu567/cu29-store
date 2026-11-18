import { braceletUsage, careSteps } from "@/lib/care";
import { LemonIcon } from "../LineIcons";
import type { CategoryId } from "@/lib/products";

const avoid = {
  title: "מה להימנע",
  text: "אין להשתמש בחומרי ניקוי כימיים חזקים, אקונומיקה, אבקות שוחקות או ספוגיות ברזל. אין להכניס למדיח הכלים.",
};

export default function CareGuide({ category }: { category: CategoryId }) {
  const steps =
    category === "jewelry"
      ? [{ title: "ענידה וניקוי", text: braceletUsage }, careSteps[2], avoid]
      : [...careSteps, avoid];

  return (
    <section id="care" className="texture-stone scroll-mt-32 bg-cream/80 py-24 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:px-8">
        <div>
          <p className="text-xs tracking-[0.28em] text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
            CARE &amp; MAINTENANCE
          </p>
          <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-ink sm:text-4xl">
            איך לשמור על הברק הטבעי
          </h2>
          <p className="mt-6 leading-8 text-stone">
            נחושת טהורה היא מתכת חיה שנושמת ומשתנה לאורך הזמן ומפתחת פאטינה ייחודית.
            כמה דקות של טיפול עדין ישמרו עליה יפה לשנים.
          </p>
          <div className="mt-8 flex items-center gap-4 rounded-3xl bg-wood-light/50 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper text-copper-deep ring-1 ring-copper/20">
              <LemonIcon />
            </span>
            <p className="text-sm leading-6 text-ink">
              <strong className="font-normal">הנוסחה שלנו:</strong> כפית מלח + מיץ
              לימון, שפשוף עדין במטלית רכה, שטיפה וייבוש.
            </p>
          </div>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-3xl bg-cream p-7 sm:p-8">
              <span className="text-3xl font-serif font-light text-copper" dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-stone">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
