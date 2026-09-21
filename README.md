# Living Archive of Queer Making

A standalone clone of the [queer-making.base44.app](https://queer-making.base44.app/) archive,
built as a static React app so it can be embedded into a Wix Studio page (e.g. via an iframe/
Embed a Site element).

## What's here

- A pannable, zoomable canvas of scattered "offering" cards, filterable by Kind, Thread, and
  Source.
- A detail modal for each entry.
- An "Offer something" submission form (`/#/offer`) that lets visitors add a new entry.
- `Quipo` for titles/buttons, `Inclusive Sans` for everything else (`src/fonts/`).

## Content and data

Entries are stored in Supabase (Postgres + file storage) so submissions, reports, and
deletions are shared and persistent across every visitor — not just the browser that made
them. Seed/demo content that ships with the repo lives in `src/data/entries.ts`, but it's only
used as a local fallback when Supabase isn't configured (see below); once Supabase is wired
up, everything comes from the database instead.

- Anyone can submit an offering (image, sound, video, PDF, font, writing, or a link) — no
  account needed. Uploaded files go to a public Supabase Storage bucket.
- Anyone can report an offering, with an optional reason. After 3 reports it's automatically
  hidden from public view (still visible to the admin, marked "Hidden").
- The site owner can log in as admin (bottom-left "Admin" button) and delete any offering.
  Admin login is a single shared passcode you choose (see setup below) — not a full user
  account system, which is deliberately overkill for a single-moderator project. The passcode
  is checked server-side (via a Postgres function, hashed at rest) and never shipped in the
  app's code, but it is a shared secret rather than a personal login — anyone who has it can
  delete things, so treat it like a door key, not a password you'd reuse elsewhere.

### Backend setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/schema.sql` from this repo (safe to re-run).
3. Still in the SQL Editor, run the commented-out block at the bottom of that file, with your
   own chosen passcode in place of the placeholder — that's what sets/changes the admin
   passcode. Nobody else needs to see this, including whoever builds this app for you.
4. In Project Settings → API, copy the **Project URL** and **anon/publishable key** into a
   `.env` file (copy `.env.example` and fill it in). Never use the *secret*/service-role key
   here — it must never appear in client-side code.

Without a `.env`, the app falls back to read-only demo content from `src/data/entries.ts` —
submissions, reports, and admin login are no-ops in that mode.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site in `dist/`, deployable to any static host (Netlify, Vercel, GitHub
Pages, etc.) and then embedded into Wix Studio via an iframe pointing at that URL.

Routing uses `HashRouter` (URLs like `/#/offer`) specifically so the app works correctly when
served as a static bundle from any host or iframe, without needing server-side rewrite rules.
