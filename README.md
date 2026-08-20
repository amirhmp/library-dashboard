# قفسه (Stackroom) — Library Admin Dashboard

A mobile-first, **Farsi (RTL)** library admin dashboard built with plain
HTML + Tailwind CSS v4. Class project — see `TEACHER_GUIDE.md` for how to
live-code this in a 3-hour session.

## ⚠️ Before you run this: add the font

This project loads Vazirmatn **locally** — no Google Fonts, no CDN. The
`@font-face` rule is already wired up in `src/style.css`, but the actual
font file isn't included (by design — see below). Follow
**`public/fonts/README.md`** to grab it (one file, one download) before
`npm run dev`, or Persian text will fall back to Tahoma/Arial instead of
Vazirmatn.

## Stack

- **Vite** — dev server + bundler. No framework (vanilla template).
- **Tailwind CSS v4**, via the official `@tailwindcss/vite` plugin — this is what
  makes `@theme` and `@import "tailwindcss"` work as real CSS, not a CDN trick.
- **Plain HTML only.** No JS templating, no components-as-files, no build-time
  includes. Each page is a full, real `.html` file.
- **~25 lines of vanilla JS** (`src/main.js`) — and *only* for two things:
  dark/light theme toggle, and opening/closing the sidebar on mobile.
- **Farsi / RTL throughout** — every page is `<html lang="fa" dir="rtl">`.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`). You'll land on
`index.html` (the dashboard). Visit `/login.html` for the sign-in page, or any
file under `/components/` to test a piece in isolation, e.g.
`http://localhost:5173/components/sidebar.html`.

`npm run build` produces a production build of every page into `dist/` (used
here just to sanity-check everything compiles — not required for the class).

## Project structure

```
├── index.html                 ← FINAL dashboard page (assembled)
├── login.html                 ← FINAL sign-in page (assembled)
├── components/                ← one isolated file per piece, for building/testing separately
│   ├── sidebar.html
│   ├── topbar.html
│   ├── stat-cards.html
│   ├── book-table.html
│   ├── activity.html
│   └── login-card.html
├── public/
│   └── fonts/
│       └── README.md          ← exactly which font file to download and drop here
├── src/
│   ├── style.css               ← @font-face + @theme tokens + @layer components
│   └── main.js                 ← the only JS: theme toggle + mobile aside toggle
├── vite.config.js
└── TEACHER_GUIDE.md
```

Every component file has a clearly marked
`<!-- ================= COPY FROM HERE ================= -->` ...
`<!-- ================= COPY TO HERE ================= -->` block. That exact
block is what gets pasted into `index.html` / `login.html` during assembly —
nothing needs to be rewritten, only moved.

## Design tokens (`src/style.css` → `@theme`)

"Ink & Brass" palette — navy `primary` for structure, warm brass `secondary`
for accents — plus `success` / `warning` / `danger` status colors, and a
`surface` / `surface-dark` pair that drives dark mode. One font family,
**Vazirmatn**, for both display and body text (it's a variable font, so
headings vs. body is just a font-weight difference) — see
`public/fonts/README.md` for why Vazirmatn over IRANSans.

## RTL notes

- Everything direction-sensitive uses Tailwind's **logical** utilities —
  `ps-`/`pe-` (padding-inline-start/end), `ms-`/`me-` (margin-inline-start/end),
  `start-`/`end-` (inset-inline-start/end), `text-start`/`text-end` — instead
  of `pl-`/`pr-`/`ml-`/`mr-`/`left-`/`right-`/`text-left`/`text-right`. These
  resolve automatically from `dir="rtl"` on `<html>`, so nothing had to be
  manually mirrored value-by-value.
- `uppercase` / `tracking-wide` were removed everywhere they appeared (status
  stamps, table headers, sidebar section labels). Persian has no letter case,
  and letter-spacing breaks the cursive joining between Persian letters — both
  utilities actively hurt legibility on this script, not just "don't apply."
- The logout icon is horizontally mirrored (`-scale-x-100`) since it's a
  directional arrow; purely decorative icons (search, bell, book, clock, …)
  were left as-is.
- Numbers and dates in the sample data use Persian digits (۰–۹) and a
  Jalali-style date format (`۳۱ مرداد ۱۴۰۵`), consistent with how these
  dashboards are typically localized in Iran.
