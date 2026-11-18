// HYP (formerly Yaad Sarig) credit-card payment page — prepared integration.
// Server-only: reads secret credentials. Import from route handlers only.
//
// To go live, set in .env.local and in Vercel → Settings → Environment Variables:
//   HYP_MASOF    terminal number (מספר מסוף)
//   HYP_API_KEY  API key ("KEY") for APISign
//   HYP_PASS_P   payment-page password ("PassP")
//   HYP_BASE_URL optional, defaults to https://pay.hyp.co.il/p/
//
// ⚠️ The parameter names below follow HYP's "pay page with signature"
// (APISign) flow. Verify them against your HYP terminal documentation and
// test in HYP's test terminal before taking real payments.

export interface HypConfig {
  masof: string;
  apiKey: string;
  passP: string;
  baseUrl: string;
}

export function getHypConfig(): HypConfig | null {
  const masof = process.env.HYP_MASOF;
  const apiKey = process.env.HYP_API_KEY;
  const passP = process.env.HYP_PASS_P;
  if (!masof || !apiKey || !passP) return null;
  return { masof, apiKey, passP, baseUrl: process.env.HYP_BASE_URL || "https://pay.hyp.co.il/p/" };
}

export function isHypConfigured(): boolean {
  return getHypConfig() !== null;
}

export interface HypPaymentRequest {
  amount: number;
  orderRef: string;
  /** Short order description shown on the payment page. */
  info: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  street: string;
}

/**
 * Asks HYP to sign the payment parameters (APISign) and returns the URL of
 * the hosted, secure HYP payment page to redirect the customer to.
 */
export async function createHypPaymentUrl(cfg: HypConfig, req: HypPaymentRequest): Promise<string> {
  const params = new URLSearchParams({
    action: "APISign",
    What: "SIGN",
    KEY: cfg.apiKey,
    PassP: cfg.passP,
    Masof: cfg.masof,
    Amount: req.amount.toFixed(2),
    Order: req.orderRef,
    Info: req.info,
    ClientName: req.firstName,
    ClientLName: req.lastName,
    email: req.email,
    cell: req.phone,
    city: req.city,
    street: req.street,
    Coin: "1", // ILS
    PageLang: "HEB",
    UTF8: "True",
    UTF8out: "True",
    Sign: "True",
    MoreData: "True",
    Tash: "1", // installments: 1 (adjust if you offer payments)
  });

  const res = await fetch(`${cfg.baseUrl}?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HYP APISign failed: HTTP ${res.status}`);
  const signed = (await res.text()).trim();
  // A signed response is a query string that includes "signature=".
  if (!signed.includes("signature=")) throw new Error(`HYP APISign error: ${signed.slice(0, 200)}`);
  return `${cfg.baseUrl}?action=pay&${signed}`;
}
