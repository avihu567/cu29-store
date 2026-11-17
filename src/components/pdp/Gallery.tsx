"use client";

import Image from "next/image";
import { useState } from "react";
import ProductArt from "../ProductArt";
import type { ArtVariant } from "@/lib/products";

/**
 * Main image with thumbnails beside it (desktop) or below it (mobile).
 * All images stay mounted and crossfade on switch. Falls back to the vector
 * art (tinted with the selected ring color) when the folder has no photos.
 */
export default function Gallery({
  images,
  art,
  alt,
  badge,
  ringColor,
}: {
  images: string[];
  art: ArtVariant;
  alt: string;
  badge?: string;
  ringColor?: string;
}) {
  const [active, setActive] = useState(0);
  const hasThumbs = images.length > 1;

  return (
    <div className={`flex flex-col gap-3 ${hasThumbs ? "lg:flex-row-reverse" : ""}`}>
      <div className="relative aspect-square flex-1 overflow-hidden rounded-[var(--radius-card)] bg-cream">
        {images.length > 0 ? (
          images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? alt : `${alt} – תמונה ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover transition-opacity duration-500 ease-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
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
          <span className="absolute start-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs text-copper-deep backdrop-blur">
            {badge}
          </span>
        )}
      </div>

      {hasThumbs && (
        <div className="flex gap-3 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-cream transition ${
                i === active
                  ? "ring-1 ring-copper ring-offset-2 ring-offset-ivory"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`הצגת תמונה ${i + 1}: ${alt}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
