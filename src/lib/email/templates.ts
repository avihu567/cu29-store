// Hebrew RTL order emails (customer confirmation + store owner alert).
// Table-based HTML with inline styles so it renders in Gmail, Outlook and
// Apple Mail. Every customer-provided value is HTML-escaped.
import type { OrderRow } from "../orders";

const C = {
  page: "#FBF9F7",
  card: "#FFFFFF",
  border: "#C99E8E",
  tint: "#F4ECE8",
  brown: "#4A3226",
  muted: "#6E5B51",
  copper: "#B5785C",
  copperText: "#9E6348",
};
const FONT = "'Rubik','Segoe UI',Arial,Helvetica,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,'Times New Roman',serif";

export const SUPPORT_WHATSAPP = "https://wa.me/972503077101";
const SITE = "https://www.cu29ritual.com";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const ils = (n: number | string) => {
  const v = Number(n);
  return `₪${Number.isInteger(v) ? v : v.toFixed(2)}`;
};

const CARE = [
  "מים קרים או בטמפרטורת החדר בלבד (לא למים חמים או משקאות מוגזים/חומציים).",
  "שטיפה ידנית עדינה בלבד (אינו מתאים למדיח כלים).",
  "שטיפה קלה במים לפני השימוש הראשון.",
  "להחזרת הברק הטבעי של הנחושת: שפשוף עדין עם חצי לימון ומעט מלח גס, ושטיפה במים (התכהות טבעית/פטינה היא סימן לנחושת טהורה ואמיתית).",
];

const ESSENCE =
  "על פי המסורת האיורוודית העתיקה, מים שנחו לילה שלם בכלי נחושת טהורה נחשבים למים מאוזנים, נקיים ומלאי חיות. " +
  "CU29 מחזירה את הטקס הזה אל היומיום: כל לגימה מבקבוק נחושת טהורה 100% היא רגע קטן של עצירה, של תשומת לב ושל איזון — " +
  "הרגל פשוט שהופך את השתייה לטקס אישי של טוהר וחיוניות.";

// ───────────────────────── building blocks ─────────────────────────

function shell(title: string, preheader: string, body: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<style>
  @media (max-width: 620px) {
    .card { width: 100% !important; border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 24px !important; }
  }
  a { color: ${C.copperText}; }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};" dir="rtl">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.page};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0"
      style="width:600px;max-width:600px;background:${C.card};border:1px solid ${C.border};border-radius:18px;overflow:hidden;" dir="rtl">
      <tr><td align="center" style="background:${C.brown};padding:26px 24px;">
        <div style="font-family:${SERIF};font-size:30px;letter-spacing:6px;color:#FFFFFF;line-height:1;" dir="ltr">CU29</div>
        <div style="font-family:${SERIF};font-size:15px;letter-spacing:1.5px;color:#FFFFFF;opacity:.85;margin-top:8px;" dir="ltr">Pure Flow. <span style="color:#D9AE98;">Pure Metal.</span></div>
      </td></tr>
      ${body}
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const sectionTitle = (t: string) =>
  `<div style="font-family:${FONT};font-size:12px;letter-spacing:2px;color:${C.copperText};margin:0 0 12px;">${esc(t)}</div>`;

const divider = `<tr><td class="pad" style="padding:0 40px;"><div style="height:1px;background:${C.border};opacity:.45;line-height:1px;font-size:1px;">&nbsp;</div></td></tr>`;

function itemsTable(order: OrderRow): string {
  const rows = order.items
    .map((i) => {
      const details = [
        ...i.options,
        ...(i.freeRing ? [`טבעת נשיאה מסיליקון: ${i.freeRing} (מתנה)`] : []),
      ];
      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid ${C.tint};font-family:${FONT};font-size:15px;color:${C.brown};line-height:1.6;" align="right">
          ${esc(i.name)} <span style="color:${C.muted};">× ${esc(i.quantity)}</span>
          ${details.length ? `<div style="font-size:13px;color:${C.muted};">${details.map(esc).join(" · ")}</div>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${C.tint};font-family:${FONT};font-size:15px;color:${C.brown};white-space:nowrap;" align="left" valign="top">
          ${ils(i.total)}${Number(i.regularTotal) > Number(i.total) ? `<div style="font-size:12px;color:${C.muted};text-decoration:line-through;">${ils(i.regularTotal)}</div>` : ""}
        </td>
      </tr>`;
    })
    .join("");
  const gift = order.gift_sleeve
    ? `<tr><td style="padding:12px 0;border-bottom:1px solid ${C.tint};font-family:${FONT};font-size:15px;color:${C.copperText};" align="right">
        🎁 שרוול קירור ממותג במתנה
        <div style="font-size:13px;color:${C.muted};">מידה: ${esc(order.gift_sleeve.size)} · צבע: ${esc(order.gift_sleeve.colorName)}</div>
      </td><td style="padding:12px 0;border-bottom:1px solid ${C.tint};font-family:${FONT};font-size:15px;color:${C.copperText};" align="left" valign="top">חינם</td></tr>`
    : "";
  const line = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:${strong ? "14px" : "6px"} 0 0;font-family:${FONT};font-size:${strong ? "17px" : "14px"};color:${strong ? C.brown : C.muted};${strong ? "font-weight:600;" : ""}" align="right">${label}</td>
      <td style="padding:${strong ? "14px" : "6px"} 0 0;font-family:${FONT};font-size:${strong ? "17px" : "14px"};color:${C.brown};${strong ? "font-weight:600;" : ""}white-space:nowrap;" align="left">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl">
    ${rows}${gift}
    ${line("סכום ביניים", ils(order.subtotal))}
    ${line("משלוח", Number(order.shipping) === 0 ? "חינם" : ils(order.shipping))}
    ${line("סה״כ שולם", ils(order.total), true)}
  </table>`;
}

function addressBlock(order: OrderRow, withContact: boolean): string {
  return `<div style="font-family:${FONT};font-size:15px;color:${C.brown};line-height:1.8;">
    ${esc(order.first_name)} ${esc(order.last_name)}<br>
    ${esc(order.address)}, ${esc(order.city)}
    ${withContact ? `<br><span dir="ltr">${esc(order.phone)}</span><br><a href="mailto:${esc(order.email)}" style="color:${C.copperText};" dir="ltr">${esc(order.email)}</a>` : ""}
    ${order.notes ? `<div style="margin-top:8px;font-size:13px;color:${C.muted};">הערות לשליח: ${esc(order.notes)}</div>` : ""}
  </div>`;
}

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
    <td align="center" style="border-radius:999px;background:${C.copper};">
      <a href="${href}" style="display:inline-block;padding:13px 30px;font-family:${FONT};font-size:14px;color:#FFFFFF;text-decoration:none;letter-spacing:.5px;">${label}</a>
    </td></tr></table>`;

// ───────────────────────── customer ─────────────────────────

export function customerEmail(order: OrderRow): { subject: string; html: string; text: string } {
  const subject = `תודה על ההזמנה! אישור הזמנה #${order.order_number} | CU29`;
  const body = `
    <tr><td class="pad" style="padding:40px 40px 26px;" align="right">
      <div class="h1" style="font-family:${FONT};font-size:27px;line-height:1.4;color:${C.brown};font-weight:500;">שלום ${esc(order.first_name)},<br>תודה שבחרת להצטרף לטקס של CU29</div>
      <p style="font-family:${FONT};font-size:15px;line-height:1.9;color:${C.muted};margin:14px 0 0;">
        התשלום התקבל וההזמנה שלך כבר בהכנה. נעדכן אותך ברגע שהיא יוצאת לדרך.
      </p>
      <div style="display:inline-block;margin-top:18px;padding:8px 18px;border:1px solid ${C.copper};border-radius:999px;font-family:${FONT};font-size:14px;color:${C.copperText};">
        מספר הזמנה <span dir="ltr" style="font-weight:600;">#${esc(order.order_number)}</span>
      </div>
    </td></tr>
    ${divider}
    <tr><td class="pad" style="padding:28px 40px 8px;" align="right">
      ${sectionTitle("סיכום ההזמנה")}
      ${itemsTable(order)}
    </td></tr>
    <tr><td class="pad" style="padding:22px 40px 30px;" align="right">
      <div style="background:${C.tint};border-radius:14px;padding:18px 20px;">
        ${sectionTitle("כתובת למשלוח")}
        ${addressBlock(order, false)}
        <div style="font-family:${FONT};font-size:13px;color:${C.muted};margin-top:10px;">זמן אספקה משוער: עד 5 ימי עסקים.</div>
      </div>
    </td></tr>
    ${divider}
    <tr><td class="pad" style="padding:30px 40px 6px;" align="right">
      ${sectionTitle("המהות של CU29")}
      <p style="font-family:${FONT};font-size:15px;line-height:2;color:${C.brown};margin:0;">${esc(ESSENCE)}</p>
    </td></tr>
    <tr><td class="pad" style="padding:26px 40px 34px;" align="right">
      ${sectionTitle("שמירה על הבקבוק והברק הטבעי")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl">
        ${CARE.map(
          (c) => `<tr>
            <td width="18" valign="top" style="padding:6px 0 0 10px;"><div style="width:7px;height:7px;border-radius:50%;background:${C.copper};margin-top:7px;"></div></td>
            <td style="padding:4px 0;font-family:${FONT};font-size:14px;line-height:1.85;color:${C.brown};" align="right">${esc(c)}</td>
          </tr>`,
        ).join("")}
      </table>
    </td></tr>
    <tr><td style="background:${C.page};border-top:1px solid ${C.tint};padding:30px 32px;" align="center">
      <p style="font-family:${FONT};font-size:14px;color:${C.brown};margin:0 0 16px;">יש שאלה על ההזמנה? אנחנו כאן בשבילך בוואטסאפ.</p>
      ${button(SUPPORT_WHATSAPP, "כתבו לנו בוואטסאפ")}
      <p style="font-family:${FONT};font-size:12px;color:${C.muted};margin:22px 0 0;line-height:1.8;">
        CU29 · כלים מנחושת טהורה 99.9%<br>
        <a href="${SITE}" style="color:${C.copperText};text-decoration:none;" dir="ltr">cu29ritual.com</a>
      </p>
    </td></tr>`;

  const text = [
    `שלום ${order.first_name}, תודה שבחרת להצטרף לטקס של CU29`,
    `מספר הזמנה: #${order.order_number}`,
    "",
    "סיכום ההזמנה:",
    ...order.items.map(
      (i) =>
        `• ${i.name} × ${i.quantity} — ${ils(i.total)}${i.options.length ? ` (${i.options.join(" · ")})` : ""}${i.freeRing ? ` + טבעת סיליקון ${i.freeRing} מתנה` : ""}`,
    ),
    ...(order.gift_sleeve ? [`• שרוול קירור במתנה — ${order.gift_sleeve.size} · ${order.gift_sleeve.colorName}`] : []),
    `סכום ביניים: ${ils(order.subtotal)}`,
    `משלוח: ${Number(order.shipping) === 0 ? "חינם" : ils(order.shipping)}`,
    `סה״כ שולם: ${ils(order.total)}`,
    "",
    `כתובת למשלוח: ${order.first_name} ${order.last_name}, ${order.address}, ${order.city}`,
    "",
    "המהות של CU29:",
    ESSENCE,
    "",
    "שמירה על הבקבוק והברק הטבעי:",
    ...CARE.map((c) => `• ${c}`),
    "",
    `שאלות? וואטסאפ: ${SUPPORT_WHATSAPP}`,
  ].join("\n");

  return { subject, html: shell(subject, `ההזמנה #${order.order_number} התקבלה — תודה!`, body), text };
}

// ───────────────────────── store owner ─────────────────────────

export function adminEmail(order: OrderRow): { subject: string; html: string; text: string } {
  const subject = `הזמנה חדשה ב-CU29! (#${order.order_number}) - ₪${Number(order.total)}`;
  const review =
    order.status === "payment_review"
      ? `<div style="background:#FDECEC;color:#8A1F1F;border-radius:12px;padding:12px 16px;font-family:${FONT};font-size:14px;margin-bottom:18px;">⚠️ הסכום שאושר ב-PayPal לא תאם את ההזמנה. יש לבדוק בחשבון PayPal לפני משלוח.</div>`
      : "";
  const meta = [
    ["תשלום", "PayPal"],
    ...(order.paypal_order_id ? [["PayPal Order", order.paypal_order_id]] : []),
    ...(order.paypal_capture_id ? [["PayPal Capture", order.paypal_capture_id]] : []),
    ["דיוור שיווקי", order.marketing_opt_in ? "מאשר/ת" : "לא"],
  ];
  const body = `
    <tr><td class="pad" style="padding:34px 40px 22px;" align="right">
      ${review}
      <div class="h1" style="font-family:${FONT};font-size:24px;color:${C.brown};font-weight:500;">הזמנה חדשה התקבלה ושולמה 🎉</div>
      <div style="font-family:${FONT};font-size:15px;color:${C.muted};margin-top:8px;">
        הזמנה <span dir="ltr" style="color:${C.copperText};font-weight:600;">#${esc(order.order_number)}</span> · ${ils(order.total)}
      </div>
    </td></tr>
    ${divider}
    <tr><td class="pad" style="padding:26px 40px 8px;" align="right">
      ${sectionTitle("פרטי הלקוח והמשלוח")}
      ${addressBlock(order, true)}
    </td></tr>
    <tr><td class="pad" style="padding:22px 40px 8px;" align="right">
      ${sectionTitle("פריטים")}
      ${itemsTable(order)}
    </td></tr>
    <tr><td class="pad" style="padding:22px 40px 30px;" align="right">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="background:${C.tint};border-radius:12px;">
        ${meta
          .map(
            ([k, v]) => `<tr><td style="padding:8px 16px;font-family:${FONT};font-size:13px;color:${C.muted};" align="right">${esc(k)}</td>
            <td style="padding:8px 16px;font-family:${FONT};font-size:13px;color:${C.brown};" align="left" dir="ltr">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </td></tr>
    <tr><td style="background:${C.page};border-top:1px solid ${C.tint};padding:26px 32px;" align="center">
      ${button(`${SITE}/admin`, "לניהול ההזמנה")}
    </td></tr>`;

  const text = [
    subject,
    order.status === "payment_review" ? "⚠️ הסכום ב-PayPal לא תאם את ההזמנה — לבדוק לפני משלוח." : "",
    "",
    `לקוח: ${order.first_name} ${order.last_name}`,
    `טלפון: ${order.phone}`,
    `אימייל: ${order.email}`,
    `כתובת: ${order.address}, ${order.city}`,
    ...(order.notes ? [`הערות לשליח: ${order.notes}`] : []),
    "",
    "פריטים:",
    ...order.items.map(
      (i) =>
        `• ${i.name} × ${i.quantity} — ${ils(i.total)}${i.options.length ? ` (${i.options.join(" · ")})` : ""}${i.freeRing ? ` + טבעת ${i.freeRing}` : ""}`,
    ),
    ...(order.gift_sleeve ? [`• שרוול מתנה — ${order.gift_sleeve.size} · ${order.gift_sleeve.colorName}`] : []),
    `משלוח: ${Number(order.shipping) === 0 ? "חינם" : ils(order.shipping)}`,
    `סה״כ: ${ils(order.total)}`,
    "",
    ...meta.map(([k, v]) => `${k}: ${v}`),
    `${SITE}/admin`,
  ]
    .filter((l, idx, all) => !(l === "" && all[idx - 1] === ""))
    .join("\n");

  return { subject, html: shell(subject, `${order.first_name} ${order.last_name} · ${ils(order.total)}`, body), text };
}
