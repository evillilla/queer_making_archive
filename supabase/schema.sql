-- Living Archive of Queer Making — shared backend schema.
-- Run this in the Supabase project's SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: policies are dropped and recreated, tables/bucket use
-- IF NOT EXISTS / ON CONFLICT so nothing errors out on a second run.
--
-- Auto-hide threshold: an entry is hidden from public view once it collects
-- REPORT_THRESHOLD reports (set to 3 below — change it before running if
-- you want a different number).

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
  file_url text,
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

drop policy if exists "public read visible entries" on entries;
create policy "public read visible entries" on entries
  for select using (not hidden);

drop policy if exists "admin read all entries" on entries;
create policy "admin read all entries" on entries
  for select to authenticated using (true);

drop policy if exists "public insert entries" on entries;
create policy "public insert entries" on entries
  for insert with check (true);

drop policy if exists "admin update entries" on entries;
create policy "admin update entries" on entries
  for update to authenticated using (true);

drop policy if exists "admin delete entries" on entries;
create policy "admin delete entries" on entries
  for delete to authenticated using (true);

drop policy if exists "admin read reports" on reports;
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

-- Storage bucket for uploaded offerings (images, sounds, videos, PDFs,
-- fonts, anything else). Public read so cards/modals can just link
-- straight to the file; upload is open to anyone (matches "no account
-- needed" submissions); only the admin can delete an object directly.
insert into storage.buckets (id, name, public)
  values ('offerings', 'offerings', true)
  on conflict (id) do nothing;

drop policy if exists "public read offerings" on storage.objects;
create policy "public read offerings" on storage.objects
  for select using (bucket_id = 'offerings');

drop policy if exists "public upload offerings" on storage.objects;
create policy "public upload offerings" on storage.objects
  for insert with check (bucket_id = 'offerings');

drop policy if exists "admin delete offerings" on storage.objects;
create policy "admin delete offerings" on storage.objects
  for delete to authenticated using (bucket_id = 'offerings');
