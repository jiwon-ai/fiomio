-- Fiomio: account-based saved results and skin tracking.
-- Run this in the Supabase SQL editor. Enable Email and (optionally) Google
-- and Apple providers in Authentication settings.

create table if not exists public.saved_diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  result jsonb not null,
  lang text,
  created_at timestamptz not null default now()
);

create table if not exists public.skin_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date date not null default current_date,
  hydration int,
  comfort int,
  breakouts int,
  sensitivity int,
  note text,
  created_at timestamptz not null default now()
);

alter table public.saved_diagnostics enable row level security;
alter table public.skin_checkins enable row level security;

-- Each user can only read and write their own rows.
create policy "own saved_diagnostics" on public.saved_diagnostics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own skin_checkins" on public.skin_checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
