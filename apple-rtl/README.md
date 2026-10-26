# Apple Period Review

Case 1 of 4 in the portfolio. A retrospective on the distributed at-home support team Jacob led as a temporary Retail Team Lead (formal title Lead Genius), August 2020 to March 2021.

Designed as an operating review: a printed period report with serif headings, a margin column, numbered figures and captions. It uses the shared site frame (`../assets/frame.css`, `../assets/frame.js`) and the shared evidence key (Measured, Recorded, Recalled, Illustrative). Theme follows the visitor's OS.

Files
- `index.html` — the page.
- `figures.js` — the five figures, drawn as SVG strings at the width of each host. The same code writes the JS-off copies into the page.
- `og-period-review.png` — share card.

The only invented data on the page is the dot placement in Figure 1, which is labelled Illustrative. Every other figure is a real aggregate. No individual results, names, internal identifiers, store names or internal training material appear.

After editing the frame's case list or any figure code, from the portfolio root run the two sync scripts kept in the private build folder (`frame-sync.js` and `apple-figs-sync.js`, each with `--check`). Inspect at 1440, 1180, 900, 820 and 390 pixels in both themes before release. Publication requires Jacob's approval.

## Coordinated period comparison (2026-10-25)

The shared enhancement script adds an All periods / Nov–Feb selector to Figure 2. It reads the unchanged `ReviewFigures.BENCH` data, highlights the same period in all four charts and lists exact team/site values in chart order. All periods remains the default; static figures and data tables are unchanged.
