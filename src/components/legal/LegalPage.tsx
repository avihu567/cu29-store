import Link from "next/link";
import type { ReactNode } from "react";
import { Container, Eyebrow } from "../ui";

/** Shared links between the policy pages. */
export const POLICY_LINKS = [
  { href: "/terms", label: "תקנון ותנאי שימוש" },
  { href: "/returns", label: "מדיניות החזרות וביטול עסקה" },
  { href: "/cancel-order", label: "ביטול עסקה" },
  { href: "/shipping", label: "משלוחים" },
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/accessibility", label: "הצהרת נגישות" },
];

// Readable legal typography for the text body.
const prose =
  "text-[1.0625rem] leading-[1.95] text-ink/85 " +
  "[&_p]:mt-4 first:[&_p]:mt-0 " +
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:ps-6 [&_li]:ps-1 [&_li]:marker:text-copper " +
  "[&_strong]:font-medium [&_strong]:text-ink " +
  "[&_a]:text-copper-deep [&_a]:underline [&_a]:decoration-copper/40 [&_a]:underline-offset-4 hover:[&_a]:decoration-copper";

/** One policy section: numbered h2 + body. */
export function LegalSection({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-36 border-t border-line/70 pt-10 first:border-t-0 first:pt-0">
      <h2 className="text-2xl text-ink sm:text-[1.75rem]">{heading}</h2>
      <div className={`mt-5 ${prose}`}>{children}</div>
    </section>
  );
}

export default function LegalPage({
  title,
  updated,
  intro,
  toc,
  current,
  showFullTermsLink = true,
  children,
}: {
  title: string;
  updated: string;
  intro?: ReactNode;
  /** Table of contents (anchor links) shown beside the text on wide screens. */
  toc?: { id: string; label: string }[];
  /** href of this page, to mark it in the related-policies list. */
  current: string;
  showFullTermsLink?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <header className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="texture-stone bg-cream" style={{ borderRadius: "var(--radius-organic)" }}>
          <Container className="py-16 sm:py-20">
            <Eyebrow>מידע ומדיניות</Eyebrow>
            <h1 className="max-w-3xl text-3xl leading-[1.25] text-ink sm:text-5xl">{title}</h1>
            <p className="text-subtle mt-5 text-sm text-stone">עודכן לאחרונה: {updated}</p>
          </Container>
        </div>
      </header>

      <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <aside className="order-2 lg:order-1">
          <div className="space-y-8 lg:sticky lg:top-36">
            {toc && (
              <nav aria-label="תוכן העניינים">
                <p className="mb-3 text-xs tracking-[0.2em] text-copper-deep">תוכן העניינים</p>
                <ol className="space-y-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-stone transition-colors hover:text-copper-deep">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <nav aria-label="מדיניות נוספת">
              <p className="mb-3 text-xs tracking-[0.2em] text-copper-deep">מדיניות נוספת</p>
              <ul className="space-y-2 text-sm">
                {POLICY_LINKS.map((l) => (
                  <li key={l.href}>
                    {l.href === current ? (
                      <span aria-current="page" className="text-ink">
                        {l.label}
                      </span>
                    ) : (
                      <Link href={l.href} className="text-stone transition-colors hover:text-copper-deep">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <article className="order-1 max-w-3xl lg:order-2">
          {intro && <div className={`mb-12 ${prose}`}>{intro}</div>}
          <div className="space-y-10">{children}</div>

          {showFullTermsLink && (
            <p className="mt-14 rounded-3xl bg-cream/70 px-6 py-5 text-sm leading-7 text-ink/80 ring-1 ring-line/60">
              לנוסח המלא:
              <Link href="/terms" className="ms-1 text-copper-deep underline underline-offset-4">
                תקנון האתר ←
              </Link>
            </p>
          )}
        </article>
      </Container>
    </>
  );
}
