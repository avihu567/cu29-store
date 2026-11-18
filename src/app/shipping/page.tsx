import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/legal/LegalPage";
import { TERMS_UPDATED, getSection } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "משלוחים",
  description:
    "מדיניות המשלוחים של CU29: אספקה תוך 3–7 ימי עסקים עד הבית או לנקודת חלוקה בכל הארץ, משלוח ב-30 ₪ ומשלוח חינם בהזמנה מ-250 ₪.",
};

export default function ShippingPage() {
  const section = getSection("shipping");
  return (
    <LegalPage title="משלוחים" updated={TERMS_UPDATED} current="/shipping">
      <LegalSection id={section.id} heading={`${section.number}. ${section.title}`}>
        {section.body}
      </LegalSection>
    </LegalPage>
  );
}
