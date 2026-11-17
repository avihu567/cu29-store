import BrandMark from "./BrandMark";

/**
 * A soft, hand-drawn separator: a gently wavering line that fades out at
 * both ends, with the CU mark resting in the middle. Used instead of hard
 * horizontal rules.
 */
export default function OrganicDivider({
  className = "",
  light = false,
  mark = true,
}: {
  className?: string;
  light?: boolean;
  mark?: boolean;
}) {
  const stroke = light ? "rgb(217 162 114 / 0.45)" : "rgb(184 115 51 / 0.35)";
  const id = light ? "od-fade-light" : "od-fade";

  return (
    <div className={`flex items-center justify-center gap-5 ${className}`} aria-hidden="true">
      <Wave stroke={stroke} id={`${id}-a`} />
      {mark ? (
        <BrandMark logo="mark" decorative className={`h-3.5 ${light ? "text-copper-light/70" : "text-copper/60"}`} />
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-copper-light/60" : "bg-copper/50"}`} />
      )}
      <Wave stroke={stroke} id={`${id}-b`} flip />
    </div>
  );
}

function Wave({ stroke, id, flip = false }: { stroke: string; id: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      className={`h-3 w-full max-w-[16rem] ${flip ? "-scale-x-100" : ""}`}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-m`}>
          <rect width="240" height="12" fill={`url(#${id})`} />
        </mask>
      </defs>
      <path
        d="M0 6 C 20 3, 40 9, 60 6 S 100 3, 120 6 S 160 9, 180 6 S 220 4, 240 6"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        mask={`url(#${id}-m)`}
      />
    </svg>
  );
}
