import Link from "next/link";
import type { ReactNode } from "react";
import BrandMark, { type BrandLogo } from "./BrandMark";
import LifestylePhoto from "./LifestylePhoto";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`mb-6 flex items-center gap-3 text-xs tracking-[0.32em] ${light ? "text-copper-light" : "text-copper-deep"}`}>
      <span className={`h-px w-8 ${light ? "bg-copper-light/70" : "bg-copper/70"}`} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`reveal ${center ? "mx-auto max-w-2xl text-center [&>p:first-child]:justify-center" : "max-w-2xl"}`}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2 className={`font-serif text-[2rem] font-light leading-[1.18] tracking-[0.02em] sm:text-[2.75rem] lg:text-[3.5rem] ${light ? "text-ivory" : "text-ink"}`}>
        {title}
      </h2>
      {intro && (
        <p className={`text-subtle mt-7 text-base leading-[2] sm:text-lg ${light ? "text-ivory/70" : "text-stone"}`}>{intro}</p>
      )}
    </div>
  );
}

const buttonStyles = {
  primary: "btn-copper",
  dark: "lift bg-tobacco-deep text-ivory hover:bg-tobacco",
  outline: "lift border border-ink/20 bg-paper/40 text-ink backdrop-blur-sm hover:border-copper/60 hover:bg-paper hover:text-copper-deep",
  light: "lift border border-ivory/35 bg-ivory/[0.06] text-ivory backdrop-blur-sm hover:border-copper-light/70 hover:bg-ivory/[0.12]",
  cream: "lift bg-ivory text-tobacco-deep hover:bg-paper",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-9 py-4 text-sm tracking-[0.08em] transition-all duration-300 ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/**
 * Warm editorial page header with an optional brand emblem.
 * With `image` (a lifestyle photo), it becomes a rounded photo banner with
 * a cream wash on the text side so the copy stays legible.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  emblem,
  image,
  imageAlt = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  emblem?: BrandLogo;
  image?: string;
  /** Hebrew alt text for `image`. */
  imageAlt?: string;
}) {
  if (image) {
    return (
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="window-light overflow-hidden rounded-[2rem] sm:rounded-[2.75rem]">
          <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="max-w-2xl font-serif text-4xl font-light leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
                {title}
              </h1>
              {intro && <p className="text-subtle mt-8 max-w-xl text-lg leading-9 text-ink/75">{intro}</p>}
            </div>
            <div className="relative order-1 aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-sand shadow-[0_30px_60px_-40px_rgba(91,63,44,0.6)] lg:order-2 lg:aspect-[4/5] lg:max-h-[34rem]">
              <LifestylePhoto src={image} alt={imageAlt} sizes="(min-width: 1024px) 45vw, 100vw" priority />
              {emblem && (
                <BrandMark logo={emblem} decorative className="absolute bottom-5 start-5 h-16 text-paper/90 drop-shadow" />
              )}
            </div>
          </Container>
        </div>
      </section>
    );
  }

  return (
    <section className="window-light relative overflow-hidden">
      <Container className="relative grid items-end gap-10 py-24 sm:py-36 lg:grid-cols-[1fr_auto]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="max-w-3xl font-serif text-4xl font-light leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {intro && (
            <p className="text-subtle mt-8 max-w-2xl text-lg leading-9 text-ink/70">{intro}</p>
          )}
        </div>
        {emblem && (
          <BrandMark
            logo={emblem}
            decorative
            className={`hidden text-copper/80 lg:block ${emblem === "seal" ? "h-44 animate-slow-spin" : "h-40"}`}
          />
        )}
      </Container>
    </section>
  );
}
