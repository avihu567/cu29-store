import { ratingSummary, reviewsFor } from "@/lib/reviews";
import type { CategoryId } from "@/lib/products";
import ReviewForm from "./ReviewForm";
import UgcGallery from "./UgcGallery";
import StarRating from "./StarRating";

const dateFormat = new Intl.DateTimeFormat("he-IL", { month: "long", year: "numeric" });

export default function ProductReviews({
  category,
  productName,
}: {
  category: CategoryId;
  productName: string;
}) {
  const list = reviewsFor(category);
  const { average, count } = ratingSummary(list);
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: list.filter((r) => r.rating === star).length,
  }));

  return (
    <section id="reviews" className="scroll-mt-32 bg-cream/60 py-24 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs tracking-[0.28em] text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
            REVIEWS
          </p>
          <h2 className="mt-5 font-serif text-3xl font-light text-ink sm:text-4xl">מה הלקוחות שלנו אומרים</h2>

          <div className="mt-8 flex items-end gap-4">
            <span className="text-6xl font-serif font-light text-ink" dir="ltr">{average.toFixed(1)}</span>
            <div className="pb-2">
              <StarRating value={average} className="h-5 w-5" />
              <p className="mt-1 text-sm text-stone">מבוסס על {count} ביקורות</p>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {distribution.map(({ star, n }) => (
              <li key={star} className="flex items-center gap-3 text-xs text-stone">
                <span className="w-3" dir="ltr">{star}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-stone-muted/60">
                  <span
                    className="block h-full rounded-full bg-copper"
                    style={{ width: `${count ? (n / count) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-4 text-end">{n}</span>
              </li>
            ))}
          </ul>

          <ReviewForm productName={productName} />
        </div>

        <ul className="space-y-4">
          {list.map((r) => (
            <li key={r.name + r.date} className="rounded-3xl bg-paper p-7 shadow-[0_18px_40px_-34px_rgba(91,63,44,0.5)] sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StarRating value={r.rating} className="h-3.5 w-3.5" />
                <span className="text-xs text-stone">{dateFormat.format(new Date(r.date))}</span>
              </div>
              <blockquote className="mt-4 font-serif text-xl font-light leading-9 text-ink">״{r.text}״</blockquote>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone">
                <span className="text-ink">{r.name}</span>
                <span>{r.city}</span>
                {r.variant && <span className="rounded-full bg-ivory px-2.5 py-0.5 text-xs">{r.variant}</span>}
                {r.verified && <span className="text-xs text-copper">✓ רכישה מאומתת</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <UgcGallery productName={productName} />
    </section>
  );
}
