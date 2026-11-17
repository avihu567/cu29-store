import type { Metadata } from "next";
import CartView from "@/components/CartView";
import { Container } from "@/components/ui";
import { getMainImage } from "@/lib/product-images";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "סל קניות" };

export default function CartPage() {
  // Resolved on the server: the client cart can't read /public folders.
  const images = Object.fromEntries(
    products.map((p) => [p.slug, getMainImage(p.imageDir)]),
  );

  return (
    <Container className="py-14 sm:py-20">
      <h1 className="font-serif text-4xl font-light text-ink sm:text-5xl">סל הקניות</h1>
      <CartView images={images} />
    </Container>
  );
}
