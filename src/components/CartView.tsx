"use client";

import Link from "next/link";
import { lineKey, setQuantity, useCart } from "@/lib/cart";
import {
  formatPrice,
  getProduct,
  isAvailable,
  orderMessage,
  RING_COLORS,
  whatsappLink,
} from "@/lib/products";
import { WhatsAppIcon } from "./icons";
import ProductImage from "./ProductImage";
import QuantitySelector from "./QuantitySelector";
import { ButtonLink } from "./ui";

const FREE_SHIPPING = 250;
const SHIPPING = 30;

export default function CartView({
  images,
}: {
  images: Record<string, string | undefined>;
}) {
  const items = useCart().flatMap((line) => {
    const product = getProduct(line.slug);
    return product && isAvailable(product)
      ? [{ product, quantity: line.quantity, color: line.color, key: lineKey(line) }]
      : [];
  });

  if (items.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-start gap-6 border-t border-line pt-12">
        <p className="text-stone">הסל שלכם ריק כרגע.</p>
        <ButtonLink href="/shop">להתחלת קנייה</ButtonLink>
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  const total = subtotal + shipping;

  const message = orderMessage(items, [
    `משלוח: ${shipping === 0 ? "חינם" : formatPrice(shipping)}`,
    `סה״כ: ${formatPrice(total)}`,
  ]);

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      <ul className="h-fit divide-y divide-line/70 rounded-[var(--radius-card)] bg-paper/80 px-6 shadow-[var(--shadow-soft)] ring-1 ring-line/60">
        {items.map(({ product, quantity, color, key }) => (
          <li key={key} className="flex gap-5 py-6">
            <Link
              href={`/product/${product.slug}`}
              className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream"
            >
              <ProductImage
                src={images[product.slug]}
                art={product.art}
                alt={product.name}
                sizes="96px"
                padded={false}
                artClassName="h-full w-auto p-3"
              />
            </Link>
            <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <Link href={`/product/${product.slug}`} className="font-serif text-lg text-ink hover:text-copper">
                  {product.name}
                </Link>
                <p className="text-sm text-stone">
                  {product.size && <>{product.size} · </>}
                  {color && <>טבעת {RING_COLORS[color].name} · </>}
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <QuantitySelector
                  size="sm"
                  value={quantity}
                  onChange={(q) => setQuantity(product.slug, q, color)}
                />
                <span className="w-16 text-end text-sm text-ink">
                  {formatPrice(product.price * quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(product.slug, 0, color)}
                  className="text-xs text-stone underline-offset-4 hover:text-copper hover:underline"
                >
                  הסרה
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit space-y-4 rounded-[var(--radius-card)] bg-cream p-8 shadow-[var(--shadow-soft)] ring-1 ring-line/60">
        <h2 className="font-serif text-2xl text-ink">סיכום הזמנה</h2>
        <dl className="space-y-3 border-b border-line pb-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone">סכום ביניים</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">משלוח</dt>
            <dd>{shipping === 0 ? "חינם" : formatPrice(shipping)}</dd>
          </div>
        </dl>
        {shipping > 0 && (
          <p className="text-xs text-copper-dark">
            עוד {formatPrice(FREE_SHIPPING - subtotal)} למשלוח חינם
          </p>
        )}
        <div className="flex justify-between font-serif text-xl">
          <span>סה״כ</span>
          <span>{formatPrice(total)}</span>
        </div>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 lift rounded-full bg-[#25D366] px-6 py-4 text-sm text-white"
        >
          <WhatsAppIcon />
          הזמנה בוואטסאפ
        </a>
        <p className="text-center text-xs leading-5 text-stone">
          נציג יחזור אליכם לאישור ההזמנה ולתיאום תשלום ומשלוח.
        </p>
      </aside>
    </div>
  );
}
