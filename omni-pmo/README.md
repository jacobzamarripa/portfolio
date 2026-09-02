# OmniSight — PMO Operating System Case Study

Sanitized interactive portfolio artifact for the fiber-delivery PMO platform
built and operated during the Omni Fiber engagement.

## Truth boundary

- Jacob's formal Omni Fiber role was Construction Project Manager,
  January 2026 – August 2026. Never write the role as "Present."
- OmniSight was a self-initiated tool, not an assigned project and not an
  Omni Fiber product. Do not describe it as a company product or imply
  official adoption.
- Describe the build as AI-assisted development with Jacob as product owner,
  systems designer, domain expert, tester and operator. Do not imply he
  hand-wrote the entire codebase.
- Do not describe the one-million-foot production figure as an official
  mandate. It was an informal aspiration mentioned by the VP of Operations.
- Use 9 municipalities for the normal active portfolio. Larger project counts
  are historical or pipeline records, not simultaneous direct ownership.

## Data boundary

Every market, delivery partner, person, project identifier, date, footage
figure and percentage inside the interactive walkthrough is invented.
Substitutions follow `../.private/omni-pmo/DECODE_KEY_PRIVATE.md` — check it
before adding any new value, and record any new real-to-fictional pair there
first.

Scale and time figures in the case study section are actuals drawn from the
Career Master verified achievement bank and are labeled as actuals on the
page. Keep that line visible: demo chrome shows invented numbers, the
evidence rail shows real ones.

## Design position

The whole page is styled in the application's own design language, not in a
separate editorial frame. Everything below is ported from `Omni-PMO-App/src`,
not approximated:

- Token set from `_styles_base.html` and `_utils_ui_tokens.html`, including
  the Obsidian Zinc dark mode.
- The system font stack the app actually ships. No webfont.
- Type scale: 900 weight throughout, negative tracking on figures
  (`.dash-kpi-val` is 32px / 900 / -1.5px / tabular-nums), 9px uppercase
  labels with +0.7px tracking, 10px uppercase vendor names with +0.4px.
- Split-color treatment on the wordmark and section titles: muted first span,
  accent second span (`.dash-title`).
- Accent program pill at 10% background and 20% border (`.dash-program-name`).
- 42px workspace button with the translateY(-2px) lift and accent-mixed hover
  border (`.dash-ws-btn`).
- Surface rhythm: slate ground, white shell at 24px radius with the
  `0 8px 32px` shell shadow, slate card at 14px, white row at 12px.
- The queue rail takes a share of the surface (`minmax(278px,1fr)` against
  `minmax(0,1.9fr)`, about 34.5%), not a fixed 282px. When the shell was
  widened, a fixed rail sent all the new width to the detail pane and dropped
  the queue from ~39% of the surface to 28.6%, which is what made the card
  read as a sliver. Card padding carries the proportion at 13px/14px; the
  card sits near a 3.9 width-to-height ratio.
- Width: the page wrap is `min(1440px, 100% - 40px)`, the section rail is
  172px and the app's own sidebar 204px, which leaves the product mock about
  1040px at a 1512px viewport. It was 754px, roughly half the width a delivery
  dashboard is actually read at, and every panel inside it read as starved.
  Reading measures are capped independently (`.hero-lede` 62ch, `.prose` 70ch),
  so widening the wrap does not lengthen a line of prose.
- Active states use `color-mix` accent at 24–28% for borders with an inset
  ring at 10–16%, as `.dash-stage-pill.is-dominant` and
  `.dash-review-section.is-active` do.
- Stage-colored glow on the walkthrough container, from the shell's
  `glow-ofs` treatment.

The interactive walkthrough gives each workspace its own tab and section:
Dashboard, Active Portfolio, Timeline, Risk Grid, Backend.

### Timeline parity details

These are exact ports, not approximations. Do not simplify them:

- Bars rest at `opacity: .75` and reach 1 only on the active row. Muting the
  unselected state is what makes selection legible.
- The active row gets `box-shadow: 0 0 0 3px var(--card-bg), 0 0 0 5px
  var(--text-main), 0 10px 20px rgba(0,0,0,.3)` and `transform: scaleY(1.15)`,
  and its label inverts to `--text-main` with `--card-bg` text.
- `.gantt-rows.has-focus .gantt-row:not(.is-active)` takes `opacity: .35` AND
  `filter: grayscale(40%)`. The desaturation is load-bearing; dimming alone
  leaves saturated amber competing for attention.
- Beads are 18px discs, `border: 2px solid`, `box-shadow: 0 1px 3px
  rgba(0,0,0,.3)`, carrying a letter at 8px/900. Same spec in the detail
  schedule track.
- Month boundaries are `1px dashed #3b82f6` at `opacity: .7` with a labelled
  pill (`#1d4ed8` on `#eff6ff`, `#93c5fd` border). Not grey, not solid.
- Today is `2px rgba(239,68,68,.8)` with `border-left: 1px dashed #ef4444`,
  a clickable label pill that scrolls to today, and an offscreen pin
  (`min-width: 78px`, `height: 28px`, `rgba(239,68,68,.94)`) that appears on
  whichever edge today left by. The pin is implemented, not illustrated.
- Spike windows are 34px bands with dashed amber edges, never a line.
- Bar text is white 10px bold with `text-shadow: 0 1px 3px rgba(0,0,0,.6)`,
  which is what keeps it legible on the amber construction bar.
- Left edge stripes are `4px` with crit / warn / info / ok variants.

### Detail card parity details

Ported from `_styles_badges.html` and `_module_schedule_face.html`:

- Milestone chain: `.qb-time-milestone.is-met` drops to `opacity: .55` and
  takes a `#22c55e` check; `.is-active` is `color: var(--text-main)` and marks
  the EARLIEST UNMET link only. An undated milestone can never be met, so the
  highlight correctly stalls rather than skipping ahead. `.milestone-note`
  carries the SAME DAY chip when CX Complete and OFS land together.
- `.qb-time-bar` is 12px on `var(--bg)` with a 1px border, `border-radius: 6px`
  and `overflow: visible` so beads and ticks break its bounds.
- `.schedule-fiber-tick` marks Fiber Placement (CX Complete minus the lead
  days). `.is-primary` turns it `#0ea5e9` with a `0 0 6px` glow on the card
  that owns the date; `.is-muted` drops it to `.35`.
- `.qb-splice-tail` is a 45-degree hatch from the tick to the end, indigo
  `rgba(99,102,241,.38)` when `.is-active`, otherwise a muted-grey hatch.
- `.proj-bead` is 18px / 2px ring / letter. `.proj-bead--handoff` is 21px at
  `top:-5px` with `box-shadow: 0 0 9px rgba(99,102,241,.55)` on the splicing
  card, because there the handoff is the start gate and must outrank the
  other beads.
- VENDOR SCOPING IS THE LOAD-BEARING DECISION: on the civil card the progress
  fill caps at fiber placement. Past that point the work is not theirs and a
  fill running to 100% would misreport their standing. The Civil/Splicing
  toggle in the demo exercises this.
- `.qb-target-wrap` plinth: `border-radius: 12px 12px 0 0`, inner has
  `box-shadow: 0 -3px 8px rgba(0,0,0,.04)` (upward, so it reads as a
  foundation). `.xing` wraps it in
  `repeating-linear-gradient(45deg,#171717,#171717 8px,#facc15 8px,#facc15 16px)`
  hazard tape for special crossings.
- Velocity: `.qb-vel-bar` is a 10px inset well
  (`box-shadow: inset 0 1px 2px rgba(0,0,0,.1)`), fill radius 4 inside a
  radius-5 track, and `.qb-vel-bead` is 14px with a 3px ring marking where the
  material SHOULD stand today. Measures and percentages are real monospace,
  not tabular-nums.

### The queue is a port, not an approximation

Earlier passes rebuilt this section from screenshots and it never stopped
looking like a lookalike. It is now taken from the application source. Read
these before changing anything here:

| Piece | Source |
|---|---|
| Vendor colour cycle | `_module_webapp_core.html` `getVendorTheme` :15 |
| Group header markup | `_module_webapp_core.html` `renderVendorGroupHeader` :95 |
| Recursive section | `_module_queue_state.html` `renderSection` :643 |
| Card markup + severity | `_module_queue_state.html` `getListCardHtml` :488 |
| Group CSS | `_styles_badges.html` :198-400 |
| Card CSS | `_styles_badges.html` :170, :405-408, :464 |

**Take the card from the BASE layer, not from GlassFlow.** `_styles_badges.html`
is what the queue renders with. `_styles_glassflow_core.html` :1320-1400 holds a
`.v2-shell-glassflow` override that inflates everything, and porting it once
already produced a queue that was visibly oversized with pill-shaped tags:

| | base (ships) | glassflow override |
|---|---|---|
| `.email-card` padding | `14px 16px 12px` | `18px 18px 16px` |
| `.em-fdh` | **12px** | 18px |
| `.em-vendor` | **9px** | 11px |
| `.glass-pill` | `3px 12px` / 9px | `6px 10px` / 10px |
| `.tag` | `3px 8px` / **radius 4px** / 8px | `4px 8px` / radius 999px / 9px |
| `.em-tags` gap | `4px` | 6px |

The flag chips are **rectangles at 4px radius**, not pills. GlassFlow is still
the right source for the shell glow ladder on the walkthrough container — that
is a different component and is unaffected.

**The rail is width-capped, not fluid.** `_styles_base.html:21` sets
`--inbox-panel-width: clamp(380px, calc(9.375vw + 200px), 440px)`, so the app's
queue never exceeds 440px. Letting it grow with the shell took it past 700px on
a wide display — roughly 1.6x the app's maximum — and correctly-sized elements
in a container that wide read as oversized. `--queue-rail-w` carries the same
clamp with a 300px floor, because this shell is narrower than the app's window.
If the queue ever looks bulky again, measure the rail before touching any
element inside it.

**Stage and status labels are only abbreviated where the tables say so.**
`_STAGE_ABBREV` and `_STATUS_ABBREV` (`_utils_shared.html:548-572`) have no
entry for Field CX, In Progress, Complete or On Hold, so those render in full:
`Field CX | In Progress`, not `CX | In Prog.` Permitting/ROE -> `Permit ROE`,
Pending Approval -> `Pend. Approval`, High Level Draft -> `HL Draft` and
Pending Initial Design -> `Pend. Design` are real entries and do abbreviate.

**The group header emits no caret.** `renderSection` renders the title, the
count and nothing else; the header itself is the control. `.queue-group-toggle`
CSS exists in the app but this code path does not use it.

Facts worth knowing before you touch it:

- **One component, used twice.** The app does not have a separate city
  component. `renderSection` recurses; the nested level takes `.is-sub-group`
  and `--compact` modifiers. Do not add a second header component.
- **Three vendor themes cycle by index** — blue `#2563eb`, slate `#64748b`,
  light gray `#cbd5e1` — each carrying six custom properties. In the app these
  are emitted inline by `getVendorThemeStyle`; here they are `.vt-0/1/2`
  classes holding the same values. That cycle is the "alternating colours"
  the queue reads by.
- **The vendor tint is not the band background.** GlassFlow overrides it to
  `color-mix(--bg 76%, --card-bg)`, and the vendor colour survives as the
  `inset 4px 0 0` left rule, the monogram, the count pill and the meta
  separators. The sub-group band is `color-mix(--card-bg 80%, --bg)`.
- **Severity comes from the flags**, not a per-project field: `tag-red` is
  crit, the warn/anomaly/admin family is warn, ghost chips are ghost, and the
  default is info with a transparent rule.
- **Three flags then `+N`** — two if the card is tracker-linked.
- Collapse is `grid-template-rows: 1fr -> 0fr` on `.queue-group-body` with
  `.queue-group-body-inner{overflow:hidden}`, plus `.collapsed-state` on the
  group. Not a `hidden` attribute.

Two deliberate deviations, both because the source has no answer:

1. The monogram is `color: #ffffff` on `color-mix(--vendor-accent 90%, white)`.
   On the light-gray theme that is **1.42:1 in every theme** — a defect in the
   source, not something the port introduced. Each theme now carries
   `--vendor-mono-bg` / `--vendor-mono-txt`.
2. The app ships **no dark mode for the vendor themes**; its inks are
   light-mode values and the count pill lands at ~2.1:1 on a dark ground.
   `--vendor-accent-strong` and `--vendor-accent-text` are lightened for dark
   only, so light mode stays byte-identical to the source. `vt-2`'s "strong"
   ink is `#94a3b8`, still too light for its own count pill at 2.54:1, so in
   light it is promoted to that theme's `--vendor-accent-text`.

Contrast floor: 4.51 light, 5.81 dark. Skip gradient-backed chips when
measuring — `.t-splice` has no `backgroundColor` to read.

### The queue drives the detail pane

The queue used to move a selection highlight and change the shell glow while
every field in the detail pane stayed on FHV02-F10. A viewer who clicked a
second project learned the surface was a mockup, which is worse than a queue
that is plainly static.

Each of the five cards now carries `data-project` and selects a full record
from the `PROJECTS` registry in the page script: stage pill, owner, milestone
chain, schedule geometry, the owned-date plinth, four velocity bars with their
pace beads, the network path, risk drivers, and the notes log. There are five
because five have complete records; a sixth card without one would restore the
same lie at a smaller scale. The rail says `5 of 42 shown · demo slice` rather
than implying the other 37 are one scroll away.

Two rules for adding a project:

- Time and production percentages MUST match the timeline row and risk-grid
  card for the same project. A portfolio that disagrees with itself across
  surfaces is the exact failure this platform existed to fix, and a reader who
  spots it stops believing the rest.
- Scope data (`scopes.civil` / `scopes.splicing`) lives per project. It used to
  be one hard-coded `SCOPES` object for FHV02-F10, which would restamp that
  project's vendor and dates over whichever project was selected.

The registry is a JS object rather than the `data-*` attributes the timeline
rows use, because a project carries about forty fields and forty attributes on
a `<button>` is not readable markup. The timeline's nine-field rows stay as
they are.

Selecting a project resets the Civil/Splicing toggle to Civil, so the vendor
scoping argument always opens from the civil side.

Two states worth clicking, because they are the documented behaviours that are
otherwise only assertions:

- `THF01-F26` has every milestone met, so NO link in the chain is live — the
  highlight has nowhere left to advance to.
- `MPR07-F22` has an undated OFS, so the highlight correctly stalls at CX
  Complete instead of skipping ahead to a milestone that can never be met.

Hazard tape is conditional on the project (`xing`), which is what makes it
mean something rather than decorate every card.

### Shell glow ladder

Five states from `_styles_glassflow_core.html`, wired to the selected project:
`glow-active` (subtle blue), `glow-ofs` (`#93c5fd`), `glow-complete`
(`#86efac`), `glow-permit` (`#d8b4fe`), and `glow-overdue` (`#f87171`, the
strongest at 52px bloom). Selecting a queue card or a timeline row changes it.

### Design vocabulary section

Seventeen devices in four families: encoding state (4), directing attention
(5), honest measurement (4), and conventions borrowed from the field (4). Each
is a live specimen next to the cognitive-load argument for it. The case study
does not restate them; it states the principle underneath and links here.

**The section uses the walkthrough's own shell.** It previously ran horizontal
pill tabs on bare page while the walkthrough ran an icon sidebar inside a
shell — two navigation idioms in two different screen positions for the same
"browse a set" job, which made the hand-off between them hard to follow. The
families are now sidebar workspaces (`.sidebar` / `.nav` / `.surface` /
`.view-head`, the same classes), each with a kicker, a heading and a device
count, so the two sections read as two workspaces of one product.

The vocabulary shell takes `.app--plain`: the app grid and chrome without the
glow ladder or the 730px floor, because only one thing on the page should
carry the "this is the live product" signal. A second `.app` now exists, so
the glow machinery is pinned to `#walkthrough .app` rather than the first
match in the document.

If you add a family, update its device count in the `.head-meta` chip — it is
the one number in this section not derived at runtime.

### Anatomy mode

The vocabulary used to argue for these devices in a gallery of look-alikes,
several screens away from the components it described. It now works as a round
trip in both directions:

- The walkthrough head carries an **Anatomy** toggle. With it on, every
  deliberate device in the live interface is marked, and hovering, tabbing to,
  or clicking one raises its name, its claim and the opening of its argument,
  with `Full argument ↓` linking down to the card.
- Every vocabulary card carries `Show me ↑`, which switches to the workspace
  that device lives in, turns anatomy on, and pulses the real component.

Wiring: a live component is tagged `data-anat="<key>"`; its card is tagged
`data-vocab="<key>"` plus `data-anat-view="<workspace>"`. Sixteen of the
seventeen have a live anchor. `glow` is a property of the container rather
than of any child, so its `Show me` runs the glow ladder on the shell instead.

The toggle lives in the app's own sidebar under `MODE`, not in the section
head — it was easy to miss out there, competing with the section note and
sitting outside the thing it modifies. Off it reads as an accent-outlined
invitation ("Show anatomy"); on it is filled accent ("Anatomy on"). The two
states used to look nearly identical, which was half the discoverability
problem. A one-time pulse fires the first time the shell scrolls into view,
suppressed under `prefers-reduced-motion` and cancelled once the mode is
used.

**The registry is built at runtime by reading the vocabulary cards.** The
popover's name comes from `.vocab-name`, its claim from `.vocab-load`, its
text from `.vocab-why`. There is no second copy of the argument to update, so
the specimen and the live component cannot drift apart — edit the card and the
popover follows.

To add a device: tag the component, add a card with the matching `data-vocab`,
and set `data-anat-view`. No JavaScript changes are needed.

### One hazard, learned the hard way

Four classes were declared **twice** in this stylesheet, the later rule
silently overwriting a ported spec:

- `.vocab-card` — `flex-direction:row` overwritten by `column`, which turned
  `flex-basis:300px` into a 300px-tall empty box and produced the section's
  entire "generated" look.
- `.qb-time-bar` — the 12px `overflow:visible` schedule bar overwritten by the
  8px `overflow:hidden` risk-grid meter, clipping the beads and the fiber tick
  this file explicitly documents as breaking the bar's bounds.
- `.qb-time-labels` — the wrapping milestone chain overwritten by the meter's
  `space-between`.
- `.vocab-name` / `.vocab-why` — dead size overrides.

The risk-grid meter rules are now scoped to `.grid-metric` so the two bars
stop fighting. Before adding a rule, check whether the class is already
declared: `grep -oE '^\.[a-zA-Z0-9_-]+\{' index.html | sort | uniq -d`
should return only `.app{`.

Keep these in sync. If a device changes in the walkthrough, its specimen and
its argument change too.

## Reuse rule

Component patterns in the walkthrough are ported from the original
application, not re-authored from screenshots: the stage-and-status pill with
its full form on hover, flag chips whose color is classified from the flag
text, the left-edge health stripe, the stage fill treatments, the schedule
beads, and the risk map diagonal. If a surface needs a component, take it
from the original rather than inventing a lookalike.

## Status

Published via GitHub Pages from the `portfolio` repository. Structure follows
the sibling `../centric-fiberops` case study. Edit `index.html` and push to
update the live page.

It is no longer a Claude Artifact. Artifacts are private by default, which
made the URL unusable as a public LinkedIn Featured link — a visitor would
hit a permission wall. Two stale OmniSight artifacts still exist in the
account and should not be linked from anywhere.

### The document wrapper is load-bearing

This file used to be an artifact fragment with no `<!doctype>`, `<head>` or
`<body>` — the artifact runtime supplied them. On GitHub Pages nothing does,
so it now carries its own head. **Do not remove the viewport meta.** Without
it the layout viewport falls back to 980px on a phone, the page renders at
roughly 38% scale, and none of the `@media` rules below ever fire. That was
invisible while this was an artifact, because the runtime injected the tag.

Verified 2026-09-01 at 375px: `clientWidth` 375, no page-level horizontal
overflow, both app shells unclipped.
