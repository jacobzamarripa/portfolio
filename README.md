# Portfolio

Case studies by Jacob Zamarripa, served by GitHub Pages at
<https://jacobzamarripa.github.io/portfolio/>.

## Layout

- `index.html` — homepage: bio and a career timeline linking the four cases.
- `apple-rtl/` — Case 1, Apple: Period Review (printed operating review; charts in `figures.js`).
- `centric-fiberops/` — Case 2, Nexus FiberOps Unified (field tools; iPad and phone prototype).
- `ci-fleet/` — Case 3, Right-Sizing the Fleet (blueprint to finished truck).
- `omni-pmo/` — Case 4, OmniSight (PMO platform walkthrough and engineering notes).
- `assets/` — shared frame (`frame.css`, `frame.js`: header, footer, evidence key) and favicon.

Each case page has its own visual identity and shares the frame and the evidence key
(Measured, Recorded, Recalled, Illustrative). Theme follows the visitor's OS setting.

## Ground rules

1. Keep private people, vendors and internal system names out of public files. Employer names and public locations follow the approved truth locks in the private redesign plan.
2. Every invented value that substitutes for a real one is recorded privately.
3. Every claim on a page carries its evidence mark; use the strongest sourced figure, never an unsourced one.
4. All LinkedIn links point to `/in/jacobizamarripa` (with the i).

## Before publishing a change

- Check at 1440, 900 and 390 px in light and dark; `scrollWidth` must equal `clientWidth`.
- No console errors.
- Duplicate class check: `grep -oE '^\.[a-zA-Z0-9_-]+\{' <file> | sort | uniq -d`.

These case studies are personal work and are not affiliated with or endorsed by any former employer.

## Visual enhancement (2026-10-25)

Five role filters in `assets/explore-data.js` number four evidence stops within the homepage career timeline and preserve shareable `?focus=<role>` links. Paths open on adopted work, rank it above work I operated, and exclude concepts. On case pages, a docked journey guide shows the current evidence, career placement, visited stops, a timeline strip and an expandable map. Closing cleans the URL and offers a resume link. A curtain covers arrival positioning independently of optional cross-document view transitions between case pages; reduced motion uses a static highlight without transitions. Fleet storage inspection, guided demos and Apple period comparison remain available outside paths. Role labels describe navigation relevance, not employment titles.

Run `node --test assets/explore-data.test.cjs assets/portfolio-explore.test.cjs` for evidence mappings and navigation units. Run `node --test assets/portfolio-explore.browser.test.cjs` for the journey regression suite with Playwright installed; `PORTFOLIO_PLAYWRIGHT_MODULE` and `PORTFOLIO_BROWSERS_PATH` can point to existing installations. The suite starts an isolated local server and tests Chromium, WebKit and Firefox at 1280 and 390 px. Execution notes and earlier visual regression procedures are in `.private/redesign-2026-10/visual-enhancement/REVIEW.md`. Check JS-off shared-frame markup with `node .private/redesign-2026-10/frame-sync.js --check apple-rtl/index.html centric-fiberops/index.html ci-fleet/index.html omni-pmo/index.html`.

Journey hardening findings and browser limitations: [JOURNEY_REVIEW.md](JOURNEY_REVIEW.md).
