"use client";

import { useCart } from "@/lib/cart";
import * as fpixel from "@/lib/fpixel";
import { pixelContents, priceCart } from "@/lib/pricing";
import { whatsappLink } from "@/lib/products";
import { WhatsAppIcon } from "./icons";

export default function WhatsAppFloat() {
  const lines = useCart();

  // Meta: always a Contact; InitiateCheckout only when there is a cart to order,
  // so general questions don't inflate checkout numbers.
  function track() {
    const cart = priceCart(lines);
    if (cart.lines.length > 0) {
      fpixel.initiateCheckout({ contents: pixelContents(cart), value: cart.total });
      fpixel.contact(cart.total);
    } else {
      fpixel.contact();
    }
  }

  return (
    <a
      href={whatsappLink("שלום CU29, אשמח לעזרה בבחירת מוצר")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      aria-label="שליחת הודעת וואטסאפ"
      className="fixed bottom-5 start-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
