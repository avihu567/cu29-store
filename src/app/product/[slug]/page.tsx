import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BenefitsGrid from "@/components/pdp/BenefitsGrid";
import CareGuide from "@/components/pdp/CareGuide";
import CompleteRitual from "@/components/pdp/CompleteRitual";
import FinalCta from "@/components/pdp/FinalCta";
import ProductHero from "@/components/pdp/ProductHero";
import ProductReviews from "@/components/pdp/ProductReviews";
import RitualStory from "@/components/pdp/RitualStory";
import { getGallery } from "@/lib/product-images";
import { getCategory, getProduct, getSizeVariants, products } from "@/lib/products";
import { ratingSummary, reviewsFor } from "@/lib/reviews";
import { jsonLdString, productJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product
    ? {
        title: `${product.name} – ${product.titleEn}`,
        description: product.shortDescription,
      }
    : {};
}

// The App Shell is shared by every product URL, so the params read lives
// inside a Suspense boundary (see Next.js "Move URL data behind Suspense").
export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <div className="bg-ivory">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-8">
      <div className="aspect-square rounded-[var(--radius-card)] bg-cream" />
      <div className="space-y-5 pt-6">
        <div className="h-3 w-32 bg-wood-light" />
        <div className="h-10 w-3/4 bg-wood-light" />
        <div className="h-4 w-1/3 bg-wood-light" />
        <div className="h-12 w-full bg-paper" />
        <div className="h-12 w-full bg-paper" />
      </div>
    </div>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const sizes = getSizeVariants(product);
  const variants = sizes.length > 1 ? sizes : [product];
  const imagesBySlug = Object.fromEntries(
    variants.map((v) => [v.slug, getGallery(v)]),
  );

  return (
    <>
      {/* schema.org Product (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(productJsonLd(product, imagesBySlug[product.slug] ?? [])) }}
      />
      <nav aria-label="פירורי לחם" className="mx-auto flex max-w-7xl gap-2 px-4 pt-6 text-xs text-stone sm:px-6 lg:px-8">
        <Link href="/" className="hover:text-copper">דף הבית</Link>
        <span>/</span>
        <Link href={`/shop#${category.id}`} className="hover:text-copper">{category.name}</Link>
        <span>/</span>
        <span className="text-ink">{product.title ?? product.name}</span>
      </nav>

      <ProductHero
        variants={variants}
        initialSlug={product.slug}
        imagesBySlug={imagesBySlug}
        categoryName={category.name}
        rating={ratingSummary(reviewsFor(product.category))}
      />
      {!product.accessory && <BenefitsGrid category={product.category} />}
      <RitualStory />
      {!product.accessory && <CareGuide category={product.category} />}
      <ProductReviews category={product.category} productName={product.name} />
      <CompleteRitual product={product} />
      <FinalCta />
    </>
  );
}
