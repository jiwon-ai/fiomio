-- Fiomio data flywheel v2 (Phase 1) — make the anonymous dataset ML-ready.
-- All changes are ADDITIVE and idempotent: safe to run on the existing tables,
-- no data is dropped or rewritten. Run in the Supabase SQL editor.
--
-- Goal: stitch the funnel (search -> diagnostic -> impression -> click) with
-- stable keys, capture impressions (negative samples), store ranked/scored
-- recommendations, and version every row by engine + schema.

-- 1) diagnostics: funnel keys, versioning, structured recommendations
alter table public.diagnostics add column if not exists anon_id          text;
alter table public.diagnostics add column if not exists session_id       text;
alter table public.diagnostics add column if not exists engine_version   text;
alter table public.diagnostics add column if not exists schema_version   text;
-- recommendations: [{ "active_id": "niacinamide", "score": 7.42, "rank": 1 }, ...]
alter table public.diagnostics add column if not exists recommendations  jsonb;

-- 2) product_clicks: link the click (the label) back to its diagnostic + funnel,
--    identify the product against the catalog, and record its rank in the list
alter table public.product_clicks add column if not exists diag_id        text;
alter table public.product_clicks add column if not exists anon_id        text;
alter table public.product_clicks add column if not exists session_id     text;
alter table public.product_clicks add column if not exists product_id     text;
alter table public.product_clicks add column if not exists barcode        text;
alter table public.product_clicks add column if not exists rank           int;
alter table public.product_clicks add column if not exists region         text;
alter table public.product_clicks add column if not exists engine_version text;
alter table public.product_clicks add column if not exists schema_version text;

-- 3) search_queries: funnel keys + versioning
alter table public.search_queries add column if not exists anon_id        text;
alter table public.search_queries add column if not exists session_id     text;
alter table public.search_queries add column if not exists schema_version text;

-- 4) impressions: what was SHOWN (the denominator for CTR + negative samples).
--    One row per shown product per diagnostic result view.
create table if not exists public.product_impressions (
  id             uuid primary key default gen_random_uuid(),
  diag_id        text,
  anon_id        text,
  session_id     text,
  product_id     text,
  brand          text,
  product_name   text,
  active_id      text,
  rank           int,
  source         text,
  city           text,
  season         text,
  temp_c         double precision,
  humidity       double precision,
  uv             double precision,
  engine_version text,
  schema_version text,
  lang           text,
  created_at     timestamptz not null default now()
);

-- 5) indexes for the joins the training pipeline will actually do
create index if not exists idx_clicks_diag      on public.product_clicks (diag_id);
create index if not exists idx_clicks_anon      on public.product_clicks (anon_id);
create index if not exists idx_clicks_created   on public.product_clicks (created_at);
create index if not exists idx_impr_diag        on public.product_impressions (diag_id);
create index if not exists idx_impr_anon        on public.product_impressions (anon_id);
create index if not exists idx_impr_created     on public.product_impressions (created_at);
create index if not exists idx_diag_anon        on public.diagnostics (anon_id);
create index if not exists idx_diag_created     on public.diagnostics (created_at);

-- Written server-side with the service key; these tables hold no personal data,
-- so no RLS policy is required (service role bypasses RLS anyway).
