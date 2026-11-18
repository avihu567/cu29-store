import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { TERMS_UPDATED, businessDetails, getSection } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "מדיניות פרטיות ואבטחת מידע",
  description:
    "מדיניות הפרטיות של CU29: איזה מידע נאסף ולמה, עוגיות ו-Meta Pixel, אי-שמירת פרטי אשראי, דיוור בהסכמה בלבד לפי חוק הספאם, והזכויות שלכם.",
};

export default function PrivacyPage() {
  const section = getSection("privacy");
  return (
    <LegalPage
      title="מדיניות פרטיות ואבטחת מידע"
      updated={TERMS_UPDATED}
      current="/privacy"
      intro={
        <>
          <p>
            מסמך זה מסביר איזה מידע אישי נאסף באתר cu29ritual.com, כיצד אנו משתמשים בו ומהן
            הזכויות שלכם.
          </p>
          {businessDetails}
        </>
      }
    >
      <LegalSection id={section.id} heading={section.title}>
        {section.body}
      </LegalSection>
    </LegalPage>
  );
}
