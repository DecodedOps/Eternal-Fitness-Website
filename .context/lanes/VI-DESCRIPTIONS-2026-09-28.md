# VI "Describe this image" audit and copy — 2026-09-28

Read-only pass. No repo files edited. Source docs read: `.context/_archive/2026-09-23/.context/brief-image-plates-opendesign-2026-08-28.md`
(Rules brief, CR-EF-086 Lane 6) and `.context/_archive/2026-09-23/.context/plate-manifest-approved-2026-08-29.md`
(31-photo manifest, approved by Craig 2026-08-29).

## Rules summary (from the brief, verbatim source quoted where it matters)

- **Two separate things, two separate audiences.** `alt` text serves screen-reader users. A visible
  `<details>` disclosure under the photo ("Describe this image") serves the much larger group with
  low vision who are not running a screen reader — described-image copy is not the same text as alt,
  and every significant photograph needs both.
- **Alt text and described copy both need three elements, all three required:** what is happening,
  who is in frame, and **what the adaptation is** (fixed equipment positions, clear floor, hands-off
  coaching, seated/kneeling at eye level, etc.). The third is the one that makes this Eternal Fitness
  copy rather than generic stock-photo alt text.
- **Vocabulary ban applies to both fields** (from `brand.json`'s avoid list): transformation,
  before-and-after, weight loss, aesthetic, quick fixes, boot-camp, push yourself, no pain no gain,
  gym-floor intimidation, just push harder.
- **No body descriptions of anyone in frame**, and no judgement words about bodies or ability.
- **No condition roll-calls** — this is the site's standing copy rule, generalise rather than listing
  named conditions.
- **Never name a client.** Only name Esther when the photo can be confidently matched to her (compare
  hair, build, role in frame against a reference photo that already names her, e.g.
  `about-hero-esther-portrait.png`). If it's ambiguous, say "a client" or "a trainer" and don't guess.
- **Author from the photograph, not the filename.** Two files in this set are already known to be
  mis-named against what's actually in frame (`studio-lunge-pair.jpg` is two dogs, not a lunge;
  `about-studio-kettlebells.jpg` has no kettlebell in it) — filenames are not evidence.
- **Say the floor/area is clear or note fixed storage positions** where that's actually visible — this
  is usually where "what the adaptation is" lives for a VI reader (nothing to walk into, kit lives in
  the same place every time).
- Roughly 45–80 words / 3–4 sentences for a new described-image paragraph (per this task's brief);
  the source manifest itself asked for 1–3 sentences — both are short, plain, present tense, British
  English.

## Component support confirmed

- `components/ds/PageHero.tsx` — accepts `imageDescription?: string` (lines 36–37), renders
  `<details className="ef-desc ...">` with `<p>{imageDescription}</p>` (lines 125–128, 173–176).
- `components/ds/CTABand.tsx` — accepts `imageDescription?: string` (lines 16–17), same rendering
  pattern (lines 52–55, 89–92).
- Plain `<Image>` split layouts have **no shared prop** — the `<details className="ef-desc">` is
  hand-written JSX next to the image, and the pattern varies by file:
  - **Pattern A — wrapped in a `<figure className="ef-figure">`, disclosure as a sibling after the
    image container.** This is the pattern to copy for any split image that doesn't have it yet.
    `app/personal-training/PersonalTrainingClient.tsx:124-132`:
    ```tsx
    <figure className="ef-figure">
      <Reveal y={40} className="ds-split-img" style={{ aspectRatio: "3/2" }}>
        <Image src="/images/consultation-programme-notes.jpg" alt="..." fill sizes="(max-width: 1000px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "42% 50%" }} />
      </Reveal>
      <details className="ef-desc">
        <summary>Describe this image</summary>
        <p>A one-to-one session, paused. ...</p>
      </details>
    </figure>
    ```
  - **Pattern B — no figure wrapper, `<details>` follows the image's own wrapper div directly**
    inside the same parent. `app/HomePageClient.tsx:89-96` (`.wic` > `.wimg` > `Image`, then
    `<details className="ef-desc">` as the next sibling, then a badge div):
    ```tsx
    <div className="wic">
      <div className="wimg">
        <Image src="/images/why-coaching-review.jpg" alt="..." fill sizes="(max-width: 1000px) 100vw, 40vw" style={{ objectFit: "cover", objectPosition: "38% 30%" }} />
      </div>
      <details className="ef-desc">
        <summary>Describe this image</summary>
        <p>A one-to-one session at the power rack, seen from a little further back. ...</p>
      </details>
      <div className="wbadge">...</div>
    </div>
    ```
  - Either pattern is acceptable; Pattern A (figure wrapper) is the more common one and is what the
    two `MedicalConditionsClient.tsx` split images below should copy, since neither currently has a
    wrapping element to attach the disclosure to.
- `app/visual-impairment/VisualImpairmentClient.tsx` uses its own **`vi-desc`** class instead of
  `ef-desc` (lines 156, 223, 282) — an earlier, page-scoped version of the same disclosure pattern,
  predating the `ef-desc` convention used everywhere else. Not a defect, just a naming difference to
  be aware of if this page is ever touched for consistency.

## Audit table

| File | Image | Flagged as | Verdict | Evidence |
|---|---|---|---|---|
| `app/medical-conditions/MedicalConditionsClient.tsx` | `/images/approach-step3-deadlift-clients.jpg` (PageHero) | missing | **missing** | Lines 56–67: `imageAlt` set, no `imageDescription` prop |
| `app/medical-conditions/MedicalConditionsClient.tsx` | `/images/about-studio-band-stretch.jpg` (split) | missing | **missing** | Lines 99–107: plain `<Image>`, no `<details>` nearby, no wrapping figure |
| `app/medical-conditions/MedicalConditionsClient.tsx` | `/images/approach-step2-lunges-together.png` (split) | missing | **missing** | Line 141–143: plain `<Image>`, no `<details>` nearby, no wrapping figure |
| `app/medical-conditions/MedicalConditionsClient.tsx` | `/images/studio-kettlebell-playful.jpg` (CTABand) | missing | **missing** | Lines 198–205: no `imageDescription` prop |
| `app/about/AboutPageClient.tsx` | `/images/about-hero-esther-portrait.png` (PageHero) | missing | **missing** | Lines 50–63: `imageAlt` set, no `imageDescription` prop |
| `app/contact/ContactPageClient.tsx` | `/images/studio-kettlebell-shelf.jpg` (PageHero) | missing | **already described (false positive)** | Line 137: `imageDescription` prop present |
| `app/contact/ContactPageClient.tsx` | `/images/esther-headshot-smile.jpg` (CTABand) | missing | **missing** | Lines 413–423: no `imageDescription` prop |
| `app/faqs/FAQsPageClient.tsx` | `/images/consultation-warm-chat.jpg` (PageHero) | missing | **already described (false positive)** | Line 201: `imageDescription` prop present |
| `app/HomePageClient.tsx` | `/images/hero-pullup-rack.png` | missing | **already described (false positive)** | Lines 63–66: `<details className="ef-desc ef-desc--overlay ...">` present |
| `app/HomePageClient.tsx` | `/images/specialist-training-esther-client.jpg` | missing | **missing** | Line 233: plain `<Image>` in `.spec-photo` div, no `<details>` anywhere near it |
| `app/HomePageClient.tsx` | `/images/studio-1.jpg` (CTA background) | missing | **already described (false positive)** | Lines 288–291: `<details className="ef-desc ef-desc--overlay">` present (>600 chars after the `<Image>` at line 277 — this is exactly the audit's known false-positive case) |
| `app/personal-training/PersonalTrainingClient.tsx` | `/images/coaching-bench-press-spot.jpg` (PageHero) | missing | **already described (false positive)** | Line 95: `imageDescription` prop present |
| `app/pricing/PricingPageClient.tsx` | `/images/pricing-hero-coaching.jpg` (PageHero) | missing | **already described (false positive)** | Line 101: `imageDescription` prop present |
| `app/testimonials/TestimonialsPageClient.tsx` | `/images/consultation-programme-review.jpg` (PageHero) | missing | **already described (false positive)** | Line 69: `imageDescription` prop present |
| `app/visual-impairment/VisualImpairmentClient.tsx` | `/images/studio-fixed-positions.jpg` | missing | **already described (false positive)** | Lines 156–163: `<details className="vi-desc">` present |
| `app/visual-impairment/VisualImpairmentClient.tsx` | `/images/coaching-plank-lowback-cue.jpg` | missing | **already described (false positive)** | Lines 223–231: `<details className="vi-desc">` present |
| `app/visual-impairment/VisualImpairmentClient.tsx` | `/images/esther-portrait-studio.jpg` | missing | **already described (false positive)** | Lines 282–285: `<details className="vi-desc">` present |
| `app/visual-impairment/VisualImpairmentClient.tsx` | `/images/studio-lunge-pair.jpg` (CTA background) | missing | **correctly none needed** | Line 331–333: `alt=""`, decorative background behind text — per manifest EF-15 this is right and stays; no disclosure required |
| `app/visual-impairment/VisualImpairmentClient.tsx` | `/images/hero-vi-kettlebell-rack.jpg` (PageHero) | missing | **missing** | Lines 62–92: `imageAlt` set, no `imageDescription` prop. Manifest EF-09 flagged this exact gap on 2026-08-29 and it is still open. |

**Net: 8 genuinely missing, 10 already described (false positives from the ~600-char proximity heuristic), 1 correctly decorative with no description needed.**

---

## Descriptions for the 8 missing images

### 1. `app/medical-conditions/MedicalConditionsClient.tsx:56` — PageHero `/images/approach-step3-deadlift-clients.jpg`

**Source:** reused verbatim from `app/HomePageClient.tsx:175` (`approach-step3-deadlift-clients.jpg`,
already live and to standard on `/`; same file, same manifest entry EF-19).

```
A one-to-one session on the studio floor. The client hinges forward at the hips holding a single small dumbbell in one hand. Esther stands beside him in the same hinge, hands sliding down her own thighs to show the path the movement takes rather than describing it. Neither is lifting from the floor; a loaded barbell rests on the mat at the edge of the frame.
```

Add as the `imageDescription` prop on the `PageHero` call at line 56.

---

### 2. `app/medical-conditions/MedicalConditionsClient.tsx:100` — split image `/images/about-studio-band-stretch.jpg`

**Source:** reused verbatim from the approved manifest, EF-24 (`about-studio-band-stretch.jpg`,
`app/about/AboutPageClient.tsx:188`, already wired as `imageDescription` on that page's CTABand at
line 279 of `AboutPageClient.tsx` — same photograph, described-image copy not yet on this page).

```
Two people facing each other across the studio floor with a single long resistance band stretched between them, one end each. Esther holds her end in at her chest and sits down into a half-squat — the same position the client is working in — so the shape is being shown rather than described. The kettlebell shelves, the whiteboard and the suspension straps are along the wall behind.
```

Wrap the existing `<Image>` at lines 99–107 in `<figure className="ef-figure">` (per Pattern A above)
and add `<details className="ef-desc">` as a sibling after the `Reveal`/image block.

---

### 3. `app/medical-conditions/MedicalConditionsClient.tsx:142` — split image `/images/approach-step2-lunges-together.png`

**Source:** reused verbatim from `app/HomePageClient.tsx:159` (same file, already live there and on
`app/contact/ContactPageClient.tsx` as `mobility-hip-flexor-stretch.jpg`'s twin description; manifest
EF-18).

```
Two people on the blue mats, side by side, both in a half-kneeling lunge with the back knee down on the padding and a hand resting on the front thigh. Esther is in the same position as the client rather than standing over her, so the shape can be copied from alongside. Both are laughing. The foam rollers are racked on the wall behind them and the mats are clear.
```

Same treatment as #2: wrap the `<Image>` at line 142 in `<figure className="ef-figure">` and add the
`<details className="ef-desc">` sibling.

---

### 4. `app/medical-conditions/MedicalConditionsClient.tsx:198` — CTABand `/images/studio-kettlebell-playful.jpg`

**Source:** new — not in the 31-photo manifest (that set covered the 31 files live in 2026-08-28;
this file is not among them). Looked directly at `public/images/studio-kettlebell-playful.jpg`.

Two people stand together just inside a doorway in the studio's darker back room. One is holding a
kettlebell up close to her chin with both hands, wearing training gloves; the other stands beside her,
laughing, hands free. Neither is named with confidence — the hair and build of both don't match the
reference photograph of Esther (`about-hero-esther-portrait.png`), so this is written as two clients
rather than guessing which, if either, is Esther.

```
Two people stand together just inside the studio's back room. One holds a kettlebell up close to her chin with both hands, wearing training gloves; the other stands beside her laughing, with nothing in her hands. A rack of dumbbells stands against the wall behind them, with storage boxes stacked underneath.
```

Add as the `imageDescription` prop on the `CTABand` call at lines 198–205.

*Flag:* I could not confidently identify either person as Esther in this photograph — hair colour and
build for both differ from the reference portrait used elsewhere on the site. Written without naming
either person. Worth a second look from Esther if it matters which one she is in this shot.

---

### 5. `app/about/AboutPageClient.tsx:50` — PageHero `/images/about-hero-esther-portrait.png`

**Source:** new. The manifest (EF-02) wrote a replacement **alt** for this file (already live at line
53) but never wrote described-image copy for it — that field is blank in the approved manifest. Looked
directly at `public/images/about-hero-esther-portrait.png`.

```
A three-quarter portrait of Esther, one hand resting on her hip, smiling straight at the camera. She stands against the studio's plywood wall with a row of kettlebells racked in weight order on the shelf just behind her. Part of the wall's painted lettering is visible above her head.
```

Add as the `imageDescription` prop on the `PageHero` call at line 50.

---

### 6. `app/contact/ContactPageClient.tsx:413` — CTABand `/images/esther-headshot-smile.jpg`

**Source:** reused, adapted only in framing language — this is the same photograph as
`about-hero-esther-portrait.png` at a near-identical crop (confirmed in manifest EF-11: "The same
photograph as the /about hero at a near-identical crop"). Using the same described-image text written
for #5 above, since both crops show the same scene.

```
A three-quarter portrait of Esther, one hand resting on her hip, smiling straight at the camera. She stands against the studio's plywood wall with a row of kettlebells racked in weight order on the shelf just behind her. Part of the wall's painted lettering is visible above her head.
```

Add as the `imageDescription` prop on the `CTABand` call at lines 413–423.

---

### 7. `app/HomePageClient.tsx:233` — inline `/images/specialist-training-esther-client.jpg`

**Source:** new. The manifest (EF-20) flagged this file as provisional/"Ask me" because the copy
staged for review in Open Design at the time was rotated a quarter turn and unreadable. The copy
actually in `public/images/specialist-training-esther-client.jpg` today is upright and clear, so that
concern doesn't apply to the current file — looked directly at it.

The woman inside the power rack is a plausible match for Esther (build and role — standing back,
coaching rather than being coached) but her hair is pulled back tightly and the light/angle make a
confident match against the reference portrait harder than the other photos in this set, so this is
named cautiously.

```
Esther stands inside the power rack, smiling as she watches a client step one knee up onto a low black box. Her hands stay at her sides rather than spotting him. Weight plates hang from pegs on both sides of the rack, and a barbell rests on wall hooks behind them, with kettlebells and dumbbells stored to one side of the frame.
```

Wrap the `<Image>` at line 233 (inside the existing `.spec-photo` div) in `<figure className="ef-figure">`
and add `<details className="ef-desc">` as a sibling, matching Pattern A.

*Flag:* Named Esther based on role in frame (coaching, not being coached) and general build, but her
hair is scraped back and the light is warm/yellow, so this is a lower-confidence match than the other
namings in this batch — worth Esther's own confirmation if precision matters here.

---

### 8. `app/visual-impairment/VisualImpairmentClient.tsx:62` — PageHero `/images/hero-vi-kettlebell-rack.jpg`

**Source:** reused verbatim from the approved manifest, EF-09 — this exact gap ("It has no disclosure
on the page today, so one is proposed here; the alt is untouched") was identified on 2026-08-29 and
is still open a month later.

```
Esther stands at the kettlebell shelf with one hand resting on a bell in the top row. The bells sit in weight order along the shelf, the lighter ones marked with coloured bands, each one in the place it is always kept. The floor in front of the shelf is clear.
```

Add as the `imageDescription` prop on the `PageHero` call at lines 62–92. Note: this page's own
convention elsewhere is `vi-desc` rather than `ef-desc` (see component-support note above), but since
this goes through the shared `PageHero` component's `imageDescription` prop, the component renders its
own `ef-desc` class regardless — no manual class choice needed here.
