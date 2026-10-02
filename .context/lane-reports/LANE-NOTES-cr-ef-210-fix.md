# Lane notes — CR-EF-210 follow-up (cr-ef-210-fix)

Branch: `cr-ef-210-staging`. Worktree: `D:\apps\worktrees\eternal-fitness-website\cr-ef-210-eb-col-resize`.

## What was done

Exactly the two staging-measured fixes, nothing else:

1. **Defaults widened** (`app/globals.css` + `EB_COL_FALLBACK` in `EnduranceBlockEditor.tsx`)
   - Date column: 112px → **124px**
   - Day column: 76px → **100px**
   - CR-EF-210 comment above the `th:nth-child` rules updated to name the `.eb-cell`
     padding as the reason (defaults still clipped because `.eb-cell` adds its own
     padding on top of the 14px header cell padding).

2. **Resize handle fully grabbable** (`.eb-col-resize` in `app/globals.css`)
   - `right: -3px` → **`right: 0`**
   - `width: 6px` → **`width: 10px`**
   - The whole handle now sits inside its own sticky header cell, so the next header
     cell (painted later, also sticky) no longer covers the overhang.

`EB_COL_FALLBACK`'s comment does not quote the old numbers ("Matches the non-clip
screen defaults for Date/Day"), so it needed no edit.

## Verification

- `npx tsc --noEmit` — clean (npm warns about unknown `only-built-dependencies`
  project config; unrelated pre-existing warning, no type errors).
- Escape grep for the old values (`width: 112px|width: 76px|right: -3px` in
  globals.css; `date: 112|day: 76` in the editor) — 0 hits on the CR-EF-210 rules.
  One unrelated `min-width: 76px` remains at `app/globals.css:816` inside `.pick span`
  (a picker chip rule, pre-existing, not part of this CR).
- No dev server / browser / push, per the lane brief. Visual confirmation of the
  staging measurements is the reviewer's call; this lane only applied the numbers
  and grab geometry that were measured on staging.

## Deviations

None. All four changes + both comments are exactly as specified. Unit id was not
named in the brief, so `unit` in the JSON is empty.
