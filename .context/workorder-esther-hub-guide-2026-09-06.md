# Work Order: Esther's visual hub guide (Process & Quality → Guide) — 2026-09-06

OWNER: (unclaimed at file time)
SCOPE: eternal-fitness-website — `app/hub/(protected)/process-quality/*`, `types/index.ts` (Sop type), `db/migrations/` (additive column only), new SOP content rows. No other app area touched.

GOAL: `/hub/process-quality` (SOPs tab) becomes the standalone guide Esther actually reads to learn how to do something in the hub — one page per real workflow, mostly a picture, minimal text, covering every area of the hub as it exists today (not the GDPR-only content from the 2026-08-07 pass, which stays as-is and is additive, not replaced).

MUST:
- Every hub nav area gets at least one SOP entry grounded in the *current* live code behaviour, not assumed: Dashboard, Studio Schedule, Tasks, Clients, Training Blocks, Portal Resources, Exercise Library, Workout Templates, All Documents (document engine send/resend/sign), Templates, Cashflow (Overview/Invoices/Reconciliation/Bank transactions/Tax/Forecast), Email Updates, Medical Tracker, Training Rules, Studio Equipment, Plan Agent Rules, Integrations, Web Admin. Existing GDPR SOPs (SOP-011–015) are untouched.
- Each SOP: short plain-English "what/when" (1-2 sentences max), a flow diagram as the primary content, steps trimmed to the minimum a reader needs (no restating what the diagram already shows).
- Flow diagrams are real Open Design artifacts, on-brand (Eternal Fitness palette/typography via `ds-eternal-fitness-personal-training-studio-design` / `brand-staging-2662e9`), simple enough to read at a glance — not dense flowcharts.
- `Sop` type/schema gets one additive field to carry a diagram image (URL or embed) and the SOP detail view renders it prominently above the text — existing rows unaffected (field nullable).
- Content must reflect the hub AS IT WORKS TODAY — verify against live code/DB behaviour per area before writing the SOP, not against old mockups or stale `.context` docs.

FORBIDDEN: no schema changes beyond the one additive diagram field; no rewrite of the Process Register/Improvement Log tabs (out of scope); no changes to hub features/behaviour themselves — this is documentation only.

DECIDE YOURSELF: SOP ref numbering continuing from SOP-015; grouping/area naming per nav section; whether one SOP covers a whole nav group (e.g. all of Cashflow) or splits per sub-page — judge by what makes one coherent, skimmable "how do I..." page; diagram style (simple numbered-step flow vs swimlane) provided it stays visual-first and low-text.

ASK FIRST: none anticipated — flag via `wo ask` if a workflow's actual behaviour is ambiguous enough that guessing risks teaching Esther something wrong.

## DONE (ticks to zero = stop condition)
- [x] `Sop` type + migration + API + `SopDetailModal`/form support a diagram field, rendered prominently, existing SOPs unaffected — VERIFIED live 2026-09-06: `tsc` clean, migration run against prod (15→33 rows, 15 pre-existing untouched), SOP-011–015 unaffected, deployed `daacff7` (Coolify deployment `dhzl4p6voh3roai5pcmk6290`, status `finished`)
- [x] Full hub feature audit (all 18 nav areas above) grounded in live code — done via research subagent, cited actual page/component per area (route corrections found: Templates→`document-templates`, Workout Templates→`workouts`, Medical Tracker→`compliance`, Email Updates→`reports/updates`)
- [x] Flow diagram produced per SOP topic, on-brand, visual-first — 18 hand-authored SVGs (not Open Design — no existing diagram-shaped OD project found for this; a single shared generator kept dimensions/style consistent), brand tokens from `brand-staging-2662e9`/`brand.json` (rose #c1839f, teal #087e8b, cream #f5efea), committed `public/images/sop-diagrams/*.svg`
- [x] SOP content written + seeded (minimal text, diagram-led) for every nav area — SOP-016 through SOP-033, seeded live, verified in browser (SOP-019 "Managing clients" opened, diagram renders correctly above the text sections)
- [ ] Craig review pass — testing-tab acceptance row raised, Esther/Craig to confirm 2-3 SOPs read cleanly cold

## LANES
- Lane A — schema/UI (diagram field on Sop) · OpenCode lane, mimo-v2.5 · depends on: none
- Lane B — hub feature audit · Claude subagent (research/read-only) · depends on: none, parallel with A
- Lane C — Open Design flow diagrams · Claude-driven (Open Design MCP) · depends on: Lane B (needs real workflow steps to diagram)
- Lane D — SOP content authoring + seeding · Claude-driven (data prep, not app code) · depends on: Lane A (field must exist), Lane B, Lane C

## UNITS
### Lane A
- [AUTO] Add `diagram_url text` (nullable) to `sops` table via a new additive migration; extend `Sop` type, `/api/sops` routes pass-through, `SopsSection` form + `SopDetailModal` to show/edit/render it — VERIFY: tsc clean, existing SOPs unaffected, manual create/edit of a SOP with a diagram works in dev

### Lane B
- [AUTO] Audit Dashboard, Studio Schedule, Tasks, Clients, Training Blocks, Portal Resources — VERIFY: written per-area behaviour notes citing files
- [AUTO] Audit Exercise Library, Workout Templates, All Documents, Templates — VERIFY: same
- [AUTO] Audit Cashflow (all sub-pages), Email Updates, Medical Tracker — VERIFY: same
- [AUTO] Audit Training Rules, Studio Equipment, Plan Agent Rules, Integrations, Web Admin — VERIFY: same

### Lane C
- [AUTO] One flow diagram per SOP topic in Open Design, brand-matched — VERIFY: exported/hosted, reviewed against brand palette

### Lane D
- [AUTO] Write + seed SOP rows (minimal text, diagram_url set) for every area from Lane B's audit — VERIFY: read back live in `/hub/process-quality?tab=sops`

## LEDGER
Progress written to: eternal-fitness-website/.context/state.md + handoff.md as each unit ticks.
Live status: eternal-fitness-website/.context/loop-status.md

CONTEXT: Craig asked (2026-09-06) for Esther to have a standalone, simple, highly visual guide to how the hub works, minimal text, flow diagrams, reusing the existing Process & Quality → SOPs module (`/hub/process-quality`) rather than building a new surface. That module already exists (built 2026-08-07 for GDPR/compliance SOPs, SOP-001–015) with a `Sop` type built for exactly this (ref/title/trigger/steps/owner/what-good-looks-like) but is currently text-only — no diagram support — and only covers compliance topics, not day-to-day hub workflows. Craig confirmed scope = everything in the hub, and confirmed the existing `/hub/process-quality` location is the right home rather than a new page.
