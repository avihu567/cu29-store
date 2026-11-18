// Checkout: shipping details, validation and order references.
// Pure functions — safe on the client and the server.

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  /** Optional delivery notes for the courier. */
  notes?: string;
}

export type ShippingField = keyof ShippingDetails;
export type ShippingErrors = Partial<Record<ShippingField, string>>;

export const EMPTY_SHIPPING: ShippingDetails = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Digits only, with +972 / 972 turned into a leading 0. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+972")) return "0" + digits.slice(4);
  if (digits.startsWith("972")) return "0" + digits.slice(3);
  return digits.replace(/\+/g, "");
}

/** Israeli mobile: 05X + 7 digits (e.g. 050-1234567). */
export function isIsraeliMobile(raw: string): boolean {
  return /^05\d{8}$/.test(normalizePhone(raw));
}

/** 0501234567 → 050-1234567 */
export function formatPhone(raw: string): string {
  const p = normalizePhone(raw);
  return /^05\d{8}$/.test(p) ? `${p.slice(0, 3)}-${p.slice(3)}` : raw.trim();
}

export function validateShipping(s: ShippingDetails): ShippingErrors {
  const e: ShippingErrors = {};
  if (s.firstName.trim().length < 2) e.firstName = "נא להזין שם פרטי";
  if (s.lastName.trim().length < 2) e.lastName = "נא להזין שם משפחה";
  if (!isIsraeliMobile(s.phone)) e.phone = "נא להזין מספר נייד תקין (לדוגמה 050-1234567)";
  if (!EMAIL.test(s.email.trim())) e.email = "נא להזין כתובת אימייל תקינה";
  if (s.city.trim().length < 2) e.city = "נא להזין עיר";
  if (s.address.trim().length < 4 || !/\d/.test(s.address)) {
    e.address = "נא להזין רחוב ומספר בית (ודירה/קומה אם יש)";
  }
  return e;
}

/** Trimmed copy with a formatted phone. */
export function cleanShipping(s: ShippingDetails): ShippingDetails {
  return {
    firstName: s.firstName.trim(),
    lastName: s.lastName.trim(),
    phone: formatPhone(s.phone),
    email: s.email.trim(),
    city: s.city.trim(),
    address: s.address.trim(),
    notes: s.notes?.trim() || undefined,
  };
}

/** Human-readable order reference, e.g. CU29-LZ8K2Q-4F7. */
export function newOrderRef(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `CU29-${time}-${rand}`;
}

/** Shipping details as message lines (WhatsApp / summaries). */
export function shippingLines(s: ShippingDetails): string[] {
  return [
    `שם: ${s.firstName} ${s.lastName}`,
    `טלפון: ${s.phone}`,
    `אימייל: ${s.email}`,
    `כתובת: ${s.address}, ${s.city}`,
    ...(s.notes ? [`הערות לשליח: ${s.notes}`] : []),
  ];
}
