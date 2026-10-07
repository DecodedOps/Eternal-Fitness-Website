# Lane brief — /medical-conditions fresh images (WO-EF-073 u6, CR-EF-209)

Worktree `D:\apps\worktrees\eternal-fitness-website\ef-medical-conditions-images` (branch `lane/ef-medical-conditions-images`).
Do NOT run dev servers or push. Do NOT touch any file except `app/medical-conditions/MedicalConditionsClient.tsx`.
The four new image files are ALREADY in `public/images/` (untracked) — commit them together with your change:
`git add public/images/consultation-standing-chat-mats.jpg public/images/active-ageing-rapport-laughing.jpg public/images/active-ageing-hand-position-cue.jpg public/images/rapport-trainer-and-client-laughing.jpg app/medical-conditions/MedicalConditionsClient.tsx`
One commit: `feat(CR-EF-209): fresh images + captions on /medical-conditions`.

Keep every text string, heading, layout and component exactly as it is. Only the image `src`/`image`, `alt`/`imageAlt`,
position props and the four descriptions change. In JS string props keep the file's `\u2019` / `\u2014` escape style;
inside the `<details><p>` JSX text use `&rsquo;` / `&mdash;` as the existing descriptions do.

## 1. Hero — `PageHero`
- `image="/images/consultation-standing-chat-mats.jpg"`
- `imageAlt="Esther standing on the blue mats in the private Worthing studio with a pen and a sheet of notes, smiling as she talks with a client at the start of a session."`
- `imageObjectPosition="56% 50%"`
- `imageObjectPositionWide="50% 45%"`
- `imageDescription={"A first conversation in the studio. Esther stands on the blue mats holding a pen and a sheet of notes, smiling towards a client who has her back to the camera. Nobody is lifting anything yet \u2014 talking comes first. Foam rollers and blocks hang in fixed places on the wall behind her, resistance bands are racked by the door, and the mats are clear."}`

## 2. "Where You Might Be" split image (currently `about-studio-band-stretch.jpg`)
- `src="/images/active-ageing-rapport-laughing.jpg"`
- `alt="Esther laughing with an older client between exercises in the private Worthing studio, one hand at his arm, in front of the kettlebell shelves."`
- In the Image `style`, set `objectPosition: "41% 50%"` alongside the existing `objectFit: "cover"`.
- Replace the `<p>` inside that image's `<details className="ef-desc">` with:
  `Esther and an older client stand close together between exercises, both laughing. She has a hand at his arm, checking a position rather than holding him up, and he stands relaxed and upright. Behind them the kettlebells sit on their shelves in weight order, the suspension straps hang from the ceiling, and the whiteboard is on the far wall. The floor around them is clear.`

## 3. "Your First Session" split image (currently `approach-step2-lunges-together.png`)
- `src="/images/active-ageing-hand-position-cue.jpg"`
- `alt="Esther guiding an older client’s hand and wrist into position in the private Worthing studio, looking down at his grip as she sets it up."` (use `\u2019` for the apostrophe if the prop is a `{"..."}` string, or `&rsquo;` if it is a plain JSX attribute string — match how the attribute is currently written; a plain `"..."` attribute can take the literal ’ character)
- In the Image `style`, set `objectPosition: "61% 50%"` alongside the existing `objectFit: "cover"`.
- Replace the `<p>` inside that image's `<details className="ef-desc">` with:
  `Esther stands beside an older client and gently guides his hand and wrist into position, her eyes on his grip rather than on him. He holds his arm out and lets her adjust it. A 10kg kettlebell and a lighter one sit on the low rack behind them, and a padded bench and a step are stored along the far wall, so the space they are working in is clear.`

## 4. CTA band — `CTABand`
- `image="/images/rapport-trainer-and-client-laughing.jpg"`
- `imageAlt="Esther and a client standing side by side in the private Worthing studio, laughing together beside the rack of exercise balls."`
- add `imagePosition="43% 40%"`
- `imageDescription={"Esther and a client stand side by side, mid-laugh, turned towards each other. Nobody is training in this moment \u2014 it is the conversation between exercises. Behind them the exercise balls sit on their rack in size order with the medicine balls stacked below, and the window, wall clock and desk are on the back wall. The floor between them is clear."}`

## Checks
- `npx tsc --noEmit` passes.
- `grep -n "approach-step3-deadlift-clients\|about-studio-band-stretch\|approach-step2-lunges-together\|studio-kettlebell-playful" app/medical-conditions/MedicalConditionsClient.tsx` returns nothing.
- `git status` clean after commit; report at `.context/lanes/LANE-REPORT-ef-medical-conditions-images.md`.
