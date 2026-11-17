import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { TERMS_UPDATED, getSection } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description:
    "מדיניות הפרטיות של CU29: איזה מידע אנחנו אוספים, למה, עם מי הוא משותף, שימוש בעוגיות, דיוור בהסכמה בלבד והזכויות שלכם לפי חוק הגנת הפרטיות.",
};

export default function PrivacyPage() {
  const section = getSection("privacy");
  return (
    <LegalPage title="מדיניות פרטיות" updated={TERMS_UPDATED} current="/privacy">
      <LegalSection id={section.id} heading={`${section.number}. ${section.title}`}>
        {section.body}
      </LegalSection>
    </LegalPage>
  );
}
