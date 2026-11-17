// Brand logos from public/products/LOGO/, cropped into public/brand/ by
// `npm run logos`. Rendered as CSS masks so they take the text color
// (copper, ink, cream…) instead of the source black.

const LOGOS = {
  /** Primary logo: the CU monogram. */
  mark: { src: "/brand/cu29-mark.png", ratio: 422 / 250, label: "CU29" },
  /** Round seal: "99.9% PURE COPPER · PURE FLOW. PURE VIDA." */
  seal: { src: "/brand/cu29-seal.png", ratio: 421 / 415, label: "CU29 – 99.9% Pure Copper" },
  /** Periodic-table tile: "CU 29 · PURE FLOW. PURE METAL." */
  element: { src: "/brand/cu29-element.png", ratio: 378 / 333, label: "CU29 – Pure Flow. Pure Metal." },
} as const;

export type BrandLogo = keyof typeof LOGOS;

export default function BrandMark({
  logo = "mark",
  className = "h-8",
  decorative = false,
}: {
  logo?: BrandLogo;
  /** Set a height (e.g. h-8); width follows the logo's aspect ratio. */
  className?: string;
  decorative?: boolean;
}) {
  const { src, ratio, label } = LOGOS[logo];
  const mask = `url("${src}") center / contain no-repeat`;
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ aspectRatio: ratio, mask, WebkitMask: mask }}
    />
  );
}
