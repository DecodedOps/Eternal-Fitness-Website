# Lane notes — cr-ef-210-eb-col-resize

- Non-interactive lane. Implemented, typechecked, committed; no browser or dev server (per lane rules).
- Commit: `eb5f573` — `CR-EF-210: endurance calendar — non-clip Date/Day defaults + editor drag-resize columns`
- Report commit follows this note file.
- tsc clean on this worktree (no pre-existing errors surfaced).
- Widths are localStorage-only by design; document body/DB untouched.
- Print path: screen defaults widened; `@media print` percentage column widths left exactly as they were; `.eb-col-resize` joins the editor-only hide list.
- Open question for a human pass: after the first resize, non-customised columns freeze at measured px (see CR-EF-210.md). If Craig wants them to stay proportional, that needs a different model than `table-layout: fixed`.
