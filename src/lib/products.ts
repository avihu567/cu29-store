import { RING_PRICE, RING_SLUG, SLEEVE_PRICE, SLEEVE_SLUG } from "./offers";

export type CategoryId = "bottles" | "vessels" | "cups" | "jewelry";

export type ArtVariant =
  | "bottle"
  | "bottle-slim"
  | "bottle-small"
  | "dispenser"
  | "tumbler"
  | "bracelet"
  | "sleeve"
  | "carry-ring";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  /** Art used for the category card until real photos are added. */
  art: ArtVariant;
}

export type RingColorId = "charcoal" | "terracotta";

export interface RingColor {
  id: RingColorId;
  name: string;
  /** Internal reference for production only — never shown on the site. */
  pantone: string;
  /** Screen approximation of the swatch. */
  hex: string;
}

export const RING_COLORS: Record<RingColorId, RingColor> = {
  charcoal: { id: "charcoal", name: "פחם", pantone: "Pantone 426 C", hex: "#25282A" },
  terracotta: { id: "terracotta", name: "ורוד עתיק", pantone: "Pantone 7516 C", hex: "#9A3A06" },
};

/** A color choice on an accessory (sleeve, ring). */
export interface ColorOption {
  id: string;
  name: string;
  /** Screen approximation of the color. */
  hex: string;
}

/** Cooling sleeve colors. */
export const SLEEVE_COLORS: ColorOption[] = [
  { id: "pink", name: "ורוד", hex: "#E2B4AA" },
  { id: "gray", name: "אפור", hex: "#A5A19B" },
];

export interface ProductDimensions {
  volumeMl: number;
  heightCm: number;
  diameterCm: number;
}

/** A spec line; rows without a value (e.g. "עבודת יד") render on their own. */
export interface SpecRow {
  label: string;
  value?: string;
}

export interface GalleryImage {
  /** Public path, e.g. /products/bottles-500ml/cu29-copper-bottle-500ml-1.jpg */
  src: string;
  /** Hebrew alt text */
  alt: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Family title shown on the PDP (shared by size variants). Defaults to name. */
  title?: string;
  titleEn: string;
  /** Silicone ring color options; first one is the default. */
  ringColors?: RingColorId[];
  subtitle: string;
  category: CategoryId;
  /**
   * Folder that holds this product's photos: a name under /public/products/
   * (e.g. "bottles-500ml"), or a path from /public starting with "/"
   * (e.g. "/images/cooling-sleeve"). Empty folder → vector art fallback.
   */
  imageDir: string;
  /**
   * Explicit, ordered photo gallery (position 1 = main image, also used on
   * product cards; position 2 = card hover image). When omitted, the photos
   * in imageDir are used in filename order.
   */
  gallery?: GalleryImage[];
  /** Short size label, shown in the size switcher (e.g. "500 מ״ל"). */
  size?: string;
  /** Products sharing a sizeGroup are linked by the size switcher on the PDP. */
  sizeGroup?: string;
  /** Omitted while the price is not set yet: the product shows as "coming soon". */
  price?: number;
  compareAtPrice?: number;
  art: ArtVariant;
  badge?: string;
  featured?: boolean;
  shortDescription: string;
  description: string[];
  /**
   * Physical dimensions — the single place to edit them. The spec block,
   * the "מפרט טכני" accordion and the schema.org data are generated from it.
   */
  dimensions?: ProductDimensions;
  /** Additional spec rows (shown after the generated dimension rows). */
  specs: SpecRow[];
  /** Accessory options (chosen on the product page, stored on the cart line). */
  sizeOptions?: string[];
  colorOptions?: ColorOption[];
  /** Accessories skip the copper benefit/care sections on their page. */
  accessory?: boolean;
  /**
   * Upcoming item ("בקרוב בקולקציה"): shown with a branded placeholder and a
   * notify form; price hidden and it can never be added to the cart.
   */
  isComingSoon?: boolean;
}

export const WHATSAPP_NUMBER = "972508898101";
export const WHATSAPP_DISPLAY = "050-889-8101";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Can be bought right now: has a price and is not coming soon. */
export function isPurchasable(p: Product): p is Product & { price: number } {
  return p.price !== undefined && !p.isComingSoon;
}

export function formatPrice(value: number): string {
  return `₪${value.toLocaleString("he-IL")}`;
}

export const categories: Category[] = [
  {
    id: "bottles",
    name: "בקבוקי נחושת",
    tagline: "בשלוש מידות: 500, 700 ו־950 מ״ל, ואביזרים תואמים",
    art: "bottle",
  },
  {
    id: "vessels",
    name: "מיכלי מים",
    tagline: "מיכל נחושת 4 ליטר למים של כל המשפחה",
    art: "dispenser",
  },
  {
    id: "cups",
    name: "כוסות וכלי שולחן",
    tagline: "כוסות נחושת בעיצוב עדין",
    art: "tumbler",
  },
  {
    id: "jewelry",
    name: "תכשיטי נחושת",
    tagline: "צמידי נחושת בריאותיים בעיצוב עדין",
    art: "bracelet",
  },
];

const PURE_COPPER = { label: "חומר", value: "99.9% נחושת טהורה" };
const NO_LINING = { label: "ציפוי פנימי", value: "ללא, מגע ישיר עם הנחושת" };
const RING_SPEC = { label: "טבעת סיליקון", value: "פחם או ורוד עתיק" };
/** Shared size-comparison photo, position 5 on every bottle. */
const SIZE_COMPARISON: GalleryImage = {
  src: "/products/shared/cu29-copper-bottles-500-700-950ml-size-comparison.jpg",
  alt: `שלושת הגדלים של בקבוקי הנחושת CU29: 500, 700 ו-950 מ"ל`,
};

/** The fixed 6-photo order for a bottle size (see product photo brief). */
function bottleGallery(ml: number, lifestyleAlt: string): GalleryImage[] {
  const file = (n: number) => `/products/bottles-${ml}ml/cu29-copper-bottle-${ml}ml-${n}.jpg`;
  return [
    { src: file(1), alt: `בקבוק נחושת טהורה CU29 בנפח ${ml} מ"ל על רקע לבן` },
    { src: file(2), alt: `בקבוק נחושת CU29 ${ml} מ"ל עם טיפות מים` },
    { src: file(3), alt: `בקבוק נחושת CU29 ${ml} מ"ל פתוח, עם המכסה והתחתית החרוטה בלוגו` },
    { src: file(4), alt: `בקבוק נחושת CU29 ${ml} מ"ל לצד אריזת המתנה THE CU RITUAL` },
    SIZE_COMPARISON,
    { src: file(6), alt: lifestyleAlt },
  ];
}

const BOTTLE_FAMILY = {
  title: "בקבוק נחושת טהורה",
  titleEn: "The Pure Metal Bottle",
  ringColors: ["charcoal", "terracotta"] as RingColorId[],
};

const bottleDescription = [
  "בקבוק נחושת טהורה 99.9%, ללא ציפוי פנימי וללא לכה. המים באים במגע ישיר עם המתכת, בדיוק כפי שנעשה במסורת האיורוודית במשך אלפי שנים.",
  "מלאו אותו במים בערב, השאירו בטמפרטורת החדר למשך הלילה, ושתו את הכוס הראשונה על בטן ריקה בבוקר.",
];

export const products: Product[] = [
  {
    slug: "copper-bottle-500ml",
    name: "בקבוק נחושת 500 מ״ל",
    subtitle: "קומפקטי, לתיק ולדרכים",
    category: "bottles",
    imageDir: "bottles-500ml",
    gallery: bottleGallery(500, `בקבוק נחושת CU29 500 מ"ל על שולחן עבודה מעץ`),
    size: "500 מ״ל",
    sizeGroup: "bottle",
    ...BOTTLE_FAMILY,
    price: 119,
    art: "bottle-small",
    shortDescription: "המידה הקטנה והקלה, שנכנסת לכל תיק.",
    description: bottleDescription,
    dimensions: { volumeMl: 500, heightCm: 18, diameterCm: 7 },
    specs: [NO_LINING, RING_SPEC],
  },
  {
    slug: "copper-bottle-700ml",
    name: "בקבוק נחושת 700 מ״ל",
    subtitle: "המידה היומיומית",
    category: "bottles",
    imageDir: "bottles-700ml",
    gallery: bottleGallery(700, `בקבוק נחושת CU29 700 מ"ל על שידת לילה ליד המיטה`),
    size: "700 מ״ל",
    sizeGroup: "bottle",
    ...BOTTLE_FAMILY,
    price: 139,
    art: "bottle-slim",
    featured: true,
    shortDescription: "איזון מושלם בין נפח לנוחות, לבית, למשרד ולחדר הכושר.",
    description: bottleDescription,
    dimensions: { volumeMl: 700, heightCm: 22, diameterCm: 6.5 },
    specs: [NO_LINING, RING_SPEC],
  },
  {
    slug: "copper-bottle-950ml",
    name: "בקבוק נחושת 950 מ״ל",
    subtitle: "בקבוק הסיגנצ׳ר של CU29",
    category: "bottles",
    imageDir: "bottles-950ml",
    gallery: bottleGallery(950, `בקבוק נחושת CU29 950 מ"ל על משטח מטבח באור בוקר, לצד כוס מים`),
    size: "950 מ״ל",
    sizeGroup: "bottle",
    ...BOTTLE_FAMILY,
    price: 169,
    art: "bottle",
    badge: "הנמכר ביותר",
    featured: true,
    shortDescription:
      "הבקבוק שהתחיל הכול. נחושת טהורה 99.9%, נפח מלא לכל היום.",
    description: bottleDescription,
    dimensions: { volumeMl: 950, heightCm: 26, diameterCm: 7 },
    specs: [NO_LINING, RING_SPEC],
  },
  {
    slug: SLEEVE_SLUG,
    name: "שרוול קירור ממותג CU29",
    titleEn: "The Cooling Sleeve",
    subtitle: "שרוול תואם מידה לבקבוקי CU29",
    category: "bottles",
    imageDir: "/images/cooling-sleeve",
    price: SLEEVE_PRICE,
    art: "sleeve",
    accessory: true,
    sizeOptions: ["500 מ״ל", "700 מ״ל", "950 מ״ל"],
    colorOptions: SLEEVE_COLORS,
    // TODO(copy): draft description — please review and add the material.
    shortDescription: "שרוול ממותג שעוטף את בקבוק הנחושת, שומר על המים קרירים יותר ומגן על הבקבוק בדרכים.",
    description: [
      "שרוול הקירור של CU29 נתפר במידה מדויקת לכל אחד מבקבוקי הנחושת שלנו – 500, 700 ו־950 מ״ל.",
      "בחרו את המידה של הבקבוק שלכם ואת הצבע שמתאים לכם.",
    ],
    specs: [
      { label: "התאמה", value: "לבקבוקי CU29 בנפח 500, 700 ו־950 מ״ל" },
      { label: "צבעים", value: "ורוד, אפור" },
    ],
  },
  {
    slug: RING_SLUG,
    name: "טבעת נשיאה מסיליקון",
    titleEn: "The Carry Ring",
    subtitle: "טבעת נשיאה לבקבוקי CU29",
    category: "bottles",
    imageDir: "/images/silicone-ring",
    price: RING_PRICE,
    art: "carry-ring",
    accessory: true,
    colorOptions: Object.values(RING_COLORS).map(({ id, name, hex }) => ({ id, name, hex })),
    // TODO(copy): draft description — please review.
    shortDescription: "טבעת סיליקון נוחה שמתלבשת על צוואר הבקבוק ומאפשרת לשאת אותו בקלות. כל בקבוק CU29 מגיע עם טבעת אחת במתנה.",
    description: [
      "טבעת נשיאה מסיליקון לבקבוקי CU29 – לטבעת נוספת, להחלפה או לשינוי צבע.",
      "כל בקבוק CU29 כבר כולל טבעת אחת במתנה, בצבע לבחירתכם.",
    ],
    specs: [
      { label: "התאמה", value: "לבקבוקי CU29" },
      { label: "צבעים", value: "פחם, ורוד עתיק" },
    ],
  },
  {
    slug: "copper-water-vessel-4l",
    name: "מיכל מים מנחושת 4 ליטר",
    titleEn: "The Pure Water Vessel",
    subtitle: "מיכל אגירה עם ברז",
    category: "vessels",
    imageDir: "/images/upcoming/vessels",
    isComingSoon: true,
    size: "4 ליטר",
    price: 749,
    art: "dispenser",
    featured: true,
    shortDescription: "מיכל מים גדול לבית, מים מנחושת לכל המשפחה לאורך כל היום.",
    description: [
      "מיכל נחושת טהורה בנפח 4 ליטר, שמביא את הטקס אל מרכז המטבח.",
      "ממלאים בערב, ובבוקר מוזגים ישירות מהברז מים שנחו בנחושת כל הלילה.",
    ],
    specs: [PURE_COPPER, { label: "נפח", value: "4 ליטר" }, NO_LINING],
  },
  {
    slug: "copper-cup",
    name: "זוג כוסות נחושת",
    titleEn: "The Ritual Cups",
    subtitle: "2 כוסות שתייה בעיצוב עדין",
    category: "cups",
    imageDir: "/images/upcoming/cups",
    isComingSoon: true,
    size: "זוג (2 כוסות)",
    price: 79,
    art: "tumbler",
    featured: true,
    shortDescription: "זוג כוסות נקיות ועדינות, משלימות את הבקבוק ואת מיכל המים.",
    description: [
      "זוג כוסות נחושת טהורה בעיצוב עדין ונקי, לשתייה מודעת בבית או במשרד.",
    ],
    specs: [PURE_COPPER, { label: "כמות באריזה", value: "2 כוסות" }, NO_LINING],
  },
  {
    slug: "copper-wellness-bracelet",
    name: "צמיד נחושת בריאותי",
    titleEn: "The Wellness Bracelet",
    subtitle: "צמיד נחושת טהורה בעיצוב עדין",
    category: "jewelry",
    imageDir: "/images/upcoming/bracelets",
    isComingSoon: true,
    art: "bracelet",
    shortDescription: "צמיד נחושת עדין ליום־יום, נעים למגע ומתיישן יפה.",
    description: [
      "צמיד נחושת טהורה בעיצוב מינימליסטי, שמתאים לכל מראה ולכל שעה ביום.",
    ],
    specs: [PURE_COPPER],
  },
];

export const MAIN_PRODUCT_SLUG = "copper-bottle-950ml";

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id)!;
}

export function getSizeVariants(product: Product): Product[] {
  if (!product.sizeGroup) return [];
  return products.filter((p) => p.sizeGroup === product.sizeGroup);
}

/** The core spec rows ("מפרט") generated from the product dimensions. */
export function dimensionSpecs(product: Product): SpecRow[] {
  const d = product.dimensions;
  if (!d) return [];
  return [
    { label: "נפח", value: `${d.volumeMl} מ״ל` },
    { label: "גובה", value: `${d.heightCm} ס״מ` },
    { label: "קוטר", value: `${d.diameterCm} ס״מ` },
    { label: "חומר", value: "נחושת טהורה 99.9%" },
    { label: "עבודת יד" },
  ];
}

/** Full technical spec list for the "מפרט טכני" accordion. */
export function technicalSpecs(product: Product): SpecRow[] {
  return [...dimensionSpecs(product), ...product.specs];
}
