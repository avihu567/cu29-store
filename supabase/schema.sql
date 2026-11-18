-- CU29 — orders, inventory and waitlist.
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run: everything is "if not exists" / "or replace" / "on conflict do nothing".
--
-- Security model: Row Level Security is ON for every table with NO policies,
-- so the public (anon / publishable) key can read or write nothing. The site
-- only touches these tables from Next.js API routes with the secret
-- service-role key, which bypasses RLS.

create extension if not exists pgcrypto;

-- ───────────────────────── Orders ─────────────────────────
create sequence if not exists public.order_number_seq start with 1001;

create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null unique default ('CU29-' || nextval('public.order_number_seq')),
  status             text not null default 'pending_payment'
                     check (status in ('pending_payment', 'paid', 'payment_review', 'shipped', 'delivered', 'cancelled')),

  first_name         text not null,
  last_name          text not null,
  phone              text not null,
  email              text not null,
  city               text not null,
  address            text not null,
  notes              text,

  -- Snapshot of the cart at checkout (names, options, prices) — see src/lib/orders.ts
  items              jsonb not null default '[]'::jsonb,
  gift_sleeve        jsonb,
  -- What to take out of stock when paid: [{ "sku": "...", "quantity": n }]
  stock_items        jsonb not null default '[]'::jsonb,

  subtotal           numeric(10, 2) not null default 0,
  shipping           numeric(10, 2) not null default 0,
  total              numeric(10, 2) not null default 0,
  currency           text not null default 'ILS',
  marketing_opt_in   boolean not null default false,

  payment_method     text,
  paypal_order_id    text,
  paypal_capture_id  text,

  -- Secret handed to the buyer's browser so only it can update its own order
  access_token       text not null default encode(gen_random_bytes(24), 'hex'),

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  paid_at            timestamptz,
  shipped_at         timestamptz,
  delivered_at       timestamptz
);

create index if not exists orders_status_created_idx on public.orders (status, created_at desc);
create index if not exists orders_created_idx on public.orders (created_at desc);
alter table public.orders enable row level security;

-- ───────────────────────── Inventory ─────────────────────────
create table if not exists public.inventory (
  sku           text primary key,
  product_slug  text not null,
  name          text not null,
  variant       text,
  -- May go below 0 if something sells while out of stock (so you see it).
  stock_count   integer not null default 0,
  sort_order    integer not null default 0,
  updated_at    timestamptz not null default now()
);
alter table public.inventory enable row level security;

insert into public.inventory (sku, product_slug, name, variant, sort_order) values
  ('copper-bottle-500ml', 'copper-bottle-500ml', 'בקבוק נחושת 500 מ״ל', '500 מ״ל', 10),
  ('copper-bottle-700ml', 'copper-bottle-700ml', 'בקבוק נחושת 700 מ״ל', '700 מ״ל', 20),
  ('copper-bottle-950ml', 'copper-bottle-950ml', 'בקבוק נחושת 950 מ״ל', '950 מ״ל', 30),
  ('sleeve-500-pink', 'cu29-cooling-sleeve', 'שרוול קירור', '500 מ״ל · ורוד', 40),
  ('sleeve-500-gray', 'cu29-cooling-sleeve', 'שרוול קירור', '500 מ״ל · אפור', 41),
  ('sleeve-700-pink', 'cu29-cooling-sleeve', 'שרוול קירור', '700 מ״ל · ורוד', 50),
  ('sleeve-700-gray', 'cu29-cooling-sleeve', 'שרוול קירור', '700 מ״ל · אפור', 51),
  ('sleeve-950-pink', 'cu29-cooling-sleeve', 'שרוול קירור', '950 מ״ל · ורוד', 60),
  ('sleeve-950-gray', 'cu29-cooling-sleeve', 'שרוול קירור', '950 מ״ל · אפור', 61)
on conflict (sku) do nothing;

-- ───────────────────────── Waitlist ─────────────────────────
create table if not exists public.waitlist (
  id            uuid primary key default gen_random_uuid(),
  product_slug  text not null,
  product_name  text not null,
  contact       text not null,
  contact_type  text not null check (contact_type in ('email', 'phone')),
  created_at    timestamptz not null default now(),
  unique (product_slug, contact)
);
create index if not exists waitlist_created_idx on public.waitlist (created_at desc);
alter table public.waitlist enable row level security;

-- ───────────────────────── Mark paid + take stock (atomic) ─────────────────────────
-- Only a 'pending_payment' order moves to paid, so stock is taken exactly once
-- even if the browser retries.
create or replace function public.mark_order_paid(
  p_order_id uuid,
  p_status text,
  p_paypal_order_id text,
  p_paypal_capture_id text,
  p_marketing_opt_in boolean
) returns setof public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders;
begin
  if p_status not in ('paid', 'payment_review') then
    raise exception 'invalid status %', p_status;
  end if;

  update public.orders
     set status = p_status,
         payment_method = 'paypal',
         paypal_order_id = p_paypal_order_id,
         paypal_capture_id = p_paypal_capture_id,
         marketing_opt_in = coalesce(p_marketing_opt_in, marketing_opt_in),
         paid_at = now(),
         updated_at = now()
   where id = p_order_id
     and status = 'pending_payment'
  returning * into o;

  if found then
    update public.inventory i
       set stock_count = i.stock_count - s.qty,
           updated_at = now()
      from (
        select x ->> 'sku' as sku, sum((x ->> 'quantity')::int) as qty
          from jsonb_array_elements(o.stock_items) as x
         group by 1
      ) s
     where i.sku = s.sku;
  end if;

  return query select * from public.orders where id = p_order_id;
end;
$$;

revoke all on function public.mark_order_paid(uuid, text, text, text, boolean) from public, anon, authenticated;
