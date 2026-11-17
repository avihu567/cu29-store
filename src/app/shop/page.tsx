import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { Container, PageHero } from "@/components/ui";
import { getLifestyleAlt, getLifestyleImage } from "@/lib/lifestyle";
import { categories, products } from "@/lib/products";

export const metadata: Metadata = {
  title: "חנות",
  description: "בקבוקי נחושת, כלי הגשה ותכשיטים מנחושת טהורה 99.9%.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="החנות"
        title="הקולקציה המלאה"
        emblem="seal"
        image={getLifestyleImage("shop")}
        imageAlt={getLifestyleAlt("shop")}
        intro="כל פריט מיוצר מנחושת טהורה 99.9%, ללא ציפויים וללא סגסוגות. בחרו את הכלי שילווה את הטקס שלכם."
      />

      <nav
        aria-label="קטגוריות"
        className="sticky top-[6.5rem] z-20 lg:top-[7.5rem]"
      >
        <Container className="py-4">
          <div className="flex gap-1.5 overflow-x-auto rounded-full bg-paper/85 p-1.5 text-sm whitespace-nowrap shadow-[var(--shadow-soft)] ring-1 ring-line backdrop-blur-md sm:w-fit">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full px-4 py-2 text-ink/75 transition-all duration-300 hover:bg-cream hover:text-copper-deep"
            >
              {c.name}
              <span className="ms-1.5 text-xs text-copper-light">
                ({products.filter((p) => p.category === c.id).length})
              </span>
            </a>
          ))}
          </div>
        </Container>
      </nav>

      <Container className="space-y-24 py-16 sm:py-20">
        {categories.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-48">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
              <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">{c.name}</h2>
              <p className="text-sm text-stone">{c.tagline}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {products
                .filter((p) => p.category === c.id)
                .map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
