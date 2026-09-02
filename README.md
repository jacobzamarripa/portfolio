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
