# Fix brief 1 — hero crop (WO-EF-073 u6)

Same worktree/branch. Do NOT run dev servers or push.

`public/images/consultation-standing-chat-mats.jpg` has already been re-cropped (modified, uncommitted) so Esther sits
further right of the hero heading. Update the `PageHero` in `app/medical-conditions/MedicalConditionsClient.tsx`:
- `imageObjectPosition="56% 50%"` → `imageObjectPosition="81% 40%"`
- `imageObjectPositionWide="50% 45%"` → `imageObjectPositionWide="50% 40%"`

No other changes. Commit both files in one commit:
`git add public/images/consultation-standing-chat-mats.jpg app/medical-conditions/MedicalConditionsClient.tsx`
message `fix(CR-EF-209): re-crop hero so Esther clears the heading`. Check `npx tsc --noEmit` passes.
