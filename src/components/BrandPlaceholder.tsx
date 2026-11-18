import BrandMark from "./BrandMark";

/**
 * Branded placeholder for items without photos yet (upcoming products,
 * categories): warm sand, a quiet CU monogram and CU29 lettering, with a
 * fine terracotta accent. Fills its (relative, sized) parent.
 */
export default function BrandPlaceholder({
  label,
  size = "md",
}: {
  /** Optional small caption, e.g. the product or category name. */
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const mark = { sm: "h-6", md: "h-10", lg: "h-14" }[size];
  const word = { sm: "text-[8px] tracking-[0.35em]", md: "text-[10px] tracking-[0.45em]", lg: "text-xs tracking-[0.5em]" }[size];

  return (
    <div className="texture-stone absolute inset-0 flex flex-col items-center justify-center bg-cream">
      {/* fine inner frame */}
      <div className="pointer-events-none absolute inset-3 rounded-[inherit] border border-tobacco/10 sm:inset-4" />
      <BrandMark logo="mark" decorative className={`${mark} text-tobacco/35`} />
      <span className={`mt-3 font-display text-tobacco/45 ${word}`} dir="ltr">
        CU29
      </span>
      <span className="mt-3 h-px w-8 bg-clay/50" aria-hidden="true" />
      {label && size !== "sm" && (
        <span className="mt-3 max-w-[80%] text-center text-xs text-stone/80">{label}</span>
      )}
    </div>
  );
}
