import type { ArtVariant } from "@/lib/products";

/**
 * Vector stand-ins shown until real photos are placed in
 * /public/products/<folder>/ (see ProductImage).
 */
export default function ProductArt({
  variant,
  className = "",
  ringColor,
}: {
  variant: ArtVariant;
  className?: string;
  /** Silicone ring color drawn under the bottle cap. */
  ringColor?: string;
}) {
  const id = `cu-${variant}`;
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7a4319" />
          <stop offset="0.28" stopColor="#c9834a" />
          <stop offset="0.45" stopColor="#f0c39a" />
          <stop offset="0.62" stopColor="#c27a3e" />
          <stop offset="1" stopColor="#6e3b14" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} x1="0" x2="1">
          <stop offset="0" stopColor="#5e3211" />
          <stop offset="0.5" stopColor="#a8642d" />
          <stop offset="1" stopColor="#5a300f" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor="#2a2420" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2a2420" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="238" rx="70" ry="9" fill={`url(#${id}-shadow)`} />
      <Shape variant={variant} id={id} ring={ringColor} />
    </svg>
  );
}

function Shape({ variant, id, ring }: { variant: ArtVariant; id: string; ring?: string }) {
  const body = `url(#${id}-body)`;
  const dark = `url(#${id}-dark)`;
  const shine = { fill: "#fff", opacity: 0.28 };

  switch (variant) {
    case "bottle":
      return (
        <g>
          <rect x="86" y="14" width="28" height="30" rx="5" fill={dark} />
          <path d="M88 46h24v10c14 6 22 14 22 30v128c0 12-8 20-20 20H86c-12 0-20-8-20-20V86c0-16 8-24 22-30Z" fill={body} />
          <rect x="66" y="196" width="68" height="3" fill="#4f2a0d" opacity="0.25" />
          <rect x="66" y="96" width="68" height="3" fill="#4f2a0d" opacity="0.25" />
          <rect x="84" y="104" width="6" height="86" rx="3" {...shine} />
          {ring && <rect x="84" y="38" width="32" height="8" rx="3" fill={ring} />}
        </g>
      );
    case "bottle-slim":
      return (
        <g>
          <rect x="88" y="34" width="24" height="26" rx="5" fill={dark} />
          <path d="M90 60h20v8c10 5 16 12 16 26v120c0 10-6 18-16 18H90c-10 0-16-8-16-18V94c0-14 6-21 16-26Z" fill={body} />
          <rect x="74" y="106" width="52" height="2.5" fill="#4f2a0d" opacity="0.25" />
          <rect x="88" y="114" width="5" height="90" rx="2.5" {...shine} />
          {ring && <rect x="86" y="54" width="28" height="7" rx="3" fill={ring} />}
        </g>
      );
    case "bottle-small":
      return (
        <g>
          <rect x="89" y="74" width="22" height="22" rx="4" fill={dark} />
          <path d="M91 96h18v6c9 4 14 10 14 22v90c0 9-5 18-14 18H91c-9 0-14-9-14-18v-90c0-12 5-18 14-22Z" fill={body} />
          <rect x="77" y="134" width="46" height="2.5" fill="#4f2a0d" opacity="0.25" />
          <rect x="89" y="140" width="5" height="70" rx="2.5" {...shine} />
          {ring && <rect x="87" y="91" width="26" height="6" rx="3" fill={ring} />}
        </g>
      );
    case "dispenser":
      return (
        <g>
          <ellipse cx="100" cy="34" rx="22" ry="6" fill={dark} />
          <rect x="94" y="22" width="12" height="10" rx="3" fill={dark} />
          <path d="M56 50c0-10 20-16 44-16s44 6 44 16v150c0 12-10 20-22 20H78c-12 0-22-8-22-20Z" fill={body} />
          <rect x="56" y="70" width="88" height="3" fill="#4f2a0d" opacity="0.25" />
          <rect x="56" y="190" width="88" height="3" fill="#4f2a0d" opacity="0.25" />
          <rect x="70" y="80" width="7" height="104" rx="3.5" {...shine} />
          {/* tap */}
          <rect x="140" y="168" width="20" height="9" rx="3" fill={dark} />
          <rect x="152" y="160" width="6" height="10" rx="2" fill={dark} />
          <rect x="154" y="177" width="5" height="9" rx="2" fill={dark} />
          {/* stand */}
          <path d="M66 220h68l6 12H60Z" fill={dark} />
        </g>
      );
    case "tumbler":
      return (
        <g>
          <path d="M64 90h72l-8 136c-1 6-5 9-11 9H83c-6 0-10-3-11-9Z" fill={body} />
          <ellipse cx="100" cy="90" rx="36" ry="6" fill="#5e3211" />
          <ellipse cx="100" cy="90" rx="32" ry="4.5" fill="#3e200a" />
          <path d="M80 104l5 112" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.28" />
        </g>
      );
    case "bracelet":
      return (
        <g>
          <ellipse cx="100" cy="150" rx="70" ry="34" fill="none" stroke={dark} strokeWidth="14" />
          <path d="M30 150a70 34 0 0 0 140 0" fill="none" stroke={body} strokeWidth="14" />
          <path d="M44 162a62 26 0 0 0 112 0" fill="none" stroke="#fff" strokeWidth="3" opacity="0.35" />
        </g>
      );
    case "sleeve": {
      // Copper bottle wearing a fabric cooling sleeve (color = `ring`).
      const sleeve = ring ?? "#A5A19B";
      return (
        <g>
          <rect x="86" y="14" width="28" height="30" rx="5" fill={dark} />
          <path d="M88 46h24v10c14 6 22 14 22 30v128c0 12-8 20-20 20H86c-12 0-20-8-20-20V86c0-16 8-24 22-30Z" fill={body} />
          <rect x="62" y="98" width="76" height="120" rx="16" fill={sleeve} />
          <rect x="62" y="98" width="76" height="120" rx="16" fill="#000" opacity="0.06" />
          <path d="M70 108h60M70 208h60" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.55" />
          <rect x="84" y="140" width="32" height="26" rx="3" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
          <text x="100" y="158" textAnchor="middle" fontSize="11" fontFamily="Georgia, serif" fill="#fff" opacity="0.8">CU</text>
          <rect x="72" y="104" width="6" height="104" rx="3" fill="#fff" opacity="0.18" />
        </g>
      );
    }
    case "carry-ring": {
      // Silicone carry ring: a collar with a finger loop (color = `ring`).
      const silicone = ring ?? "#25282A";
      return (
        <g>
          <ellipse cx="100" cy="92" rx="40" ry="13" fill="none" stroke={silicone} strokeWidth="13" />
          <path d="M68 100C38 150 58 212 100 214c42-2 62-64 32-114" fill="none" stroke={silicone} strokeWidth="13" strokeLinecap="round" />
          <path d="M74 112C56 150 70 198 100 200" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
          <path d="M70 86a40 13 0 0 1 60 -4" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
        </g>
      );
    }
  }
}
