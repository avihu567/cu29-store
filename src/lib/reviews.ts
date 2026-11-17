import type { CategoryId } from "./products";

export interface Review {
  name: string;
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // ISO date
  /** Product family the review is about, used to show relevant reviews first. */
  category: CategoryId;
  variant?: string;
  /** Set only for reviews matched to a real order. */
  verified?: boolean;
  text: string;
}

// TODO(reviews): SAMPLE DATA — replace with real, verified customer reviews
// before launch. The rating badge is computed from this list.
export const reviews: Review[] = [
  {
    name: "מיכל ר.",
    city: "תל אביב",
    rating: 5,
    date: "2026-10-28",
    category: "bottles",
    variant: "700 מ״ל · ורוד עתיק",
    text: "הבקבוק פשוט מהמם, מרגישים את האיכות מהרגע הראשון. התחלתי את טקס הבוקר לפני חודשיים ואני כבר לא מוותרת עליו.",
  },
  {
    name: "נועה ל.",
    city: "ירושלים",
    rating: 5,
    date: "2026-10-12",
    category: "bottles",
    variant: "950 מ״ל · פחם",
    text: "חיפשתי הרבה זמן בקבוק נחושת אמיתי בלי ציפוי פנימי. סוף סוף מצאתי. המים מקבלים טעם נקי ורך.",
  },
  {
    name: "יונתן ש.",
    city: "חיפה",
    rating: 5,
    date: "2026-09-30",
    category: "vessels",
    text: "המיכל עומד במרכז המטבח וכל המשפחה שותה ממנו. גם פריט נוי יפה וגם שימושי. שירות אישי ומהיר בוואטסאפ.",
  },
  {
    name: "דנה כ.",
    city: "רעננה",
    rating: 4,
    date: "2026-09-18",
    category: "bottles",
    variant: "500 מ״ל · ורוד עתיק",
    text: "בקבוק קטן ונוח לתיק. טבעת הסיליקון בצבע ורוד עתיק יפהפייה. הורדתי כוכב רק כי הייתי שמחה לעוד צבעים.",
  },
  {
    name: "אורי מ.",
    city: "באר שבע",
    rating: 5,
    date: "2026-08-22",
    category: "cups",
    text: "זוג הכוסות מושלם לצד הבקבוק. עבודה עדינה ומדויקת, ומרגישים שזה עבודת יד.",
  },
];

export function ratingSummary(list: Review[] = reviews) {
  const count = list.length;
  const average = count ? list.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { count, average: Math.round(average * 10) / 10 };
}

/** Reviews for the product's category first, then the rest. */
export function reviewsFor(category: CategoryId): Review[] {
  return [...reviews].sort(
    (a, b) => Number(b.category === category) - Number(a.category === category),
  );
}
