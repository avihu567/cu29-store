import { getGallery } from "@/lib/product-images";
import type { Product } from "@/lib/products";
import ProductCardClient from "./ProductCardClient";

/**
 * Product card (server wrapper): reads the product's photos from disk, then
 * hands off to the interactive card (color dots, hover angle, quick add).
 */
export default function ProductCard({ product }: { product: Product }) {
  return <ProductCardClient product={product} gallery={getGallery(product)} />;
}
