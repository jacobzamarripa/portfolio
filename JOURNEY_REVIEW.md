# Journey review — 2026-10-26

Reviewed `bd1e3dd..90b408a` (the six commits starting with `480dee7`) on a branch from `main` at `90b408a`. Review branch: `codex/journey-review`. Merge requires Jacob's approval.

## Fixes

- Validate stored visited-stop data before using it. Valid JSON objects, strings and numbers previously crashed the guide; malformed JSON, blocked storage and quota failures now remain safe.
- Give the route an explicit listener, observer, animation-frame and timer lifecycle. Closing cancels pending arrivals and highlights, removes listeners and padding, restores the original target tabindex, and returns focus. Page hiding cancels animation work; persisted pageshow resets the cover without repositioning history.
- Finish positioning before revealing the page. Remove the 1,400 ms post-reveal correction, honor input during arrival, and position direct homepage explorer links instantly. The heading overlay remains tied to text rectangles and has explicit cancellation and timeout cleanup.
- Measure the entire dock, including an open map, with resize observation. Keep focused controls above it, focus the map when opened, return focus on Escape, and expose the title's actual hidden/expanded state. Main controls and role filters have 44 px targets. A focused resume link no longer disappears on a seven-second timer.
- Preserve native modifier/middle clicks, alternate targets, downloads and external links. Handle the optional transition's lifecycle promises in outgoing handlers and synchronous incoming head scripts; page content and case-page designs are unchanged.
- Add a source-curtain timeout and CSS recovery, print exclusions and reduced-motion cover overrides. Remove obsolete/overridden CSS while preserving Fleet's inspection stroke. Update the README and add portable unit and browser regression tests.

## Validation

- 13 Node unit/data tests; 7 existing Fleet generator tests.
- All 5 roles × 4 stops × 2 widths (1280 and 390) × 3 engines: 120 journey states. Checks include target placement, text-highlight rectangles, viewport fit, current-stop semantics and no later programmed scrolling.
- Chromium, WebKit and Firefox lifecycle checks: direct/invalid URLs, close/resume, compaction, Map/title disclosure, Escape, body-control focus, native modifier/middle clicks, malformed/blocked storage, back/forward, reduced motion, highlight expiry, JS disabled, missing enhancement script, and native transitions explicitly disabled.
- Existing baseline matrix: 100 Chromium/WebKit page/viewport/theme states at 1440, 1180, 900, 820 and 390 px. No overflow, duplicate IDs or JavaScript exceptions.
- All four `frame-sync.js --check` cases pass; head changes do not affect the static frame. The local ignored Fleet generator now preserves the arrival bootstrap as well.
- Evidence data and its original tests are unchanged; `git diff --check` passes. Representative desktop/mobile arrival screenshots were visually inspected. Guide text colors range from 6.20:1 to 15.33:1 against #17191d.

Run the public tests with the commands and Playwright environment overrides in `README.md`. Browser screenshots and final TAP logs are local, ephemeral artifacts in `/tmp/portfolio-journey-review/`; baseline evidence is in `/tmp/portfolio-enhancement-qa/`.

## Browser limitation and unchanged choices

Chromium 151 intermittently reports a stackless native `AbortError: Transition was skipped` around homepage path transitions. It reproduced in both headed and headless full-path tests, so it is not solely a headless artifact. The exact earlier “ViewTransition opt-in disabled” message did not reproduce in the isolated headed/headless diagnostic route. Opting the homepage out increased native cancellations, so native opt-in remains. The independent curtain works with native transitions disabled; no guide correctness depends on their success. The browser tests print these exact native cancellations separately and still fail for application exceptions, other application console errors, incorrect arrivals or stuck covers. No global error/rejection suppression was added.

Chrome's [cross-document transition documentation](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) explains the outgoing readiness rejection and that native transitions can be skipped. This review does not claim to fix Chromium's internal cancellation diagnostic or prove the cause of the original opt-in warning.

Actual back/forward navigation passed, and the persisted-pageshow branch was exercised explicitly. These automation contexts did not produce actual bfcache hits, so native cached restoration remains a manual browser check. WebKit was tested as Safari's engine; an exact Safari 18.2 binary was not available.

The timeline's 26 px numbered dots remain compact; the main controls are 44 px, and the expanded map supplies an alternate navigation surface. The print rule for `.px-lens` is valid: that class is present on the homepage, so it was retained. No references to the removed routebar, path-dock, stopcard, dots, where or tag classes remain in production assets.

Claims, figures, dates, sourcing marks and `use`/`at` values were preserved. No merge or live publication is part of this review.
