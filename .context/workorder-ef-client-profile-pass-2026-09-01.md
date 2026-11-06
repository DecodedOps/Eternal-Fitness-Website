# Work Order — Eternal Fitness client profile completion pass

**Slug** `wo-ef-client-profile-pass-2026-09-01` · **App** eternal-fitness-website
**Raised** 2026-09-01 from Craig: *"we will systematically go through each client and update their
profiles taking them one at a time, then we will define the blocks etc"*
**Owner** — · **Status** planned

---

## DONE (the completion contract)

All 22 Eternal Fitness clients have a complete, trainer-confirmed profile, and every client who
should have an active programme has one defined against that confirmed profile. No screen anywhere
in the app infers a client value that could have been recorded — specifically, no client's session
pot is derived from a row count.

---

## Why now

The Lane 1 "data truth" CRs (CR-EF-103/105/106/107/108/109/116/117) built the fields. Nobody has
populated them. Today's work kept surfacing the same shape of problem:

- `sessions_purchased` is NULL on **21 of 22 clients**, so every "sessions remaining" figure in the
  hub, the PWA and the client's own portal is inferred from counting rows and shown as though it
  were what they bought.
- `delivery_mode` was wrong on Monique Weardon — recorded `studio_1to1` while her profile said
  `training_location: home` and her entire history is at-home work.
- `profile.logistics.frequency` was UNSET on all 22 clients before the cadence CR.
- `clients.equipment` is unconfigured on legacy clients, which means Plan Agent generation for them
  is completely unconstrained — the exact failure CR-EF-117 was raised for.
- Medication exists in two places at once (`health.medications` structured and
  `health.medications_relevant` free text) with real data inconsistent across both.
- All six of Monique's main sessions carried `archetype = 'A'`, which collapsed two distinct
  workouts into one on the mobile client screen and made the A/B/C rotation meaningless.

Each of those was found one client at a time, by accident, while doing something else. This Work
Order does it deliberately and to a checklist.

**Order matters: profiles before blocks.** Package, cadence, equipment and delivery mode all feed
block generation, session spacing and the pot. Defining a block against an incomplete profile bakes
the gaps into the programme.

---

## Per-client checklist (the UNIT of work)

One unit per client. A client is done when every line is either confirmed correct or corrected:

| Field | Where | Confirm |
|---|---|---|
| `package_type` | client record | One of `4-week`/`6-week`/`12-week`/`24-week`/`ongoing`, matching what they actually bought |
| `sessions_purchased` | client record | **The real number they paid for** — the figure this whole WO exists to establish |
| `profile.logistics.frequency` | profile JSONB | `{unit, per_unit}` matching how Esther actually books them |
| `delivery_mode` | client record | `studio_1to1` or `home_training` — cross-check against `profile.logistics.training_location` and their real history |
| `clients.equipment` | client record | Explicit list, or explicit `[]` for bodyweight-only. **Never left NULL** |
| `clients.band_set_id` | client record | EF Studio set, or their own set linked |
| `profile.health.medications` | profile JSONB | Structured entries; migrate anything still in `medications_relevant` |
| `profile.health.gp_clearance_required` | profile JSONB | Trainer judgement, explicitly set |
| PAR-Q | `signed_parq` / `client_documents` / override | One of the three legitimate routes actually satisfied |
| Session archetypes | sessions | Distinct workouts carry distinct archetypes — not everything `A` |

Then, once the profile is confirmed: **define the block** — sessions, cadence spacing, and the
supplementary work (see CR-EF-125) attached without consuming the pot.

---

## LANES

| Lane | Scope |
|---|---|
| A | The 22 client profiles, one client per unit, in an order Craig/Esther choose |
| B | Block definition per client, after that client's profile is confirmed |
| C | Derived verification — a script that reports, across all clients, which checklist fields are still unset (re-run at the end, never a hand-typed list) |

---

## Notes

- This is Craig and Esther's data work, not a lane's. Claude's job is to make it easy: surface what
  is missing per client, apply confirmed values, and verify.
- **Do not programmatically backfill `sessions_purchased`** — Craig's decision 2026-09-01
  (`qmtijo101tm`). A derived guess recorded as fact is worse than an acknowledged estimate.
- Until a client is worked, the app shows their pot as an unconfirmed estimate rather than a bare
  number or a blank.
- CR-EF-125 (supplementary workouts attaching to every session without consuming the pot) should
  land before Lane B, or every block defined here will need revisiting.

## LEDGER

| Date | Event |
|---|---|
| 2026-09-01 | Raised from Craig. Prompted by finding `sessions_purchased` NULL on 21 of 22 clients during the Lane 3 parity review. |
