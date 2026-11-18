// POST /api/waitlist — "עדכנו אותי" signups for coming-soon products.
import { getProduct } from "@/lib/products";
import { DB_NOT_CONFIGURED, getSupabaseAdmin, serverError } from "@/lib/supabase-admin";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^(\+972|0)[\d\s-]{8,12}$/;

async function handlePOST(request: Request) {
  const db = getSupabaseAdmin();
  if (!db) return Response.json(DB_NOT_CONFIGURED, { status: 503 });

  let body: { productSlug?: unknown; contact?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const product = typeof body.productSlug === "string" ? getProduct(body.productSlug) : undefined;
  if (!product?.isComingSoon) return Response.json({ error: "unknown_product" }, { status: 400 });

  const raw = typeof body.contact === "string" ? body.contact.trim().slice(0, 120) : "";
  const isEmail = EMAIL.test(raw);
  if (!isEmail && !PHONE.test(raw)) return Response.json({ error: "invalid_contact" }, { status: 400 });
  const contact = isEmail ? raw.toLowerCase() : raw.replace(/[\s-]/g, "");

  const { error } = await db.from("waitlist").upsert(
    {
      product_slug: product.slug,
      product_name: product.name,
      contact,
      contact_type: isEmail ? "email" : "phone",
    },
    { onConflict: "product_slug,contact", ignoreDuplicates: true },
  );
  if (error) {
    console.error("[waitlist] insert failed", error);
    return Response.json({ error: "db_error" }, { status: 500 });
  }
  return Response.json({ ok: true });
}

export async function POST(...args: Parameters<typeof handlePOST>): Promise<Response> {
  try {
    return await handlePOST(...args);
  } catch (err) {
    return serverError("waitlist", err);
  }
}
