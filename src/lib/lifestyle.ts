// Server-only module (uses node:fs) — import from Server Components only.
//
// General brand & lifestyle photos live in /public/images/general/.
// They are not tied to a product; each "slot" below is a place on the site
// where one atmospheric photo can appear.
//
//   • Name a file after a slot to pin it there:   hero.jpg, story-2.webp
//   • Any other filename (IMG_2041.jpg …) joins a shared pool. Pool photos
//     fill the still-empty slots in the priority order below, each used once.
//   • A slot with no photo keeps its designed fallback (art, logo, color).
//
// Folder contents are read at render time in dev and at build time in
// production, so a deployed site needs a rebuild to pick up new photos.
import fs from "node:fs";
import path from "node:path";

/** Slots in priority order: earlier slots get pool photos first. */
export const LIFESTYLE_SLOTS = [
  "hero", //        Homepage hero, main photo
  "hero-2", //      Homepage hero, small overlapping detail photo
  "story", //       Our Story page header
  "ritual", //      The Ritual page cover
  "banner", //      Homepage "the ritual" banner background
  "philosophy", //  Homepage philosophy circle
  "trust", //       Product page: Tamra Jal story panel
  "story-2", //     Our Story: "how it started" image
  "ritual-2", //    The Ritual: Ayurveda chapter
  "ritual-3", //    The Ritual: care & shine chapter
  "shop", //        Shop page header
] as const;

export type LifestyleSlot = (typeof LIFESTYLE_SLOTS)[number];

/**
 * Hand-picked placements for the current photo set (filenames as uploaded).
 * A photo may serve several slots on different pages. A file named after a
 * slot (e.g. hero.jpg) still overrides these.
 */
const ASSIGNMENTS: Partial<Record<LifestyleSlot, string>> = {
  hero: "image1 (3).jpeg", //           bottle by the window, soft morning light
  "hero-2": "image3 (1).jpeg", //       4L vessel in a bright kitchen
  story: "image6.jpeg", //              bottle in golden-hour sand: Our Story header
  philosophy: "image5 (1).jpeg", //     raw native copper: back to the elements
  banner: "image2 (1).jpeg", //         pouring water: the ritual in action
  ritual: "image2 (1).jpeg",
  "story-2": "image1 (3).jpeg", //      the bottle by the window: "we started with one bottle"
  shop: "image1 (3).jpeg",
  "ritual-2": "image3 (1).jpeg", //     4L vessel at home: storing water in copper
  trust: "image3 (1).jpeg",
};

const DIR = path.join(process.cwd(), "public", "images", "general");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const baseName = (f: string) => f.replace(/\.[^.]+$/, "").toLowerCase();
const toUrl = (f: string) => `/images/general/${encodeURIComponent(f)}`;
const isSlot = (name: string): name is LifestyleSlot =>
  (LIFESTYLE_SLOTS as readonly string[]).includes(name);

function listPhotos(): string[] {
  try {
    return fs
      .readdirSync(DIR)
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  } catch {
    return [];
  }
}

/**
 * Hebrew alt text per photo file, so a photo has the same description
 * wherever it appears. Add a line here when you add a new photo.
 */
const PHOTO_ALT: Record<string, string> = {
  "image1 (3).jpeg": "בקבוק נחושת CU29 עם מכסה פתוח ליד חלון, לצד כוס קרמיקה ומפית פשתן",
  "image2 (1).jpeg": "מזיגת מים מבקבוק נחושת CU29 לכוס נחושת, לצד קערת תאנים",
  "image3 (1).jpeg": "מיכל מים מנחושת עם ברז על מעמד, במטבח מואר",
  "image5 (1).jpeg": "גוש נחושת טבעית גולמית עם מינרלים ירוקים",
  "image6.jpeg": "בקבוק נחושת CU29 מונח בחול החוף באור שקיעה",
};
const DEFAULT_ALT = "תמונת אווירה של CU29 – כלי נחושת טהורה";

/** File name of the photo for a slot (see the rules at the top of this file). */
function resolvePhoto(slot: LifestyleSlot): string | undefined {
  const photos = listPhotos();
  const pinned = photos.find((f) => baseName(f) === slot);
  if (pinned) return pinned;

  const assigned = ASSIGNMENTS[slot];
  if (assigned && photos.includes(assigned)) return assigned;

  // Unassigned, unnamed photos fill the slots that are still empty.
  const used = new Set(Object.values(ASSIGNMENTS));
  const pool = photos.filter((f) => !isSlot(baseName(f)) && !used.has(f));
  const openSlots = LIFESTYLE_SLOTS.filter(
    (s) =>
      !photos.some((f) => baseName(f) === s) &&
      !(ASSIGNMENTS[s] && photos.includes(ASSIGNMENTS[s]!)),
  );
  const i = openSlots.indexOf(slot);
  return i >= 0 && i < pool.length ? pool[i] : undefined;
}

/** Public URL of the photo for a slot, or undefined to use the fallback design. */
export function getLifestyleImage(slot: LifestyleSlot): string | undefined {
  const file = resolvePhoto(slot);
  return file ? toUrl(file) : undefined;
}

/** Hebrew alt text for the photo shown in a slot. */
export function getLifestyleAlt(slot: LifestyleSlot): string {
  const file = resolvePhoto(slot);
  return (file && PHOTO_ALT[file]) || DEFAULT_ALT;
}
