import Link from "next/link";
import ProductImage from "../ProductImage";
import QuickAddButton from "./QuickAddButton";
import { getGallery } from "@/lib/product-images";
import { formatPrice, products, whatsappLink, type Product } from "@/lib/products";

/** The best-selling item of each other category, so the set "completes" the ritual. */
function pickComplements(current: Product): Product[] {
  const lead: Record<string, string> = {
    bottles: "copper-bottle-950ml",
    vessels: "copper-water-vessel-4l",
    cups: "copper-cup",
    jewelry: "copper-wellness-bracelet",
  };
  return Object.entries(lead)
    .filter(([category]) => category !== current.category)
    .map(([, slug]) => products.find((p) => p.slug === slug)!)
    .filter(Boolean);
}

export default function CompleteRitual({ product }: { product: Product }) {
  const items = pickComplements(product);

  return (
    <section className="py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
              COMPLETE YOUR RITUAL
            </p>
            <h2 className="mt-5 font-serif text-3xl font-light text-ink sm:text-4xl">השלם את הטקס שלך</h2>
          </div>
          <Link href="/shop" className="text-sm text-copper-deep underline-offset-8 hover:underline">
            לכל הקולקציה ←
          </Link>
        </div>

        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {items.map((p) => (
            <li key={p.slug} className="reveal group flex flex-col">
              <Link href={`/product/${p.slug}`} className="relative block aspect-square overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line/60 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)] group-hover:ring-copper/35">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                  <ProductImage
                    src={getGallery(p)[0]?.src}
                    art={p.art}
                    alt={p.name}
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                </div>
                {p.badge && (
                  <span className="absolute start-3 top-3 rounded-full bg-ivory/90 px-3 py-1 text-xs text-copper-deep">
                    {p.badge}
                  </span>
                )}
              </Link>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <Link href={`/product/${p.slug}`} className="text-ink hover:text-copper-deep">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-xs tracking-[0.15em] text-stone" dir="ltr" style={{ textAlign: "right" }}>
                    {p.titleEn}
                  </p>
                </div>
                <span className="shrink-0 text-ink">
                  {p.price !== undefined ? formatPrice(p.price) : "בקרוב"}
                </span>
              </div>
              <div className="mt-4">
                {p.price !== undefined ? (
                  <QuickAddButton
                    slug={p.slug}
                    color={p.ringColors?.[0] ?? p.colorOptions?.[0]?.id}
                    size={p.sizeOptions?.[0]}
                    label={p.name}
                  />
                ) : (
                  <a
                    href={whatsappLink(`שלום CU29, אשמח לקבל עדכון כשהמוצר "${p.name}" יהיה זמין`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-full border border-stone-muted px-4 py-2.5 text-center text-sm text-stone transition-colors hover:border-ink hover:text-ink"
                  >
                    עדכנו אותי כשיגיע
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
