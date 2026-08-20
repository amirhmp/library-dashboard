# Teacher's Guide — Live-Coding the Library Dashboard in 3 Hours

This project is pre-structured so you are never writing boilerplate live. Every
phase below has: a time budget, what to type/explain, and the specific
mistakes students make at that step (so you can pre-empt or fix them fast
instead of debugging live for ten minutes).

**Total: ~175 min of the 180-min slot**, leaving a small buffer. If you're
tight on time, the phases marked ✂️ are the safest to shorten or skip.

Before class: run `npm install` on the demo machine once so the download
isn't eating into class time, and confirm the projector shows dark mode
colors accurately (a dim projector makes the dark palette hard to read).
**Also before class:** follow `public/fonts/README.md` to download and place
the Vazirmatn font file — do this ahead of time, not live, since it's a
one-time download unrelated to anything being taught.

This version of the project is Farsi (RTL) throughout. Phase 3's "mobile-first"
mental model still applies exactly as written; the one addition worth a single
sentence when you get there is that `start-*`/`end-*`/`ps-*`/`ms-*` (used
instead of `left-*`/`pl-*`/`ml-*`) automatically follow the page's `dir="rtl"`,
so nothing in the class needs separate LTR/RTL versions.

---

## 1. Kickoff & orientation — 10 min

**Goal:** everyone has the project running and understands *why* it's
structured this way before touching code.

- `npm install && npm run dev`, open `http://localhost:5173`.
- Walk through the folder tree (see `README.md`). One sentence per folder:
  - `index.html` / `login.html` → the two real deliverables.
  - `components/*.html` → scratch pads, each a full page, for building and
    testing one piece at a time without the rest of the dashboard in the way.
  - `src/style.css` → the shared design system (tokens + reusable classes).
  - `src/main.js` → the *only* JavaScript, and only for two jobs.
- Open `components/stat-cards.html` in the browser as a live example of "a
  component file" before writing anything, so the pattern is concrete.

**Common confusion:** students expect `components/*.html` to be "included"
into `index.html` automatically (like a framework). Say explicitly: *there is
no include mechanism — plain HTML can't do that.* Assembly in phase 10 is a
manual copy-paste of one clearly marked block. That's a feature for a first
project, not a limitation: they see the whole page they're shipping.

---

## 2. Defining the theme — 15 min

**Goal:** everyone understands `@theme` and has typed the token block once.

Open `src/style.css`. Explain the mental model:

```css
@import "tailwindcss";

@theme {
  --color-primary-600: #2c3a58;
  --font-display: "Fraunces", serif;
}
```

Any `--color-*`, `--font-*`, `--radius-*` variable defined inside `@theme`
becomes real Tailwind utilities: `--color-primary-600` → `bg-primary-600`,
`text-primary-600`, `border-primary-600`, etc. This is **Tailwind v4's whole
pitch**: no separate `tailwind.config.js`, the theme *is* CSS.

Live-type a reduced version together (5–6 colors, not the full palette — copy
the rest from the finished file after), then define the class-based dark mode
switch right under it:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Explain: without this line, `dark:` utilities only ever respond to the OS/
browser preference. This line makes `dark:` respond to a `.dark` class on
`<html>` instead — which is what lets *our own toggle button* (phase 11)
control it.

**Common pitfalls:**
- Forgetting `@import "tailwindcss";` at the very top → nothing works, no
  error either. Make this the first line you type, before anything else.
- Typing color values without the `--color-` prefix (e.g. `--primary-600`) →
  Tailwind won't generate a utility for it. The prefix is what tells Tailwind
  which utility family to generate.
- Confusing `@theme` (design tokens → utilities) with `@layer components`
  (custom classes) — reassure them phase 4 is coming, this phase is only
  tokens.

---

## 3. Design concepts — layout skeleton, mobile-first — 10 min ✂️

**Goal:** agree on the shape of the page *before* writing components, so
nobody builds a sidebar that doesn't match the final layout.

On the whiteboard/slide, sketch two boxes:

```
MOBILE                          DESKTOP (md: and up)
┌─────────────────┐             ┌────┬──────────────────┐
│     topbar       │             │side│     topbar        │
├─────────────────┤             │bar ├──────────────────┤
│                   │             │    │                    │
│      main         │             │    │       main          │
│  (aside hidden,   │             │    │                    │
│  slides in over)  │             │    │                    │
└─────────────────┘             └────┴──────────────────┘
```

Say the rule explicitly, it's the single most important idea in the whole
project: **write the mobile classes with no prefix, then add `md:` /
`lg:` prefixes for anything that changes on wider screens.** e.g.
`w-72 -translate-x-full md:static md:translate-x-0` reads as "off-canvas by
default, pinned open from `md` up."

Mention breakpoints once and move on — `sm:` ≈ 640px, `md:` ≈ 768px,
`lg:` ≈ 1024px, `xl:` ≈ 1280px. Don't derive these live, just state them.

---

## 4. Common utilities & shared components — 20 min

**Goal:** the reusable class vocabulary (`.btn-primary`, `.card`, `.input`,
`.stamp-*`, `.nav-link`, `.avatar`) exists before anyone builds a component
that needs it.

This is the layer that keeps `index.html` from turning into a wall of
repeated utility strings. Type 2–3 of these live so the pattern lands, then
paste the rest from the finished `style.css` (typing all ~10 verbatim eats
the clock without teaching anything new after the third one). Good ones to
type live: `.btn-primary`, `.card`, `.stamp-borrowed`.

```css
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
           text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700
           dark:bg-secondary-500 dark:text-primary-900;
  }
}
```

**The single biggest gotcha in this whole project — flag it before anyone
hits it:** in Tailwind v4, `@apply` can only pull in *real Tailwind
utilities*, not another class you defined in this same file. So you **cannot**
write `.btn-secondary { @apply btn ... }` to "extend" a base `.btn` — it
fails the build with `Cannot apply unknown utility class`. Every variant
needs its full utility list spelled out. It's more typing, but it's honest:
each class in `style.css` is exactly what it looks like, no hidden
inheritance to trace.

Point out the signature element while you're here: `.stamp-*` (dashed
border, uppercase mono, slight rotation) is deliberately styled like an ink
due-date stamp on a library card — it's the one place this dashboard commits
to "library," not "generic admin panel." Good moment to ask: *where else in
a library could this stamp motif show up?*

---

## 5. Build: Sidebar / Aside — 20 min

Open `components/sidebar.html`. It already has a test harness (a button and
some instructional text) — the actual component is between the
`COPY FROM HERE` / `COPY TO HERE` comments.

Live-code order (build mobile-first, then widen the browser):
1. The `<aside>` shell: `fixed inset-y-0 left-0 w-72 bg-primary-700`.
2. Off-canvas state: `-translate-x-full transition-transform duration-200`.
3. Desktop override: `md:static md:translate-x-0` — resize the browser here
   and watch it snap into place. This is the payoff moment for phase 3's
   mental model.
4. Logo row, nav links (`.nav-link` / `.nav-link-active`), footer
   avatar block.
5. Last: the backdrop `<div data-aside-backdrop>` and `z-30`/`z-40` stacking
   — explain the backdrop must sit *behind* the aside but *above* the page,
   which is why it needs its own z-index between the two.

**Common pitfalls:**
- `-translate-x-full` and `translate-x-0` fighting each other because both
  were left on the element — this is intentional, `main.js` toggles between
  them later, but *right now with no JS wired up* the aside should just sit
  off-canvas on mobile / static on desktop. If a student adds JS early and
  gets confused, remind them phase 11 is where that logic lives — don't debug
  JS during a CSS phase.
- Forgetting `md:static` and only adding `md:translate-x-0` → the aside stays
  `fixed`, so on desktop it overlaps the content instead of sitting beside it.
- z-index arguments purely by trial and error. Say the rule instead: backdrop
  and aside must both beat the page's normal content, and aside must beat the
  backdrop, so `backdrop < aside`.

---

## 6. Build: Topbar — 15 min

Open `components/topbar.html`. Build left → right:

1. Mobile menu button (`data-aside-toggle`, `md:hidden`) — this is the button
   `main.js` will wire up in phase 11 to open the sidebar from phase 5.
2. Search input — `hidden sm:block` on the wrapper, so it disappears below
   `sm` rather than squeezing.
3. Right-side icon cluster: notification bell, theme toggle
   (`data-theme-toggle`), avatar.
4. The **sun/moon swap** is pure CSS, no JS yet: two `<svg>`s, one
   `class="hidden dark:block"`, the other `class="dark:hidden"`. Toggle the
   `dark` class by hand in the browser dev tools (`<html class="dark">`) to
   prove it works *before* JS exists — this isolates "does the CSS respond to
   `.dark`" from "does the button add `.dark`," which is the debugging skill
   worth teaching here.

**Common pitfalls:**
- Icon swap shows both icons at once → almost always a missing `dark:` on one
  of the two `hidden` classes, or the two SVGs not being siblings.
- `sticky top-0` on the header doing nothing → the parent needs to actually
  scroll (this bites more in the standalone test file, which is intentionally
  short — mention it'll behave correctly once real content exists on the
  assembled dashboard).

---

## 7. Build: Stat cards — 15 min

Open `components/stat-cards.html`. This phase is mostly a repetition drill,
not new concepts, which is why it's short:

- One `.stat-card` fully by hand (icon chip + number + label).
- Then the grid wrapper: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
  gap-4` — resize the browser and count columns changing at each breakpoint.
- Copy the first card 3 times, swap icon color / number / label per card.

**Common pitfall:** `gap-4` on the grid vs `space-y-4`/`gap-4` inside a
card — students sometimes reach for margin utilities on the children instead
of `gap-*` on the parent grid, producing uneven spacing at the wrap point.
Redirect to `gap-*` on the container every time.

---

## 8. Build: Book table — 20 min

Open `components/book-table.html`. Build in this order:

1. The `.card` wrapper and header row (title + "New loan" button).
2. `<table class="data-table">` with a couple of rows, typed live.
3. Wrap the `<table>` in `<div class="overflow-x-auto">` — then shrink the
   browser below ~640px and let the table scroll *inside its card* instead of
   breaking the page. This is the concrete payoff of `data-table`'s
   `min-w-[640px]` (defined once in `style.css`, not per-page).
4. Status column: `.stamp-available` / `.stamp-borrowed` / `.stamp-overdue`.

**Common pitfalls:**
- Table breaks the whole page layout on mobile → missing `overflow-x-auto`
  wrapper, or it's on the wrong element (must wrap the `<table>` itself, not
  the `.card`).
- Long book titles wrapping awkwardly → this is fine and expected; don't let
  students chase pixel-perfect column widths here, it's not the lesson.

---

## 9. Sign-in page — 10 min ✂️

You noted this one is straightforward, so keep it that way: it's almost
entirely a reuse of classes already built (`.card`, `.input-search`,
`.field-label`, `.btn-primary`). Open `components/login-card.html`, build the
form fields top to bottom, and call out that this phase is *proof the
component system works* — nothing here is new syntax, only new arrangement.

If you're short on time, this is the safest phase to trim to 5 minutes or
have students finish independently.

---

## 10. Assemble `index.html` — 15 min

This is where "one file per component" pays off. For each component file,
select everything between its `COPY FROM HERE` / `COPY TO HERE` comments and
paste it into `index.html` in this order: sidebar → topbar → stat cards →
table + activity side-by-side (`grid lg:grid-cols-3`, table `lg:col-span-2`).

**Do this step live and slowly** — it's less about typing and more about the
moment students realize the whole dashboard is just their own components
stacked in a `<div class="flex min-h-screen">` wrapper (aside + a
`flex-1 flex-col` column holding topbar + `<main>`).

**Common pitfalls:**
- Pasting a component's `<html>`/`<head>` tags along with the body content →
  remind everyone: only the marked block, never the boilerplate around it.
- Two `data-aside-toggle` buttons ending up on the page (one pasted in twice)
  → `main.js` only opens/closes based on `[data-aside]` existing once;
  duplicate triggers still work as buttons but signal a copy-paste slip worth
  catching.

---

## 11. JavaScript: theme + aside toggles — 15 min

This is the only JS in the project — say that plainly, it lowers anxiety for
a class that's spent 2.5 hours in pure HTML/CSS. Open `src/main.js`, already
wired into every page via `<script type="module" src="/src/main.js">` in the
`<head>`.

Walk through both blocks (they're independent, ~10 lines each):

```js
const themeToggle = document.querySelector('[data-theme-toggle]');
themeToggle?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

Point out the `?.` — this file is imported on *every* page including
component test files that don't all have a theme button, so every selector
is guarded. This is why the same `main.js` never throws an error on
`components/stat-cards.html`, which has no toggle at all.

For the aside: `setAsideOpen(open)` toggles the same two translate classes
students hand-toggled with dev tools back in phase 5 — connect that dot
explicitly ("this is the function doing what you did by hand earlier").

**Common pitfalls:**
- Wiring a *second* `click` listener directly in HTML (`onclick="..."`) out
  of habit from tutorials — remind them the brief only allows this one
  `main.js` file, and it already covers both behaviors.
- Dark mode "flashing" light for a split second on page load — this is
  expected with this simple an approach (`applyStoredTheme()` runs after the
  page starts rendering). Worth naming as a known trade-off rather than a bug
  to chase; fixing it needs a blocking inline script in `<head>`, which is a
  good stretch-goal for advanced students, not a live-coding detour.

---

## 12. Responsive QA + wrap-up — 10 min

- Resize from narrow to wide slowly on `index.html`, narrating each
  breakpoint: aside slides in/out, search bar appears, avatar name appears.
- Toggle dark mode on both `index.html` and `login.html`.
- Tab through the sign-in form with keyboard only — the `focus-visible:`
  rings in `.btn-primary` / `.input` should be visible. This is a good
  30-second accessibility check to make a habit of.
- Ask: *if we had another hour, what would you add?* Good answers that map
  cleanly onto what they just built: a "Catalog" page reusing the same
  sidebar/topbar, a search-results empty state, a confirmation modal for
  "Remove book" (note: a real modal needs either `<dialog>` or JS — flag it
  as outside this project's "no JS except two things" rule, a nice segue to
  a future lesson).

---

## Reference: full phase timing

| # | Phase | Minutes |
|---|-------|---------|
| 1 | Kickoff & orientation | 10 |
| 2 | Defining the theme (`@theme`) | 15 |
| 3 | Design concepts / mobile-first | 10 |
| 4 | Shared utilities & components (`@layer components`) | 20 |
| 5 | Build: Sidebar | 20 |
| 6 | Build: Topbar | 15 |
| 7 | Build: Stat cards | 15 |
| 8 | Build: Book table | 20 |
| 9 | Sign-in page | 10 |
| 10 | Assemble `index.html` | 15 |
| 11 | JS: theme + aside toggles | 15 |
| 12 | QA + wrap-up | 10 |
| | **Total** | **175** |
