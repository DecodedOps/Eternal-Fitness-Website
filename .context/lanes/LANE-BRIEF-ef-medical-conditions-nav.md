# Lane brief — medical-conditions nav link (WO-EF-073, CR-EF-209)

Worktree `D:\apps\worktrees\eternal-fitness-website\ef-medical-conditions-page` (branch `lane/ef-medical-conditions-page`).
Do NOT run dev servers or push. One commit: `feat(CR-EF-209): link /medical-conditions from nav, footer, legacy URL`.

1. `components/Navbar.tsx`
   - In `navItems`, the "Specialist Training" item's `children` array: add
     `{ label: "Medical Conditions", to: "/medical-conditions" }` **before** the existing
     "Blind & Partially Sighted" child.
   - In `pageTitles`, add `"/medical-conditions": "Medical Conditions",` after the `"/visual-impairment"` entry.
   - Check that the desktop dropdown and the mobile menu both render `children` from `navItems`
     (they should — do not restructure anything; if either one hard-codes its children instead, add the same link there too and say so in your report).
2. `components/Footer.tsx` — add `<Link href="/medical-conditions" className={footerLinkClasses}>Medical Conditions</Link>`
   directly after the existing "Specialist Training" footer link, same markup pattern.
3. `next.config.js` — the legacy redirect
   `{ source: "/exercising-with-a-medical-condition", destination: "/specialist-training", permanent: true }`
   must now point to `"/medical-conditions"` (keep `permanent: true`). Change only the destination.

Check `npx tsc --noEmit` passes. Write a short report at `.context/lanes/LANE-REPORT-ef-medical-conditions-nav.md`.
