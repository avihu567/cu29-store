import type { Metadata } from "next";
import Link from "next/link";
import CancelOrderForm from "@/components/legal/CancelOrderForm";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { TERMS_UPDATED } from "@/components/legal/terms-content";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "ביטול עסקה",
  description:
    "טופס ביטול עסקה מקוון של CU29, לפי חוק הגנת הצרכן: מלאו את הפרטים וקבלו מספר אסמכתא מיד.",
};

export default function CancelOrderPage() {
  return (
    <LegalPage
      title="ביטול עסקה"
      updated={TERMS_UPDATED}
      current="/cancel-order"
      showFullTermsLink={false}
      intro={
        <p>
          לפי חוק הגנת הצרכן, התשמ&quot;א-1981, ניתן לבטל עסקה תוך 14 ימים מיום קבלת המוצר או
          מסמך פרטי העסקה, לפי המאוחר (ותוך 4 חודשים לאזרחים ותיקים, לאנשים עם מוגבלות ולעולים
          חדשים, כמפורט ב<Link href="/returns">מדיניות הביטולים וההחזרות</Link>). מלאו את הטופס
          ותקבלו מספר אסמכתא מיד.
        </p>
      }
    >
      <CancelOrderForm />

      <LegalSection id="other-ways" heading="דרכים נוספות לביטול">
        <ul>
          <li>
            בדוא&quot;ל:{" "}
            <a href={`mailto:${BUSINESS.email}`} dir="ltr">
              {BUSINESS.email}
            </a>
          </li>
          <li>
            בוואטסאפ או בטלפון:{" "}
            <a href={`https://wa.me/${BUSINESS.phoneIntl}`} target="_blank" rel="noopener noreferrer" dir="ltr">
              {BUSINESS.phone}
            </a>
          </li>
          <li>
            בדואר רשום: {BUSINESS.legalName}, {BUSINESS.address}
          </li>
        </ul>
        <p>
          החזרת מוצר שאינו פגום אפשרית רק באריזתו המקורית הסגורה, ללא שימוש וללא שמולא בנוזל
          (כלי שתייה אישיים). דמי ביטול: 5% ממחיר העסקה או 100 ₪, לפי הנמוך. ביטול בשל פגם
          או אי-התאמה – ללא דמי ביטול.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
