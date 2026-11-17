"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ProductArt from "../ProductArt";
import type { ArtVariant, GalleryImage } from "@/lib/products";

/**
 * Product gallery: square white frame (product photos are 1:1 on white),
 * thumbnails beside it (desktop) or below it (mobile), and a full-screen
 * lightbox for zooming. Only image 1 loads eagerly; each other image loads
 * the first time it is shown. Falls back to the vector art (tinted with the
 * selected ring color) when there are no photos.
 */
export default function Gallery({
  images,
  art,
  alt,
  badge,
  ringColor,
}: {
  images: GalleryImage[];
  art: ArtVariant;
  /** Product name, used for the lightbox label. */
  alt: string;
  badge?: string;
  ringColor?: string;
}) {
  const [active, setActive] = useState(0);
  // Images that have been shown at least once (so they stay mounted for the fade).
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hasThumbs = images.length > 1;

  function show(i: number) {
    const next = (i + images.length) % images.length;
    setActive(next);
    setSeen((prev) => (prev.has(next) ? prev : new Set(prev).add(next)));
  }

  function openLightbox() {
    dialogRef.current?.showModal();
  }

  return (
    <div className={`flex min-w-0 flex-col gap-3 ${hasThumbs ? "lg:flex-row-reverse" : ""}`}>
      <div
        className={`relative aspect-square flex-1 overflow-hidden rounded-[var(--radius-card)] ${
          images.length > 0 ? "bg-white ring-1 ring-line/60" : "bg-cream"
        }`}
      >
        {images.length > 0 ? (
          <button
            type="button"
            onClick={openLightbox}
            aria-label={`הגדלת התמונה: ${images[active].alt}`}
            className="group absolute inset-0 cursor-zoom-in"
          >
            {images.map((img, i) =>
              seen.has(i) ? (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`object-contain transition-opacity duration-500 ease-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : null,
            )}
            <span className="pointer-events-none absolute bottom-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-[var(--shadow-soft)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5M11 8v6M8 11h6" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-2/3 w-2/3 rounded-full bg-wood-light/70 blur-3xl" />
            <ProductArt
              variant={art}
              ringColor={ringColor}
              className="relative h-[82%] w-auto drop-shadow-[0_24px_30px_rgba(42,36,32,0.18)]"
            />
          </div>
        )}
        {badge && (
          <span className="pointer-events-none absolute start-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs text-copper-deep ring-1 ring-copper/20 backdrop-blur">
            {badge}
          </span>
        )}
      </div>

      {hasThumbs && (
        <div className="flex min-w-0 gap-3 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => show(i)}
              aria-current={i === active}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 transition ${
                i === active
                  ? "ring-copper ring-offset-2 ring-offset-ivory"
                  : "ring-line/60 opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={`הצגת תמונה ${i + 1}: ${img.alt}`}
                fill
                sizes="80px"
                loading="lazy"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <dialog
          ref={dialogRef}
          aria-label={`תמונות המוצר: ${alt}`}
          onClick={(e) => {
            // Click on the backdrop (outside the content) closes the lightbox.
            if (e.target === e.currentTarget) e.currentTarget.close();
          }}
          onKeyDown={(e) => {
            // RTL: the left arrow moves forward, the right arrow moves back.
            if (e.key === "ArrowLeft") show(active + 1);
            if (e.key === "ArrowRight") show(active - 1);
          }}
          className="m-auto h-[min(92vh,92vw)] w-[min(92vh,92vw)] max-h-none max-w-none overflow-hidden rounded-[var(--radius-card)] bg-white p-0 backdrop:bg-tobacco-deep/80 backdrop:backdrop-blur-sm"
        >
          <div className="relative h-full w-full">
            <Image
              key={images[active].src}
              src={images[active].src}
              alt={images[active].alt}
              fill
              sizes="92vw"
              className="object-contain"
            />
            <p className="absolute inset-x-0 bottom-3 text-center text-xs text-stone" aria-live="polite" dir="ltr">
              {active + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="סגירה"
              className="absolute end-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl text-ink shadow-[var(--shadow-soft)] hover:text-copper-deep"
            >
              ×
            </button>
            {hasThumbs && (
              <>
                <button
                  type="button"
                  onClick={() => show(active - 1)}
                  aria-label="התמונה הקודמת"
                  className="absolute start-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-[var(--shadow-soft)] hover:text-copper-deep"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => show(active + 1)}
                  aria-label="התמונה הבאה"
                  className="absolute end-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-[var(--shadow-soft)] hover:text-copper-deep"
                >
                  ←
                </button>
              </>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
