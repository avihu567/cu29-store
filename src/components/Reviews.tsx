import StarRating from "./pdp/StarRating";
import { Container, SectionHeading } from "./ui";
import { ratingSummary, reviews } from "@/lib/reviews";

/** Homepage testimonials, drawn from the same data as the product pages. */
export default function Reviews() {
  const { average, count } = ratingSummary();
  const list = reviews.slice(0, 3);

  return (
    <section className="texture-stone bg-cream py-28 sm:py-40">
      <Container>
        <SectionHeading center eyebrow="מה אומרים עלינו" title="רגעים קטנים של טקס" />
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-stone">
          <StarRating value={average} />
          <span>
            {average.toFixed(1)} מתוך 5 · {count} ביקורות
          </span>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {list.map((r) => (
            <figure key={r.name + r.date} className="reveal lift flex flex-col rounded-[var(--radius-card)] bg-paper/90 p-10 shadow-[var(--shadow-soft)] ring-1 ring-line/50 hover:ring-copper/30">
              <StarRating value={r.rating} className="h-3.5 w-3.5" />
              <blockquote className="mt-6 flex-1 font-serif text-xl font-light leading-9 text-ink">
                ״{r.text}״
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-sm text-stone">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand font-serif text-ink">
                  {r.name.charAt(0)}
                </span>
                <span>
                  {r.name} · {r.city}
                  {r.variant && <span className="block text-xs text-stone/80">{r.variant}</span>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
