# Nexus FiberOps Unified — Retrospective Case Study

Sanitized interactive portfolio artifact based on the design language and
workflow model of the `Centric_FiberOps_Unified` repository.

Full lineage — what was real, what was retrospective, what was only planned —
lives in `~/App-Projects/Centric_FiberOps_Unified/ORIGIN_AND_LINEAGE.md`.
Read that before changing any claim on this page.

## Truth boundary — three tiers, never collapsed

The page states these separately and so must any edit to it.

| Tier | What | Status |
|---|---|---|
| **Real** | The L-FIT tracker (Lead Fiber Installation Tech Tracker) and the QR/barcode pipeline | Built and used during the Centric employment. The barcode workflow **remained in use after his departure**. |
| **Retrospective** | Nexus FiberOps Unified — the unified role-aware application in the walkthrough | Built after leaving Centric, as a portfolio prototype. Never deployed there. No production adoption. |
| **Planned** | In-app SOP library; iPad rollout | Intent only, never built. Shown as roadmap, never as delivery. |

Additional locks:

- Jacob's formal Centric roles were In-Home Installation Technician
  (October 2022–December 2024) and Fiber Installation Lead
  (January 2025–January 2026). He did not hold a Project Manager title there.
- **Do not attach a technician count to the barcode workflow.** The canonical
  `docs/LINKEDIN_LAUNCH_GUIDE.md` truth lock requires the wording "remained in
  use after my departure" with no count. An earlier version of this page
  claimed "2 technicians"; that over-claimed against the lock and was removed
  on 2026-09-01.
- Verified field evidence here is eight employees trained, plus the barcode
  workflow's survival after departure.
- **Third-party systems stay generic in public.** The real stack (the
  assignment board, the CRM of record, the provisioning platform) is named
  only in the private lineage note. Decision recorded 2026-09-01.
- No CRM integration was ever planned *inside* Nexus. `PRD.md` in the source
  repo lists a HubSpot "Integration Target"; Jacob has corrected that. The
  API work belongs to the earlier QR pipeline, where it was real.
- Every person, community, address, schedule, job, equipment identifier and
  operating metric in the interactive demo is invented from scratch and has
  no one-to-one mapping to employer data. New identifiers are recorded in
  `../.private/centric-fiberops/DECODE_KEY_PRIVATE.md`.

## The QR codes are real

The five codes rendered in the QR Pipeline workspace are genuine, scannable
QR codes (41×41 modules, error correction level M). They were generated at
build time with a reference encoder and embedded as packed bitmaps in
`QR_DATA`, then verified pixel-for-pixel against that encoder's output by
reading the rendered canvas back.

This matters for two reasons:

1. A viewer can scan one with a phone. Anything decorative would be caught
   instantly, on a page whose entire argument is that claims are checked.
2. They encode **only** the fictional payload for their job — nothing real.
   Do not re-point them at actual records.

To change a payload you must regenerate the matrix; you cannot hand-edit the
bitmap. Keep `QR_DATA` and the `JOBS` registry in sync — a code that decodes
to different values than the record beside it is the exact self-contradiction
this project exists to avoid.

## What the walkthrough demonstrates

Six workspaces: Dashboard, My Jobs, Calendar, Map View, **QR Pipeline**, and
Provisioning. The pipeline is the centerpiece because it is the piece that was
real. Its five steps mirror the actual workflow: pull from the assignment
board → cleanse and validate → generate the code → scan into provisioning →
write back and log output.

Two states worth exercising:

- **`J-2291`** is the clean path, start to finish.
- **`J-2286`** arrives from the board with a truncated serial. Validation
  rejects it, the code cannot be issued, provisioning shows blocked, and a
  "Fix at source & retry" action appears. The rejection path is implemented,
  not illustrated — it is the argument for why validation sat before code
  generation rather than after.

Selecting a job anywhere — job list, map stop, calendar filter — selects it
everywhere. The dashboard HUD, morning brief counts and technician-output
table are all derived from state, not hard-coded.

## One hazard worth knowing

An author `display` rule beats the user-agent `[hidden]{display:none}`, so
`.qr-empty{display:grid}` kept rendering while its `hidden` attribute was
set — the placeholder and the QR both showed. The stylesheet now carries an
explicit `[hidden]{display:none!important}`. Any new component that sets
`display` and relies on `hidden` needs that rule to already be present.

## Status

Rebuilt 2026-09-01. Previously the page was four static panels behind tabs
with nine lines of JavaScript, several inert buttons, a nav entry that pointed
at the wrong view, and a CSS-gradient placeholder where the map should be.
It now has a working record registry, a real interactive pipeline, an SVG
route canvas, and no dead controls.

Verified locally at 1440 / 900 / 375 px: no console errors, no page-level
horizontal overflow, app shell unclipped on mobile, QR canvas matches the
reference encoder exactly.

Hosting: published via GitHub Pages from the `portfolio` repository. Edit
`index.html` and push to update. It is no longer a Claude Artifact — artifacts
are private by default, which made them unusable as a public Featured link.
