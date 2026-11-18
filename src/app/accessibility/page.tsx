// Accessibility statement (Israeli Standard 5568 / WCAG 2.0 AA), updated on
// the business's instructions (Nov 2026).
import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description:
    "הצהרת הנגישות של CU29: התאמה לתקן ישראלי 5568 (WCAG 2.0 ברמה AA), תפריט נגישות, ניווט במקלדת, תמיכה בקוראי מסך ופרטי רכז הנגישות.",
};

const UPDATED = "18.11.2026";

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="הצהרת נגישות"
      updated={UPDATED}
      current="/accessibility"
      showFullTermsLink={false}
      intro={
        <p>
          CU29 ({BUSINESS.legalName}, {BUSINESS.idLabel} {BUSINESS.id}) רואה חשיבות רבה במתן
          שירות שוויוני, מכבד ונגיש לכל הלקוחות, ופועלת להנגשת האתר cu29ritual.com לאנשים עם
          מוגבלות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998, ולתקנות שוויון
          זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013.
        </p>
      }
    >
      <LegalSection id="level" heading="רמת הנגישות באתר">
        <p>
          האתר הותאם לדרישות תקן ישראלי 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA. האתר נבדק
          בדפדפנים הנפוצים (Chrome, Safari, Edge, Firefox) ובמכשירים ניידים.
        </p>
      </LegalSection>

      <LegalSection id="adjustments" heading="התאמות הנגישות שבוצעו">
        <ul>
          <li>
            <strong>ניווט במקלדת:</strong> ניתן לנווט בכל האתר באמצעות מקש Tab ו-Shift+Tab,
            להפעיל קישורים וכפתורים ב-Enter ולסגור חלונות ב-Esc. מיקוד המקלדת מסומן בבירור.
          </li>
          <li>
            <strong>תמיכה בקוראי מסך:</strong> מבנה כותרות היררכי, תגיות ARIA ותוויות לשדות
            טפסים, טקסט חלופי לתמונות, והודעות שגיאה ואישור המוקראות אוטומטית.
          </li>
          <li>
            <strong>תפריט נגישות:</strong> בכל עמוד יש כפתור נגישות קבוע בצד המסך, המאפשר: הגדלה
            והקטנה של הטקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים ועצירת אנימציות, וכן
            איפוס ההגדרות. ההגדרות נשמרות בדפדפן לביקורים הבאים.
          </li>
          <li>
            <strong>ניגודיות וגופנים:</strong> צבעי טקסט ורקע בניגודיות מספקת, גופן קריא, ותמיכה
            בהגדלת התצוגה בדפדפן עד 200% ללא אובדן תוכן.
          </li>
          <li>
            <strong>טפסים נגישים:</strong> לכל שדה תווית ברורה, ושגיאות מוצגות בטקסט ליד השדה.
          </li>
          <li>
            <strong>התאמה לנייד:</strong> האתר רספונסיבי ומותאם לשימוש במסכי מגע.
          </li>
          <li>
            <strong>הפחתת תנועה:</strong> האתר מכבד את הגדרת &quot;הפחתת תנועה&quot; של מערכת
            ההפעלה.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="limits" heading="חלקים שייתכן שאינם נגישים במלואם">
        <p>
          אנו ממשיכים לבדוק ולשפר את נגישות האתר. ייתכן שחלק מהרכיבים של צדדים שלישיים המוטמעים
          באתר (כגון חלון התשלום של PayPal) אינם בשליטתנו המלאה ואינם נגישים במלואם. אם נתקלתם
          בקושי, נשמח לסייע בהשלמת ההזמנה בטלפון, בוואטסאפ או בדוא&quot;ל.
        </p>
      </LegalSection>

      <LegalSection id="physical" heading="נגישות פיזית">
        <p>
          העסק פועל באופן מקוון בלבד, והמוצרים נשלחים עד הבית או לנקודת חלוקה. אין קבלת קהל
          פיזית ואין איסוף עצמי בכתובת העסק ({BUSINESS.address}).
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="פנייה בנושא נגישות">
        <p>אם נתקלתם בבעיית נגישות באתר, נשמח שתעדכנו אותנו ונפעל לתקן אותה בהקדם:</p>
        <ul>
          <li>רכז הנגישות: {BUSINESS.coordinator}</li>
          <li>
            טלפון / וואטסאפ:{" "}
            <a href={`tel:${BUSINESS.phone.replaceAll("-", "")}`} dir="ltr">
              {BUSINESS.phone}
            </a>
          </li>
          <li>
            דוא&quot;ל:{" "}
            <a href={`mailto:${BUSINESS.email}`} dir="ltr">
              {BUSINESS.email}
            </a>
          </li>
        </ul>
        <p>בפנייה, אנא ציינו את העמוד שבו נתקלתם בבעיה ותיאור קצר שלה. נחזור אליכם בהקדם.</p>
      </LegalSection>
    </LegalPage>
  );
}
