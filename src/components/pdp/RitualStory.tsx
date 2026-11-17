import Link from "next/link";
import { getLifestyleAlt, getLifestyleImage } from "@/lib/lifestyle";
import LifestylePhoto from "../LifestylePhoto";

const moments = [
  { time: "ערב", text: "ממלאים את הכלי במים נקיים" },
  { time: "לילה", text: "המים נחים בנחושת 6–8 שעות" },
  { time: "בוקר", text: "כוס ראשונה, על בטן ריקה" },
];

export default function RitualStory() {
  const photo = getLifestyleImage("trust");

  return (
    <section className="px-3 py-3 sm:px-5 sm:py-5">
      <div className="overflow-hidden rounded-[2rem] bg-tobacco-deep text-ivory sm:rounded-[2.75rem]">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-24 lg:px-8">
        <div>
          <p className="font-display text-base italic tracking-[0.2em] text-copper-light" dir="ltr" style={{ textAlign: "right" }}>
            THE RITUAL · TAMRA JAL
          </p>
          <h2 className="mt-5 font-serif text-3xl font-light leading-tight sm:text-5xl">
            טמרה ג׳לה:
            <br />
            <span className="text-copper-light">מים שנחו בנחושת.</span>
          </h2>
          <div className="mt-8 space-y-6 leading-8 text-ivory/75">
            <p>
              כבר למעלה מ־5,000 שנה, האיורוודה – ״מדע החיים״ – ממליצה לאגור מים
              בכלי נחושת למשך הלילה. המים שנוצרים כך נקראים בסנסקריט ״טמרה ג׳לה״,
              ונחשבים לטקס טהרה יומיומי המאזן את שלוש הדושות: ואטה, פיטה וקאפה.
            </p>
            <p>
              הסוד טמון במתכת עצמה. לנחושת טהורה יש תכונה טבעית שנקראת{" "}
              <strong className="font-normal text-ivory">האפקט האוליגודינמי</strong>:
              יונים זעירים של נחושת משתחררים למים ופועלים כנגד חיידקים ומיקרואורגניזמים.
              זו הסיבה שנחושת היא אחת המתכות האנטי־מיקרוביאליות הטבעיות המוכרות, ושהמים
              מקבלים מרקם משיי וטעם נקי.
            </p>
          </div>
          <Link
            href="/ritual"
            className="mt-10 inline-flex items-center gap-2 border-b border-copper-light pb-1 text-sm text-copper-light transition-colors hover:text-ivory"
          >
            לסיפור המלא של הטקס ←
          </Link>
        </div>

        <div className="self-center">
        {photo && (
          <div className="relative mx-auto mb-8 aspect-[5/4] w-full max-w-xl overflow-hidden rounded-3xl bg-tobacco lg:max-w-none">
            <LifestylePhoto src={photo} alt={getLifestyleAlt("trust")} sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        )}
        <ol className={`relative border-s border-ivory/15 ${photo ? "grid grid-cols-3 border-s-0 border-t pt-2" : ""}`}>
          {moments.map((m, i) => (
            <li key={m.time} className={`relative ${photo ? "pt-6" : "py-7 ps-10"}`}>
              <span className={`absolute h-3.5 w-3.5 rounded-full border border-copper bg-tobacco-deep ${photo ? "-top-[9px] start-0" : "-start-[7px] top-9"}`} />
              <p className="text-xs tracking-[0.25em] text-ivory/45" dir="ltr" style={{ textAlign: "right" }}>
                0{i + 1}
              </p>
              <p className="mt-2 text-2xl font-light">{m.time}</p>
              <p className="mt-1 text-sm text-ivory/60">{m.text}</p>
            </li>
          ))}
        </ol>
        </div>
      </div>
      </div>
    </section>
  );
}
