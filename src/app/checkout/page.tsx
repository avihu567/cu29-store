import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";
import { Container } from "@/components/ui";
import { isHypConfigured } from "@/lib/payments/hyp";
import { getGallery } from "@/lib/product-images";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "תשלום מאובטח",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  // Resolved on the server: the client can't read /public folders.
  const images = Object.fromEntries(products.map((p) => [p.slug, getGallery(p)[0]?.src]));

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-serif text-4xl font-light text-ink sm:text-5xl">השלמת הזמנה</h1>
      <CheckoutView images={images} hypEnabled={isHypConfigured()} />
    </Container>
  );
}
