-- Fiomio: anonymous demand signals (no personal data). Run in Supabase SQL editor.
-- Written server-side with the service key; no RLS policy needed.

create table if not exists public.product_clicks (
  id uuid primary key default gen_random_uuid(),
  product_name text,
  brand text,
  active_id text,
  source text,
  city text,
  season text,
  lang text,
  created_at timestamptz not null default now()
);

create table if not exists public.search_queries (
  id uuid primary key default gen_random_uuid(),
  query text,
  result_count int,
  found boolean,
  city text,
  lang text,
  created_at timestamptz not null default now()
);
