-- Living Archive of Queer Making — shared backend schema.
-- Run this in the Supabase project's SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: policies are dropped and recreated, tables/bucket use
-- IF NOT EXISTS / ON CONFLICT so nothing errors out on a second run.
--
-- No Supabase Auth account needed — the admin "log in" is a single shared
-- passcode you choose yourself, checked server-side (see the bottom of
-- this file). Only you ever need to know it; it's never sent to or stored
-- anywhere else.
--
-- Auto-hide threshold: an entry is hidden from public view once it collects
-- REPORT_THRESHOLD reports (set to 3 below — change it before running if
-- you want a different number).

create extension if not exists pgcrypto;

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
  thumbnail_url text,
  x double precision not null,
  y double precision not null,
  report_count integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- For a database that already had this table before thumbnail_url existed.
alter table entries add column if not exists thumbnail_url text;

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

-- Single-row table holding the admin passcode's hash. Never holds the
-- passcode itself in plain text.
create table if not exists admin_config (
  id boolean primary key default true check (id),
  passcode_hash text not null
);

alter table entries enable row level security;
alter table reports enable row level security;
alter table admin_config enable row level security;

-- Drop any policies from an earlier version of this schema that used
-- Supabase Auth roles — this project no longer uses Auth at all.
drop policy if exists "admin read all entries" on entries;
drop policy if exists "admin update entries" on entries;
drop policy if exists "admin delete entries" on entries;
drop policy if exists "admin read reports" on reports;
drop policy if exists "admin delete offerings" on storage.objects;

-- Everyone (including logged-out visitors) can see entries that aren't
-- hidden. Nothing can read/write admin_config directly — only the
-- functions below (as SECURITY DEFINER) touch it.
drop policy if exists "public read visible entries" on entries;
create policy "public read visible entries" on entries
  for select using (not hidden);

drop policy if exists "public insert entries" on entries;
create policy "public insert entries" on entries
  for insert with check (true);

-- Storage: anyone can upload/read offerings; nothing can delete objects
-- directly (the admin delete only removes the database row — an orphaned
-- file left in storage is a fine trade-off for keeping this simple).
-- file_size_limit is set to Supabase's free-tier ceiling (50MB) — raise it
-- here if this project is on a paid plan with a higher limit.
insert into storage.buckets (id, name, public, file_size_limit)
  values ('offerings', 'offerings', true, 52428800)
  on conflict (id) do update set file_size_limit = excluded.file_size_limit;

drop policy if exists "public read offerings" on storage.objects;
create policy "public read offerings" on storage.objects
  for select using (bucket_id = 'offerings');

drop policy if exists "public upload offerings" on storage.objects;
create policy "public upload offerings" on storage.objects
  for insert with check (bucket_id = 'offerings');

-- Reporting goes through this function rather than a direct table write,
-- so a visitor can only ever add a report row and bump the entry's own
-- counter — nothing else on the entries table is exposed to them.
create or replace function report_entry(p_entry_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  report_threshold constant integer := 3;
begin
  insert into reports (entry_id, reason) values (p_entry_id, p_reason);

  update entries
    set report_count = report_count + 1,
        hidden = (report_count + 1) >= report_threshold
    where id = p_entry_id;
end;
$fn$;

grant execute on function report_entry(uuid, text) to anon, authenticated;

-- Checks a passcode against the stored hash. Returns true/false; never
-- reveals the hash itself to the caller.
create or replace function verify_admin_passcode(p_passcode text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  stored_hash text;
begin
  select passcode_hash into stored_hash from admin_config where id = true;
  if stored_hash is null then
    return false;
  end if;
  return stored_hash = crypt(p_passcode, stored_hash);
end;
$fn$;

grant execute on function verify_admin_passcode(text) to anon, authenticated;

-- Returns every entry, hidden included, only when the passcode is correct.
create or replace function admin_list_entries(p_passcode text)
returns setof entries
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not verify_admin_passcode(p_passcode) then
    raise exception 'invalid passcode';
  end if;
  return query select * from entries order by created_at asc;
end;
$fn$;

grant execute on function admin_list_entries(text) to anon, authenticated;

-- Deletes an entry only when the passcode is correct.
create or replace function admin_delete_entry(p_passcode text, p_entry_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not verify_admin_passcode(p_passcode) then
    raise exception 'invalid passcode';
  end if;
  delete from entries where id = p_entry_id;
  return found;
end;
$fn$;

grant execute on function admin_delete_entry(text, uuid) to anon, authenticated;

-- Sets an entry's thumbnail_url only when the passcode is correct — used to
-- backfill PDF/link previews for entries that predate that feature.
create or replace function admin_update_thumbnail(p_passcode text, p_entry_id uuid, p_thumbnail_url text)
returns boolean
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not verify_admin_passcode(p_passcode) then
    raise exception 'invalid passcode';
  end if;
  update entries set thumbnail_url = p_thumbnail_url where id = p_entry_id;
  return found;
end;
$fn$;

grant execute on function admin_update_thumbnail(text, uuid, text) to anon, authenticated;

-- Dismisses all reports on an entry and un-hides it — only when the
-- passcode is correct. Deletes the underlying report rows too, not just
-- the counter, since a dismissed report shouldn't linger in the table.
create or replace function admin_clear_reports(p_passcode text, p_entry_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not verify_admin_passcode(p_passcode) then
    raise exception 'invalid passcode';
  end if;
  delete from reports where entry_id = p_entry_id;
  update entries set report_count = 0, hidden = false where id = p_entry_id;
  return found;
end;
$fn$;

grant execute on function admin_clear_reports(text, uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Run this last, once, with your own passcode in place of the
-- placeholder below. Re-running it changes the passcode.
-- ---------------------------------------------------------------------
-- insert into admin_config (id, passcode_hash)
--   values (true, crypt('CHOOSE-A-PASSCODE-HERE', gen_salt('bf')))
--   on conflict (id) do update set passcode_hash = excluded.passcode_hash;
