import { StarIcon } from "../icons";

/** Five stars with a partially filled last star (e.g. 4.8). */
export default function StarRating({
  value,
  className = "h-4 w-4",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className="relative inline-flex" aria-label={`דירוג ${value} מתוך 5`} dir="ltr">
      <span className="flex text-stone-muted">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className={className} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden text-copper"
        style={{ width: `${(value / 5) * 100}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className={`${className} shrink-0`} />
        ))}
      </span>
    </span>
  );
}
