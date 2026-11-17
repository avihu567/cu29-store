import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import {
  TERMS_UPDATED,
  termsIntro,
  termsSections,
  termsTitle,
} from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "תקנון האתר",
  description:
    "תקנון האתר של CU29: הזמנות ותשלום, משלוחים, החלפות, ביטול עסקה והחזר כספי, אחריות, פרטיות ונגישות – בהתאם לחוק הגנת הצרכן.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title={termsTitle}
      updated={TERMS_UPDATED}
      intro={termsIntro}
      current="/terms"
      showFullTermsLink={false}
      toc={termsSections.map((s) => ({ id: s.id, label: `${s.number}. ${s.title}` }))}
    >
      {termsSections.map((s) => (
        <LegalSection key={s.id} id={s.id} heading={`${s.number}. ${s.title}`}>
          {s.body}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
