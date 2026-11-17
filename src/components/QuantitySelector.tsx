"use client";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-9 w-9" : "h-12 w-12";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper" dir="ltr">
      <button
        type="button"
        aria-label="הפחתת כמות"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${box} rounded-full text-lg text-ink transition-colors hover:text-copper disabled:opacity-30`}
      >
        −
      </button>
      <span className={`${box} flex items-center justify-center text-sm`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="הוספת כמות"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${box} rounded-full text-lg text-ink transition-colors hover:text-copper disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
}
