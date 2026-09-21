-- Living Archive of Queer Making — shared backend schema.
-- Run this once in the Supabase project's SQL editor (Project > SQL Editor > New query).
--
-- Auto-hide threshold: an entry is hidden from public view once it collects
-- REPORT_THRESHOLD reports. Change the "3" below before running if you want
-- a different number.

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  thread text not null,
  source text not null,
  title text not null,
  offered_by text,
  tagline text,
  excerpt text,
  body text,
  link text,
  image_url text,
  file_name text,
  x double precision not null,
  y double precision not null,
  report_count integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

alter table entries enable row level security;
alter table reports enable row level security;

-- Anyone (including logged-out visitors) can see entries that aren't hidden.
create policy "public read visible entries" on entries
  for select using (not hidden);

-- The signed-in admin can see everything, hidden included, for moderation.
create policy "admin read all entries" on entries
  for select to authenticated using (true);

-- Anyone can submit a new offering.
create policy "public insert entries" on entries
  for insert with check (true);

-- Only the signed-in admin can edit or delete entries directly.
create policy "admin update entries" on entries
  for update to authenticated using (true);

create policy "admin delete entries" on entries
  for delete to authenticated using (true);

-- Only the signed-in admin can read report reasons.
create policy "admin read reports" on reports
  for select to authenticated using (true);

-- Reporting goes through this function rather than a direct table write,
-- so a visitor can only ever add a report row and bump the entry's own
-- counter — nothing else on the entries table is exposed to them.
create or replace function report_entry(p_entry_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  report_threshold constant integer := 3;
begin
  insert into reports (entry_id, reason) values (p_entry_id, p_reason);

  update entries
    set report_count = report_count + 1,
        hidden = (report_count + 1) >= report_threshold
    where id = p_entry_id;
end;
$$;

grant execute on function report_entry(uuid, text) to anon, authenticated;
