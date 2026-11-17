import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { WhatsAppIcon } from "@/components/icons";
import { Container, PageHero } from "@/components/ui";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/products";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "דברו עם CU29 בוואטסאפ, בטלפון או בטופס.",
};

const faqs = [
  {
    q: "איך אדע שהנחושת טהורה?",
    a: "כל המוצרים שלנו עשויים מנחושת 99.9% ללא ציפוי פנימי. נחושת אמיתית מתכהה עם הזמן ונוצרת עליה פטינה, וזה סימן טוב.",
  },
  {
    q: "כמה זמן לוקח משלוח?",
    a: "זמן האספקה הוא עד 5 ימי עסקים לכל רחבי הארץ. עלות משלוח 30 ₪, ומשלוח חינם בהזמנה בסך 250 ₪ ומעלה. כל הפרטים בעמוד המשלוחים.",
    href: "/shipping",
  },
  {
    q: "אפשר להחזיר מוצר?",
    a: "כן. ניתן להחליף מוצר תוך 14 ימי עסקים מיום קבלתו, ולבטל עסקה עד 14 ימים מיום קבלת המוצר, בתנאים המפורטים במדיניות ההחלפות, הביטולים וההחזרות.",
    href: "/returns",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="צור קשר"
        title="נשמח לשמוע מכם"
        intro="שאלה על מוצר, הזמנה מיוחדת או מתנה לאירוע? הדרך המהירה ביותר היא וואטסאפ."
      />

      <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-10">
          <a
            href={whatsappLink("שלום CU29, יש לי שאלה")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 rounded-[var(--radius-card)] bg-cream p-6 transition-colors hover:border-[#25D366]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-serif text-xl text-ink">וואטסאפ</span>
              <span className="text-sm text-stone" dir="ltr">{WHATSAPP_DISPLAY}</span>
            </span>
          </a>

          <dl className="space-y-6 text-sm">
            <div>
              <dt className="text-xs tracking-[0.2em] text-copper">טלפון</dt>
              <dd className="mt-1 text-ink">
                <a href={`tel:${WHATSAPP_DISPLAY.replaceAll("-", "")}`} dir="ltr">{WHATSAPP_DISPLAY}</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-copper">שעות פעילות</dt>
              <dd className="mt-1 text-ink">ימים א׳–ה׳, 9:00–18:00 · יום ו׳, 9:00–13:00</dd>
            </div>
          </dl>

          <div>
            <h2 className="mb-2 font-serif text-2xl text-ink">שאלות נפוצות</h2>
            <div className="divide-y divide-line/70 rounded-[var(--radius-card)] bg-paper/80 px-6 shadow-[var(--shadow-soft)] ring-1 ring-line/60">
              {faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-ink [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-copper transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-stone">
                    {f.a}
                    {f.href && (
                      <Link href={f.href} className="ms-1 text-copper-deep underline underline-offset-4">
                        למדיניות המלאה ←
                      </Link>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] bg-paper p-6 shadow-[0_30px_60px_-45px_rgba(91,63,44,0.6)] ring-1 ring-line sm:p-10">
          <h2 className="font-serif text-2xl text-ink">שלחו לנו הודעה</h2>
          <p className="mt-2 text-sm text-stone">ההודעה תיפתח בוואטסאפ, מוכנה לשליחה.</p>
          <ContactForm />
        </div>
      </Container>
    </>
  );
}
