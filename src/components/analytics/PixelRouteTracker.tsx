"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { pageView } from "@/lib/fpixel";

/**
 * Fires a Meta PageView on client-side route changes. The initial PageView
 * is sent by the base pixel script, so the first render is skipped.
 */
export default function PixelRouteTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // The private admin dashboard is never tracked.
    if (!pathname.startsWith("/admin")) pageView();
  }, [pathname]);

  return null;
}
