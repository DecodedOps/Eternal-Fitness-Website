# CR-EF-210 — Endurance block calendar: no clipped columns + drag-resizable columns

## What changed

### `app/globals.css`
- `.eb-table th:nth-child(1)` (Date): 76px → **112px**
- `.eb-table th:nth-child(2)` (Day): 56px → **76px**
- Removed `width: 1%` from `.eb-date-cell` and `.eb-day-cell` (other styles kept). This is the clip root cause — `width: 1%` + an input that cannot grow the cell collapsed Date/Day to "20:" / "Sa".
- Screen-only rules only. The `@media print` block's percentage widths (8% / 6% / 17% / 35%) are untouched.
- New `.eb-col-resize` rules next to the existing `.eb-table` block: 6px absolute handle, `cursor: col-resize`, visible on hover/focus via teal tint + focus outline.
- Print: `.eb-col-resize` added to the existing "Editor-only chrome" hide rule.

This also fixes the read-only client view in `lib/documents/render.tsx`, which shares `.eb-table` / `.eb-date-cell` / `.eb-day-cell`. No change was needed in `render.tsx` itself.

### `app/hub/(protected)/clients/[id]/documents/[docId]/EnduranceBlockEditor.tsx`
- `<colgroup>` with one `<col>` per column (Date, Day, Run, Bike, Swim, Notes, plus Actions when not locked), widths driven by React state.
- `ColResizeHandle` on each of the six data-column header `<th>`s: `role="separator"`, `aria-orientation="vertical"`, `aria-label="Resize <Column> column"`, `tabIndex={0}`, pointer events with `setPointerCapture` (mouse + touch), ArrowLeft/ArrowRight ±16px, double-click resets that column, min width 56px.
- First resize snapshots currently rendered th widths so switching to `table-layout: fixed` does not jump.
- When any column has a user width: table gets `tableLayout: fixed`, `width` = sum of column widths (+ 80px Actions when unlocked), `minWidth: 100%`. Horizontal scroll still comes from `.eb-table-wrap { overflow-x: auto }` + the table's `min-width` floor.
- Widths persisted per browser under `localStorage["eb-col-widths-v1"]`; all reads/writes in try/catch. **Not** written to the document body/DB.
- "Reset column widths" text button next to the "Every cell is editable" hint, shown only when custom widths are set.
- Handles hidden when `locked` (editor chrome only).
- Code style kept: function components, `cn`, `eb-*` classes.

## Files
- `app/globals.css`
- `app/hub/(protected)/clients/[id]/documents/[docId]/EnduranceBlockEditor.tsx`
- `.context/lane-reports/CR-EF-210.md` (this file)
- `.context/lane-reports/LANE-RESULT-cr-ef-210-eb-col-resize.json`
- `.context/lane-reports/LANE-NOTES-cr-ef-210-eb-col-resize.md`

## Verify
- `npx tsc --noEmit` — clean (exit 0, no diagnostics).
- No browser/dev-server run (lane rules). Sticky-th + absolute handle containment is per CSS spec (sticky is a positioned element); not visually confirmed in a browser from this lane.
- Escape grep: no new status/badge/copy that asserts unmeasured behaviour; resize chrome is real DOM with real handlers.

## Anything unsure
- First custom width snaps *all six* columns to measured pixel widths (so `table-layout: fixed` has a complete set). Unresized columns therefore freeze at their measured width rather than staying on the CSS 16% Run/Bike/Swim rule once any resize has happened. Intentional — fixed layout needs concrete widths — but it is a behaviour change after the first drag.
- Fallback widths when a column is null but others are custom: Date 112 / Day 76 / Run-Bike-Swim 160 / Notes 220 / Actions 80. These are sensible, not measured from a live render.
- `border-collapse: collapse` + absolute handle inside sticky `th`: should work (th is positioned), not visually verified here.
