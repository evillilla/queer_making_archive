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

Seed entries live in `src/data/entries.ts` — replace them with the real archive content
whenever it's available. Visitor submissions are stored in the browser's `localStorage`
(`src/hooks/useEntries.ts`), so **they persist only for that visitor, in that browser** — there's
no shared backend. To make submissions visible to everyone, this needs a real backend (a
small serverless API + database, or Wix Data/Collections via Velo if this ends up embedded
through Velo rather than a plain iframe).

Similarly, the "file" inputs in the submission form only capture a filename for display —
there's no file storage wired up yet.

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
