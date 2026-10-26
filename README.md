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

Five role lenses are defined in `assets/explore-data.js` and appear on the homepage as a role filter on the timeline, which numbers each role's four evidence stops; `assets/portfolio-explore.js` and `.css` add focused cross-case paths, guided demo tours, Fleet storage inspection and coordinated Apple period comparison. Execution notes, asset provenance and regression procedures are in `.private/redesign-2026-10/visual-enhancement/REVIEW.md`. Run `node --test assets/explore-data.test.cjs` after changing evidence mappings. Role labels describe navigation relevance, not employment titles.
