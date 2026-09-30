# Lane report — ef-medical-conditions-voice (WO-EF-073, CR-EF-209)

## Scope executed
Voice pass on `/medical-conditions` exactly as specified in
`.context/lanes/LANE-BRIEF-ef-medical-conditions-voice.md`. Two files touched:

- `app/medical-conditions/MedicalConditionsClient.tsx`
- `app/medical-conditions/page.tsx`

## Changes applied
All CURRENT → NEW string replacements from the brief, character for character,
including:

- Hero heading / subhead / badge label (`Exercise Referral & Cancer Rehab` →
  `Cancer & Exercise Rehabilitation`, value stays `L4`)
- Why It Stalls → Where You Might Be (eyebrow + three paras + Callout body)
- How I Work heading (`Safe First. Then Confident.` → `Safe First, Then Confident`)
  + howIWork[0..2] bodies/titles as listed
- firstSession[0..3] bodies as listed
- Quote Callout title (quote marks removed) + body (`— Esther` removed)
- What Progress Looks Like intro + progress[0].body (`scales` removed)
- Honest About Scope → Being Honest With You (eyebrow + two paras)
- FaqSplit heading → `Questions You Might Have`; faqs[1] and faqs[3] bodies
- CTABand heading + body
- `page.tsx` metadata.title, metadata.description, Service schema description
- FAQPage JSON-LD answers 2 and 4 updated to match new faqs[1]/faqs[3] bodies

## Deliberately untouched (per brief)
- All alt text, `imageDescription` props, `<details>` description texts
- Images, layout, components, eyebrows/headings not listed in the brief
- Unlisted array titles (e.g. howIWork[0].title `Screened properly`,
  howIWork[2].title `A pause, not a ban`, firstSession titles, progress titles,
  faqs titles, section comments)
- Escape style: kept `\u2019` / `\u201C` / `\u201D` / `\u2014` inside JS string
  literals; JSX copy stays inside `{"..."}` so escapes work

## Checks
- Escape grep (`Barrier`, `Why It Stalls`, `Honest About Scope`, `scales`,
  `— Esther`, `Exercise Referral & Cancer Rehab`) on both files: **0 hits**
  (case-sensitive; uppercase section comments `{/* WHY IT STALLS */}` /
  `{/* HONEST ABOUT SCOPE */}` do not match the brief's title-case strings and
  were left in place as code comments, not copy)
- `npx tsc --noEmit`: see lane-notes / LANE-RESULT — worktree node_modules was
  a broken junction into a dead worktree; environment issue, not caused by this
  copy change

## Commit
`copy(CR-EF-209): match /medical-conditions to site voice`
