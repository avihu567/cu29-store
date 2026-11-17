import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { TERMS_UPDATED, getSection } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "החלפות, ביטולים והחזרות",
  description:
    "מדיניות ההחלפות, הביטולים וההחזרות של CU29: החלפה תוך 14 ימי עסקים, ביטול עסקה והחזר כספי לפי חוק הגנת הצרכן, וטיפול במוצר פגום.",
};

const SECTION_IDS = ["exchange", "cancellation", "defective"];

export default function ReturnsPage() {
  const sections = SECTION_IDS.map(getSection);
  return (
    <LegalPage
      title="החלפות, ביטולים והחזרות"
      updated={TERMS_UPDATED}
      current="/returns"
      toc={sections.map((s) => ({ id: s.id, label: `${s.number}. ${s.title}` }))}
    >
      {sections.map((s) => (
        <LegalSection key={s.id} id={s.id} heading={`${s.number}. ${s.title}`}>
          {s.body}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
