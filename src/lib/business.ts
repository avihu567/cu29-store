// Official business details — the single source for legal pages, footer,
// emails and the cancellation form. Client-safe (nothing secret here).
export const BUSINESS = {
  brand: "CU29",
  legalName: "פיאסטה",
  legalNameEn: "Fiesta",
  idLabel: "עוסק מורשה",
  id: "318464187",
  address: "הגדוד השלישי 231, צפת",
  email: "support@cu29ritual.com",
  phone: "050-307-7101",
  phoneIntl: "972503077101",
  coordinator: "אביהו חדד",
  hours: "ימים א׳–ה׳, 9:00–18:00",
  site: "cu29ritual.com",
} as const;

export const SUPPORT_EMAIL = BUSINESS.email;
export const SUPPORT_WHATSAPP_URL = `https://wa.me/${BUSINESS.phoneIntl}`;

/** One-line business identification (footer, emails). */
export const BUSINESS_LINE = `${BUSINESS.legalName} | ${BUSINESS.idLabel} ${BUSINESS.id} | ${BUSINESS.address}`;

export const MEDICAL_DISCLAIMER =
  "מוצרי CU29 והמידע באתר על המסורת האיורוודית נועדו לאורח חיים ושתייה בלבד. הם אינם מהווים ייעוץ רפואי ואינם מיועדים לאבחן, לטפל, לרפא או למנוע מחלה כלשהי.";
