// Small, neutral card-brand badges for the credit-card payment option.
const badge = "h-6 w-10 shrink-0 rounded-[5px] bg-white ring-1 ring-line/80";

export function VisaIcon() {
  return (
    <svg viewBox="0 0 40 24" className={badge} role="img" aria-label="Visa">
      <text x="20" y="16.5" textAnchor="middle" fontSize="10.5" fontWeight="800" fontStyle="italic" fill="#1A1F71" fontFamily="Arial, sans-serif">
        VISA
      </text>
    </svg>
  );
}

export function MastercardIcon() {
  return (
    <svg viewBox="0 0 40 24" className={badge} role="img" aria-label="Mastercard">
      <circle cx="16.5" cy="12" r="6.5" fill="#EB001B" />
      <circle cx="23.5" cy="12" r="6.5" fill="#F79E1B" />
      <path d="M20 6.6a6.5 6.5 0 0 1 0 10.8a6.5 6.5 0 0 1 0-10.8Z" fill="#FF5F00" />
    </svg>
  );
}

export function IsracardIcon() {
  return (
    <svg viewBox="0 0 40 24" className={badge} role="img" aria-label="ישראכרט">
      <text x="20" y="15.5" textAnchor="middle" fontSize="6.6" fontWeight="700" fill="#F28C00" fontFamily="Arial, sans-serif">
        isracard
      </text>
    </svg>
  );
}

export function AmexIcon() {
  return (
    <svg viewBox="0 0 40 24" className={badge} role="img" aria-label="American Express">
      <rect x="3" y="4" width="34" height="16" rx="2.5" fill="#1F72CD" />
      <text x="20" y="15.5" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">
        AMEX
      </text>
    </svg>
  );
}

export function CardIcons() {
  return (
    <span className="flex flex-wrap items-center gap-1.5" dir="ltr">
      <VisaIcon />
      <MastercardIcon />
      <IsracardIcon />
      <AmexIcon />
    </span>
  );
}

export function PayPalWordmark() {
  return (
    <svg viewBox="0 0 64 18" className="h-[18px] w-16 shrink-0" role="img" aria-label="PayPal" direction="ltr">
      <text x="0" y="14" fontSize="15" fontWeight="800" fontStyle="italic" fontFamily="Arial, sans-serif">
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009CDE">Pal</tspan>
      </text>
    </svg>
  );
}

export function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
    </svg>
  );
}
