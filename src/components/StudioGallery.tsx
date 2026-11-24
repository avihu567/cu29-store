import Image from "next/image";
import Link from "next/link";
import { LIFESTYLE } from "@/lib/variant-images";
import { SectionHeading } from "./ui";

/** Homepage studio section: the collection on clean white frames (object-contain). */
const TILES = [
  {
    ...LIFESTYLE.family5,
    href: "/shop#bottles",
    caption: "שלושה גדלים, טקס אחד",
    className: "lg:col-span-2 lg:row-span-2",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  {
    ...LIFESTYLE.bottleBox,
    href: "/product/copper-bottle-950ml",
    caption: "מגיע באריזת מתנה THE CU RITUAL",
    className: "",
    sizes: "(min-width: 1024px) 25vw, 50vw",
  },
  {
    ...LIFESTYLE.bottleRings,
    href: "/product/silicone-carry-ring",
    caption: "טבעת נשיאה במתנה – פחם או ורוד עתיק",
    className: "",
    sizes: "(min-width: 1024px) 25vw, 50vw",
  },
  {
    ...LIFESTYLE.family3,
    href: "/product/cu29-cooling-sleeve",
    caption: "שרוול קירור ממותג – אפור כהה או ורוד",
    className: "lg:col-span-2",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
];

export default function StudioGallery() {
  return (
    <section className="pb-28 sm:pb-40" aria-labelledby="studio-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div id="studio-title">
            <SectionHeading
              eyebrow="הקולקציה מקרוב"
              title="נחושת טהורה, בכל פרט."
              intro="בקבוקים בשלושה גדלים, טבעות נשיאה ושרוולי קירור ממותגים – נבחרו כדי ללוות את הטקס היומי שלכם."
            />
          </div>
          <Link href="/shop" className="text-sm text-copper-deep underline-offset-8 hover:underline">
            לכל הקולקציה ←
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {TILES.map((t, i) => (
            <Link
              key={t.src}
              href={t.href}
              className={`group reveal relative block overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-line/60 transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] ${
                i === 0 || i === 3 ? "col-span-2" : ""
              } ${t.className}`}
            >
              <div
                className={`relative ${
                  i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full" : i === 3 ? "aspect-[2/1] lg:aspect-[8/3]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  sizes={t.sizes}
                  loading="lazy"
                  className={`object-contain transition-transform duration-700 ease-out ${
                    i === 3
                      ? "scale-[1.22] group-hover:scale-[1.26]" // wide tile: trim the photo’s white margins
                      : "p-3 group-hover:scale-[1.03] sm:p-5"
                  }`}
                />
              </div>
              <span className="pointer-events-none absolute bottom-3 start-3 rounded-full bg-ivory/90 px-3.5 py-1.5 text-xs text-ink shadow-[var(--shadow-soft)] ring-1 ring-line/50 backdrop-blur">
                {t.caption}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
