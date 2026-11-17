// Accessibility statement — text supplied by the business. DO NOT reword:
// only formatting may be changed. Placeholders are wrapped in <Ph>.
import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import Ph from "@/components/legal/Placeholder";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description:
    "הצהרת הנגישות של CU29: רמת הנגישות באתר לפי תקן ישראלי 5568 (WCAG 2.0 ברמה AA), ההתאמות שבוצעו ופרטי רכז/ת הנגישות לפניות.",
};

const UPDATED = "17.11.2026";

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="הצהרת נגישות"
      updated={UPDATED}
      current="/accessibility"
      showFullTermsLink={false}
      intro={
        <p>
          CU29 רואה חשיבות רבה במתן שירות שוויוני לכל הלקוחות, ופועלת להנגשת האתר
          cu29ritual.com לאנשים עם מוגבלות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות,
          התשנ&quot;ח-1998, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
          התשע&quot;ג-2013.
        </p>
      }
    >
      <LegalSection id="level" heading="רמת הנגישות באתר">
        <p>
          האתר הותאם לדרישות תקן ישראלי 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA, ככל שהדבר
          ניתן.
        </p>
      </LegalSection>

      <LegalSection id="adjustments" heading="התאמות שבוצעו">
        <ul>
          <li>תמיכה בניווט באמצעות מקלדת.</li>
          <li>טקסט חלופי לתמונות.</li>
          <li>מבנה כותרות היררכי וברור.</li>
          <li>ניגודיות צבעים מספקת וגודל טקסט קריא.</li>
          <li>התאמה לתצוגה במכשירים ניידים.</li>
          <li>
            <Ph>רכיב נגישות – לעדכן אם מותקן</Ph>
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="not-accessible" heading="חלקים שאינם נגישים במלואם">
        <p>
          <Ph>לפרט אם יש, למשל: סרטונים ללא כתוביות. אם אין – למחוק סעיף זה.</Ph>
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="פנייה בנושא נגישות">
        <p>
          אם נתקלתם בבעיית נגישות באתר, נשמח שתעדכנו אותנו ונפעל לתקן אותה בהקדם:
        </p>
        <ul>
          <li>רכז/ת נגישות: אביהו חדד</li>
          <li>
            טלפון / וואטסאפ:{" "}
            <a href="tel:0503077101" dir="ltr">
              0503077101
            </a>
          </li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
