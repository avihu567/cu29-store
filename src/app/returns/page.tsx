import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { TERMS_UPDATED, getSection } from "@/components/legal/terms-content";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "מדיניות ביטול עסקה, החזרות והחלפות",
  description:
    "ביטול עסקה תוך 14 יום לפי חוק הגנת הצרכן, דמי ביטול עד 5% או 100 ₪, זכות מורחבת ל-4 חודשים, תנאי היגיינה לכלי שתייה וטופס ביטול מקוון.",
};

const SECTION_IDS = ["cancellation", "hygiene", "exchange", "defective", "copper"];

export default function ReturnsPage() {
  const sections = SECTION_IDS.map(getSection);
  return (
    <LegalPage
      title="מדיניות ביטול עסקה, החזרות והחלפות"
      updated={TERMS_UPDATED}
      current="/returns"
      toc={sections.map((s) => ({ id: s.id, label: s.title }))}
      intro={
        <p className="rounded-3xl bg-copper-pale/40 px-6 py-5 ring-1 ring-copper/25">
          <strong>רוצים לבטל עסקה?</strong> הדרך המהירה ביותר היא{" "}
          <Link href="/cancel-order">טופס ביטול העסקה המקוון</Link> – תקבלו מספר אסמכתא מיד.
          אפשר גם לפנות בדוא&quot;ל{" "}
          <a href={`mailto:${BUSINESS.email}`} dir="ltr">
            {BUSINESS.email}
          </a>{" "}
          או בוואטסאפ{" "}
          <a href={`https://wa.me/${BUSINESS.phoneIntl}`} target="_blank" rel="noopener noreferrer" dir="ltr">
            {BUSINESS.phone}
          </a>
          .
        </p>
      }
    >
      {sections.map((s) => (
        <LegalSection key={s.id} id={s.id} heading={s.title}>
          {s.body}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
