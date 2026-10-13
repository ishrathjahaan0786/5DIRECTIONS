-- ============================================================
-- 5Directions Supply Chain Platform — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users / Profiles ──────────────────────────────────────
-- Automatically created from auth.users via trigger
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  company_name text,
  role        text check (role in ('company','supplier')),
  created_at  timestamptz default now()
);

-- Trigger to auto-insert profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, company_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Materials (Supplier-owned) ─────────────────────────────
create table if not exists public.materials (
  id            uuid primary key default uuid_generate_v4(),
  supplier_id   uuid references public.profiles(id) on delete cascade,
  name          text not null,
  sku           text,
  form          text,
  unit          text default 'units',
  qty_available int  default 0,
  qty_allocated int  default 0,
  unit_price    numeric(10,2) default 0,
  lead_time     text,
  cert_status   text default 'Pending',
  cert_name     text,
  spec          text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Suppliers (public listing) ─────────────────────────────
create table if not exists public.suppliers (
  id           uuid primary key default uuid_generate_v4(),
  profile_id   uuid references public.profiles(id) on delete cascade,
  country      text,
  rating       numeric(3,1) default 5.0,
  reliability  numeric(5,2) default 100.0,
  is_backup    boolean default false,
  certs        text[],
  created_at   timestamptz default now()
);

-- ── Orders ────────────────────────────────────────────────
create table if not exists public.orders (
  id           uuid primary key default uuid_generate_v4(),
  po_number    text unique not null,
  company_id   uuid references public.profiles(id),
  supplier_id  uuid references public.profiles(id),
  material_id  uuid references public.materials(id),
  material_name text,
  qty          int default 0,
  unit         text default 'units',
  unit_price   numeric(10,2) default 0,
  total_value  numeric(12,2) generated always as (qty * unit_price) stored,
  status       text default 'Pending' check (status in ('Pending','Accepted','Preparing','Dispatched','Delivered','Declined')),
  stage        int  default 0,
  carrier      text,
  batch_number text,
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Certificates ──────────────────────────────────────────
create table if not exists public.certificates (
  id           uuid primary key default uuid_generate_v4(),
  supplier_id  uuid references public.profiles(id) on delete cascade,
  material_id  uuid references public.materials(id),
  name         text not null,
  standard     text,
  status       text default 'Valid' check (status in ('Valid','Pending','Expired','Audit Passed')),
  valid_until  date,
  file_url     text,
  created_at   timestamptz default now()
);

-- ── Allocations ──────────────────────────────────────────
create table if not exists public.allocations (
  id           uuid primary key default uuid_generate_v4(),
  company_id   uuid references public.profiles(id),
  material_id  uuid references public.materials(id),
  supplier_id  uuid references public.profiles(id),
  percentage   int check (percentage between 0 and 100),
  is_primary   boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.materials    enable row level security;
alter table public.orders       enable row level security;
alter table public.certificates enable row level security;
alter table public.allocations  enable row level security;
alter table public.suppliers    enable row level security;

-- Profiles: users can read all, edit own
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can update own profile"   on public.profiles for update using (auth.uid() = id);

-- Materials: supplier owns, companies can read
create policy "Materials publicly readable"      on public.materials for select using (true);
create policy "Suppliers manage own materials"   on public.materials for all    using (auth.uid() = supplier_id);

-- Orders: company or supplier can see their own
create policy "Company sees own orders"   on public.orders for select using (auth.uid() = company_id);
create policy "Supplier sees own orders"  on public.orders for select using (auth.uid() = supplier_id);
create policy "Company creates orders"    on public.orders for insert with check (auth.uid() = company_id);
create policy "Supplier updates orders"   on public.orders for update using (auth.uid() = supplier_id);

-- Certs: public read, supplier manages own
create policy "Certs publicly readable"    on public.certificates for select using (true);
create policy "Suppliers manage own certs" on public.certificates for all    using (auth.uid() = supplier_id);

-- Allocations: company manages own
create policy "Company manages allocations" on public.allocations for all using (auth.uid() = company_id);

-- Suppliers listing: public read
create policy "Suppliers publicly readable" on public.suppliers for select using (true);
create policy "Suppliers manage own listing" on public.suppliers for all using (auth.uid() = profile_id);
