import BrandMark from "./BrandMark";

/** Primary logo: the clean CU mark on its own (header and footer). */
export default function Logo({
  light = false,
  size = "md",
}: {
  light?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <span className={`flex items-center ${light ? "text-ivory" : "text-ink"}`} dir="ltr">
      <BrandMark logo="mark" className={size === "lg" ? "h-12" : "h-7 sm:h-8"} />
    </span>
  );
}
