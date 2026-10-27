# Apple Period Review

Case 1 of 4 in the portfolio. A retrospective on the distributed at-home support team Jacob led as a temporary Retail Team Lead (formal title Lead Genius), August 2020 to March 2021.

Designed as an operating review: a printed period report with serif headings, a margin column, numbered figures and captions. It uses the shared site frame (`../assets/frame.css`, `../assets/frame.js`) and the shared evidence key (Measured, Recorded, Recalled, Illustrative). Theme follows the visitor's OS.

Files
- `index.html` — the page.
- `figures.js` — the five figures, drawn as SVG strings at the width of each host. The same code writes the JS-off copies into the page.
- `og-period-review.png` — share card.

The only invented data on the page is the dot placement in Figure 1, which is labelled Illustrative. Every other figure is a real aggregate. No individual advisor results, internal identifiers or internal training material appear. Jacob explicitly selected the full supplied Memoji leadership-board photograph, including its visible first-name labels, for this release. Personal photographs and public store locations were supplied and authorized by Jacob on October 26, 2026.

After editing the frame's case list or any figure code, from the portfolio root run the two sync scripts kept in the private build folder (`frame-sync.js` and `apple-figs-sync.js`, each with `--check`). Inspect at 1440, 1180, 900, 820 and 390 pixels in both themes before release. Publication requires Jacob's approval.

## Coordinated period comparison (2026-10-25)

The shared enhancement script adds an All periods / Nov–Feb selector to Figure 2. It reads the unchanged `ReviewFigures.BENCH` data, highlights the same period in all four charts and lists exact team/site values in chart order. All periods remains the default; static figures and data tables are unchanged.

## Personal photo story (2026-10-26)

The cover pairs the review with Jacob’s Domain opening-day photograph; the homepage layers that photograph behind the existing benchmark preview. A three-stage course summary uses phone, troubleshooting and branching-question icons. The store-history section includes a Genius Bar photograph and the personal story of meeting his wife at Apple North Star. A short excerpt from a handwritten thank-you note is credited to Mindy as Store Leader. Jacob selected the full Memoji board, shown beside the Genius Bar photograph with a full-size link preserving its visible “Jacob / Lead Genius” label.

`photo-story.css` contains the responsive presentation. `photos/` contains optimized WebP copies with metadata removed. The active Domain image is `domain-opening-cleanup-v3.webp`: foreground bystanders and luggage were removed with AI, followed by a localized background anatomy repair. The clearer original is preserved as `domain-opening-clear-original.webp` and linked from its caption. The Genius Bar photo uses `genius-bar-enhanced-v1.webp` for exposure, color and clarity; its caption identifies the enhancement. The Memoji board and personal photograph are unretouched. Original library photographs and unused variants remain preserved outside the public release.

Store photographs provide career context. Existing figures, aggregate values, chronology and interactions are unchanged. Jacob approved the final images, presentation and commit/push to main on October 26, 2026. Claude advisory review was attempted but unavailable because the CLI was signed out; Jacob authorized release after that limitation was disclosed. Validation and edit provenance are retained in the private review record.
