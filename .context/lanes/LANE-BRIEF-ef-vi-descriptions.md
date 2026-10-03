# Lane brief — "Describe this image" gaps (WO-EF-073 u5)

Worktree `D:\apps\worktrees\eternal-fitness-website\ef-medical-conditions-page` (branch `lane/ef-medical-conditions-page`).
Do NOT run dev servers or push. One commit: `feat(WO-EF-073): add missing 'Describe this image' descriptions (8 images)`.
Use the description texts below **character for character** (curly apostrophes/dashes as shown are fine as
literal characters inside a JS string; inside raw JSX text use `&rsquo;` / `&mdash;` like the neighbouring
descriptions do). Do not change any alt text, layout, or other copy.

## A. Components with an `imageDescription` prop — just add the prop

1. `app/medical-conditions/MedicalConditionsClient.tsx` — `PageHero` (hero image `approach-step3-deadlift-clients.jpg`):
   `imageDescription="A one-to-one session on the studio floor. The client hinges forward at the hips holding a single small dumbbell in one hand. Esther stands beside him in the same hinge, hands sliding down her own thighs to show the path the movement takes rather than describing it. Neither is lifting from the floor; a loaded barbell rests on the mat at the edge of the frame."`

2. `app/medical-conditions/MedicalConditionsClient.tsx` — `CTABand` (`studio-kettlebell-playful.jpg`):
   `imageDescription="Two people stand together in the studio’s back room. One holds a kettlebell by its handle close to her chin with both hands, wearing training gloves, and laughs; the other stands beside her with her hands free, smiling as she watches. A tower of dumbbells in weight order and a stack of wooden step boxes sit against the wall behind them, and the floor between is clear."`

3. `app/about/AboutPageClient.tsx` — the `PageHero` (`about-hero-esther-portrait.png`):
   `imageDescription="A portrait of Esther from the waist up, hands resting on her hips, smiling straight at the camera. She stands against the studio’s plywood wall with a row of kettlebells racked in weight order on the shelf behind her, and the word “EXCUSES” from the wall’s painted lettering above her head."`

4. `app/contact/ContactPageClient.tsx` — the `CTABand` (`esther-headshot-smile.jpg`): same text as item 3.

5. `app/visual-impairment/VisualImpairmentClient.tsx` — the `PageHero` (`hero-vi-kettlebell-rack.jpg`):
   `imageDescription="Esther stands at the kettlebell shelf with one hand resting on a bell in the top row. The bells sit in weight order along the shelf, the lighter ones marked with coloured bands, each one in the place it is always kept. The floor in front of the shelf is clear."`

## B. Plain `<Image>` in split layouts — add a figure wrapper + disclosure

Copy the exact pattern already used in `app/personal-training/PersonalTrainingClient.tsx` (~lines 124–132):
`<figure className="ef-figure">` wrapping the existing image container (`<Reveal ... className="ds-split-img">`),
followed by
```tsx
<details className="ef-desc">
  <summary>Describe this image</summary>
  <p>…text…</p>
</details>
```
inside the figure. Keep the Reveal/Image props exactly as they are.

6. `app/medical-conditions/MedicalConditionsClient.tsx` — split image `about-studio-band-stretch.jpg` (Why It Stalls section):
   `Two people facing each other across the studio floor with a single long resistance band stretched between them, one end each. Esther holds her end in at her chest and sits down into a half-squat &mdash; the same position the client is working in &mdash; so the shape is being shown rather than described. The kettlebell shelves, the whiteboard and the suspension straps are along the wall behind.`

7. `app/medical-conditions/MedicalConditionsClient.tsx` — split image `approach-step2-lunges-together.png` (Your First Session section):
   `Two people on the blue mats, side by side, both in a half-kneeling lunge with the back knee down on the padding and a hand resting on the front thigh. Esther is in the same position as the client rather than standing over her, so the shape can be copied from alongside. Both are laughing. The foam rollers are racked on the wall behind them and the mats are clear.`

8. `app/HomePageClient.tsx` — `specialist-training-esther-client.jpg` (~line 233, inside the `.spec-photo` div).
   Here do NOT add a figure wrapper (it would break that card's layout): put the `<details className="ef-desc">`
   immediately after the `.spec-photo` div's closing tag, as its next sibling — the same way the homepage's
   `why-coaching-review.jpg` disclosure sits right after its `.wimg` div (~lines 89–96). Text:
   `Esther stands in front of the power rack, smiling as a client steps up onto a low black aerobic step towards her. Her hands stay at her sides &mdash; she is watching the movement rather than holding him. Weight plates hang on pegs on the rack and along the wall, a loaded barbell rests on the floor to one side, and the floor between them is clear.`

## Checks
- `npx tsc --noEmit` passes.
- Report every file/line you changed in `.context/lanes/LANE-REPORT-ef-vi-descriptions.md`.
