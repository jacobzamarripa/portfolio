# Right-Sizing the Fleet (case 3 of 4)

The proposal Jacob authored for a former teammate's joint entry in Centric Fiber's continual-improvement challenge (Jan 23 – Feb 6, 2026): a service technician's daily loadout turned into a truck specification, selected as the winning submission, and now in service with its main components (cap, drawer system, tool storage), configuration adjusted by role.

Redesigned 2026-10-25 (Stage 5): the page starts as a blueprint sheet and finishes as a truck in service. Four inline SVG drawings share one geometry (line, marked-up zones, tonal rendering, colour scene); each wipes its next stage in on scroll. With JS off, reduced motion, or once scrolled past, every drawing rests at its own finished stage.

Evidence: proposal contents, budget and payload = Recorded; selection, outfitter meetings, in-service outcome = Recalled; all drawings = Illustrative (recreations, not engineering drawings or verified fitment). No teammate name, vehicle IDs, company vehicle photos.

The page is generated: sources in `.private/ci-fleet/stage5-build/` (`build.py`, `truck.py` for the shared real-scale truck and van geometry, `page.css`, `page.js`; `home2.py` redraws the homepage case 3 preview from the same geometry). After building, run `node .private/redesign-2026-10/frame-sync.js ci-fleet/index.html` from the portfolio root, then `--check`.

Vehicle artwork (October 25, 2026): the rendered stages, the two cutaways and the homepage preview use transparent illustrated assets in `artwork/` (`pickup.webp`, `pickup-cutaway.webp`, `van-cutaway.webp`), registered to the drafting geometry in `truck.py`. They are illustrations from reference studies, not engineering drawings or verified fitment, and equipment positions in the cutaways are illustrative. The pickup cutaway shows the corrected layout: hose reel, compressor, generator and cones in the upper bed bay, with drums and small supplies in a lower-third drawer. Generation notes are kept privately with the build sources. Regression tests: `python3 -m unittest discover -s .private/ci-fleet/stage5-build -p test_vehicle_art.py`.

## Refined illustrations and storage inspector (2026-10-25)

Active illustrations are now `pickup-v2.webp`, `pickup-cutaway-v2.webp`, and `van-cutaway-v2.webp`; `road-day.webp` and `road-night.webp` provide matched OS-theme backgrounds. Original assets are preserved. Shared SVG registration, including the lower-body silhouette correction, stays in private `truck.py`; the cab kit and rack tube are deterministic overlays. The shared enhancement script adds a keyboard-operable exterior/storage slider, zone selection and a conceptual tailgate-access sketch. The sketch specifies no dimensions or mechanical travel; no fitment or payload certification is implied. Generator/source tests remain in the private build folder.
