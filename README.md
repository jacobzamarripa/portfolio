# Portfolio Case Studies

> **This repository is the canonical home for these case studies.** It is
> public and served by GitHub Pages at
> <https://jacobzamarripa.github.io/portfolio/>. Edit here and push; do not
> re-edit the archived copy under `CareerOS/portfolio`.

Sanitized, shareable case studies + interactive demos built from Jacob's real
internal projects (Omni PMO, Centric FiberOps Unified, etc.), for use in his
job search — LinkedIn Featured, direct links to hiring managers, and here in
CareerOS for anyone/anything working on his job search materials.

## Layout

- `omni-pmo/index.html` — HTML source for the "OmniSight" interactive
  walkthrough + case study. A complete standalone document: doctype, head with
  charset/viewport/description, and body. It uses the system font stack the
  application ships — there is no webfont and no font link.
- `centric-fiberops/index.html` — self-contained HTML source for the Nexus
  FiberOps Unified retrospective prototype. Its demo dataset is wholly
  invented rather than mapped from employer records. Carries genuinely
  scannable QR codes, pre-generated at build time and embedded as packed
  bitmaps — see its README before touching them.
- `.private/` — **gitignored, never pushed to GitHub.** Holds the private
  decode keys mapping real Omni Fiber / Centric data (cities, vendors,
  people) to the fictional values used in each public case study. Needed to
  keep new sanitized content consistent with what's already published, and
  to "unscramble" a value if ever necessary. Treat as confidential — do not
  copy out of this folder, attach to any public artifact, or commit despite
  the gitignore rule.

## Ground rules for any agent working in this folder

1. Never put a real city, vendor, or person name from Omni Fiber or Centric
   into a file outside `.private/`. Check the relevant decode key first.
2. Every fictional value that substitutes for a real value must be recorded
   in its decode key in `.private/`. A demo dataset invented independently
   from source records may instead use a private provenance note stating that
   no one-to-one mapping exists.
3. Aggregate, non-identifying scale metrics (record counts, time saved, etc.)
   are fine to state directly — they don't need a decode-key entry.

## Hosting

Both case studies are served publicly by GitHub Pages from the `portfolio`
repository — no login, no permission wall, stable URLs suitable for a LinkedIn
Featured link. Edit the HTML and push to update.

Neither is a Claude Artifact any more. Artifacts are private by default, so an
artifact URL in Featured is a dead link for every visitor.

**Never link from a public profile:** a private Claude Artifact, a localhost
address, a local file path, or anything requiring a former-employer account.

## Before you publish a change

1. Privacy scan against the decode keys in `.private/`.
2. `grep -oE '^\.[a-zA-Z0-9_-]+\{' <file> | sort | uniq -d` — duplicate class
   declarations silently overwrite ported specs. Omni should return only
   `.app{`; Nexus should return nothing.
3. Check at 1440 / 900 / 375 px: no console errors, and
   `document.documentElement.scrollWidth` must equal `clientWidth`.
4. Confirm every outbound LinkedIn link points at `/in/jacobizamarripa`.
   The handle without the `i` is a different person with the same name in the
   same city — that mistake shipped once already.

## The case-study shell (template)

Both case studies now share one chrome so they read as a system rather than
two unrelated pages. Start case study #3 by copying it.

**Structure**

```html
<div class="topbar"><div class="wrap topbar-inner">
  <div class="topbar-left">  mark · name · context pill        </div>
  <div class="topbar-right"> demo chip · #themeBtn · LinkedIn  </div>
</div></div>

<div class="wrap shellgrid">
  <aside class="railnav" id="railnav">
    <div class="rail-label">Case study</div>
    <a href="#intro"><span class="n">01</span>Overview</a>
    ...
    <div class="rail-meta"> Role · Period · Built on </div>
  </aside>
  <main class="content">
    <section id="intro">…</section>
    <section id="walkthrough">…</section>
    <section id="case">…</section>
    <footer id="contact">…</footer>
  </main>
</div>
```

**Required tokens:** `--topbar-h` (54px), a surface token, a rule/border token,
and an ink token. Nexus additionally splits `--ink` out of its slate ramp —
see below.

**Behaviour:** one IIFE provides `syncRail()` (scrollspy highlighting the
current section) and the theme toggle. Copy it verbatim.

### Theming: three states, no persistence

Tokens live on bare `:root` (light). Dark is declared **twice**:

```css
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){ … } }
:root[data-theme="dark"]{ … }
```

The `:not()` guard lets the toggle force light on a dark-OS machine, and the
second block lets it force dark on a light-OS machine. Omit either and the
toggle only works in one direction.

**The toggle deliberately does not persist.** Every load follows the visitor's
OS preference; the button is a session-only override. Do not add
`localStorage` — a visitor should not be trapped in a mode they picked once.

### Two traps this chrome already hit

1. **`--slate-900` was overloaded in Nexus** — 13 background/fill uses (the
   intentionally dark morning brief, race panel, truth boundary, footer) and
   11 ink uses. Inverting the ramp would have turned those dark cards light.
   Ink was split into its own `--ink` token; `--slate-900` stays dark in both
   themes. Check for this before inverting any ramp.
2. **`.topbar` already existed inside the Nexus hero.** Adding the sticky
   topbar created a duplicate class declaration and the later rule won. The
   hero's bar is now `.hero-bar`. Always run the duplicate-class check below
   after adding chrome.

### Measuring theme changes

`body` carries `transition: background-color .2s, color .2s`. Reading
`getComputedStyle` in the same tick as a `data-theme` change — or one or two
animation frames later — returns a mid-transition colour, not the final one.
Wait ~300ms before asserting on a theme switch, or you will chase bugs that
are not there.
