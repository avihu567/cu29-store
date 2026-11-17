import Image from "next/image";
import { getProductImages } from "@/lib/product-images";
import { whatsappLink } from "@/lib/products";
import { WhatsAppIcon } from "../icons";

const HASHTAG = "#CU29Ritual";

/**
 * Customer photos (UGC). Drop approved photos into /public/products/ugc/ —
 * they appear here automatically. With no photos yet, only the invitation shows.
 */
export default function UgcGallery({ productName }: { productName: string }) {
  const photos = getProductImages("ugc").slice(0, 7);

  return (
    <div className="mx-auto mt-20 max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.28em] text-copper-deep" dir="ltr" style={{ textAlign: "right" }}>
            {HASHTAG}
          </p>
          <h3 className="mt-3 font-serif text-2xl font-light text-ink sm:text-3xl">הטקס שלכם, בבית שלכם</h3>
        </div>
      </div>

      <div className="mt-8 flex snap-x gap-3 overflow-x-auto pb-2">
        {photos.map((src, i) => (
          <div key={src} className="relative aspect-square w-44 shrink-0 snap-start overflow-hidden rounded-3xl bg-sand sm:w-56">
            <Image src={src} alt={`תמונת לקוח ${i + 1}`} fill sizes="224px" className="object-cover" />
          </div>
        ))}

        <a
          href={whatsappLink(
            `שלום CU29, אני רוצה לשתף תמונה של הטקס שלי עם ${productName} ${HASHTAG}`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex shrink-0 snap-start flex-col justify-between rounded-3xl border border-dashed border-copper/40 bg-paper p-6 transition-colors hover:border-copper hover:bg-copper-pale/40 ${
            photos.length ? "aspect-square w-44 sm:w-56" : "w-full sm:flex-row sm:items-center"
          }`}
        >
          <div>
            <p className="font-serif text-xl text-ink">שתפו את הטקס שלכם</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone">
              צלמו את רגע הבוקר שלכם עם הנחושת ושלחו לנו. התמונות הנבחרות יופיעו כאן.
            </p>
          </div>
          <span className="mt-5 inline-flex items-center gap-2 self-start btn-copper rounded-full px-5 py-2.5 text-sm sm:mt-0 sm:self-auto">
            <WhatsAppIcon className="h-4 w-4" />
            שליחת תמונה
          </span>
        </a>
      </div>
    </div>
  );
}
