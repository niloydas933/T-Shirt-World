-- T-Shirt World Supabase setup
-- Run this in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0,
  old_price numeric,
  category text,
  sizes text default 'S, M, L, XL, XXL',
  description text,
  image text,
  featured boolean default false,
  active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  size text,
  quantity integer default 1,
  notes text,
  items jsonb,
  total numeric default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products" on public.products
for select using (active = true);

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated using (true) with check (true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders" on public.orders
for insert to anon, authenticated with check (true);

drop policy if exists "Admins view orders" on public.orders;
create policy "Admins view orders" on public.orders
for select to authenticated using (true);

-- After running this, create your admin user in:
-- Supabase Dashboard > Authentication > Users > Add user.
-- Use an email/password you control.
