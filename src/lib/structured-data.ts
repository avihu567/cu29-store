// schema.org structured data (JSON-LD) for SEO.
import type { GalleryImage, Product } from "./products";

export const SITE_URL = "https://cu29ritual.com";

const cm = (value: number) => ({
  "@type": "QuantitativeValue",
  value,
  unitCode: "CMT", // UN/CEFACT code for centimetre
  unitText: "ס״מ",
});

/**
 * schema.org Product for a product page. Dimensions come from
 * product.dimensions: height → height; the round bottle's diameter → width
 * and depth; volume → additionalProperty.
 * No aggregateRating: reviews are still sample data.
 */
export function productJsonLd(product: Product, gallery: GalleryImage[]) {
  const url = `${SITE_URL}/product/${product.slug}`;
  const d = product.dimensions;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.slug,
    url,
    brand: { "@type": "Brand", name: "CU29" },
    material: "נחושת טהורה 99.9%",
    ...(gallery.length > 0 && { image: gallery.map((img) => `${SITE_URL}${img.src}`) }),
    ...(d && {
      height: cm(d.heightCm),
      width: cm(d.diameterCm),
      depth: cm(d.diameterCm),
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "נפח",
          value: d.volumeMl,
          unitCode: "MLT", // millilitre
          unitText: "מ״ל",
        },
        {
          "@type": "PropertyValue",
          name: "קוטר",
          value: d.diameterCm,
          unitCode: "CMT",
          unitText: "ס״מ",
        },
      ],
    }),
    ...(product.price !== undefined && {
      offers: {
        "@type": "Offer",
        url,
        price: product.price,
        priceCurrency: "ILS",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

/** Serialize JSON-LD safely for a <script> tag (per the Next.js JSON-LD guide). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
