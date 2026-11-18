// Minimal thin-line icons for the care / shine-recipe steps.
// Monochrome, stroke = currentColor (set the color on the parent).

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type IconProps = { className?: string };

export function SaltIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...stroke}>
      <path d="M16.5 19h15l2 21a2.2 2.2 0 0 1-2.2 2.4H16.7A2.2 2.2 0 0 1 14.5 40Z" />
      <path d="M17.5 19c0-5.5 2.9-9.5 6.5-9.5s6.5 4 6.5 9.5" />
      <path d="M15.6 26h16.8" opacity="0.5" />
      <circle cx="21.5" cy="14.5" r="0.6" fill="currentColor" />
      <circle cx="24" cy="12.5" r="0.6" fill="currentColor" />
      <circle cx="26.5" cy="14.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function LemonIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...stroke}>
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="11" opacity="0.6" />
      <path d="M24 13v22M13 24h22M16.2 16.2l15.6 15.6M31.8 16.2 16.2 31.8" opacity="0.6" />
      <circle cx="24" cy="24" r="1.4" />
    </svg>
  );
}

export function PolishIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...stroke}>
      {/* circular polishing motion */}
      <path d="M33 17.5A11 11 0 1 0 35 26" />
      <path d="M34.5 12.5 33 17.5l-5-1.2" />
      {/* soft cloth */}
      <path d="M10 37c4-2.5 7 1.5 11-1s7 1.5 11-1 6 1 6 1" opacity="0.6" />
    </svg>
  );
}

export function DropIcon({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...stroke}>
      <path d="M24 7.5c6.5 9 11.5 15 11.5 21.5a11.5 11.5 0 0 1-23 0c0-6.5 5-12.5 11.5-21.5Z" />
      <path d="M18.5 30.5a5.5 5.5 0 0 0 5.5 5.5" opacity="0.6" />
    </svg>
  );
}
