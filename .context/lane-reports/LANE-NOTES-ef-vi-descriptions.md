# Lane notes — ef-vi-descriptions

## Summary

Added missing "Describe this image" accessibility disclosures to 8 images across 5 files, per WO-EF-073 unit 5.

## Changes

| # | File | Image | Method |
|---|---|---|---|
| 1 | `MedicalConditionsClient.tsx` | `approach-step3-deadlift-clients.jpg` | `imageDescription` prop on `PageHero` |
| 2 | `MedicalConditionsClient.tsx` | `studio-kettlebell-playful.jpg` | `imageDescription` prop on `CTABand` |
| 3 | `AboutPageClient.tsx` | `about-hero-esther-portrait.png` | `imageDescription` prop on `PageHero` |
| 4 | `ContactPageClient.tsx` | `esther-headshot-smile.jpg` | `imageDescription` prop on `CTABand` |
| 5 | `VisualImpairmentClient.tsx` | `hero-vi-kettlebell-rack.jpg` | `imageDescription` prop on `PageHero` |
| 6 | `MedicalConditionsClient.tsx` | `about-studio-band-stretch.jpg` | `<figure>` wrapper + `<details>` disclosure (Why It Stalls split) |
| 7 | `MedicalConditionsClient.tsx` | `approach-step2-lunges-together.png` | `<figure>` wrapper + `<details>` disclosure (First Session split) |
| 8 | `HomePageClient.tsx` | `specialist-training-esther-client.jpg` | `<details>` after `.spec-photo` div (sibling, no figure wrapper) |

## Notes

- Items 1-5 use the existing `imageDescription` prop on `PageHero`/`CTABand` components — no structural change.
- Items 6-7 follow the pattern from `PersonalTrainingClient.tsx` (~line 124): `<figure className="ef-figure">` wrapping the `<Reveal>` + image, then `<details className="ef-desc">`.
- Item 8 is the homepage exception: the `.spec-photo` div's layout prevents a figure wrapper, so `<details>` is placed as the next sibling.
- `npx tsc --noEmit` passes cleanly.
- All description texts match the lane brief character-for-character.
