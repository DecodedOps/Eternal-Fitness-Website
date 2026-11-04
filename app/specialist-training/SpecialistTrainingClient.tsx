"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BOOKINGS_URL } from "@/lib/booking";
import {
  Section,
  SectionHeading,
  PageHero,
  CTABand,
  Reveal,
  CtaButton,
  ProcessFlow,
  PulseLine,
  IndexList,
  FaqSplit,
} from "@/components/ds";
import { IconEye } from "@/components/icons";

/**
 * Specialist Training hub — currently covers Blind & Partially Sighted only.
 * Cancer Rehabilitation and Strength/Balance & Falls content exists in the
 * codebase (2026-08-10 restructure) but was re-gated 2026-08-17 pending
 * content sign-off; their routes redirect here until cleared.
 *
 * Claims discipline: Esther holds Exercise Referral AND the Level 4 Cancer and
 * Exercise Rehabilitation (CanRehab) qualification. She is NOT a "Level 4
 * Personal Trainer", and Exercise Referral is NOT the Level 4 — the retired
 * hub's schema conflated the two. Keep them distinct here.
 */
export default function SpecialistTrainingClient() {
  const bookCta = { label: "Book a Free Consultation", href: BOOKINGS_URL, arrow: true };

  const specialisms = [
    {
      icon: IconEye,
      title: "Blind & Partially Sighted",
      href: "/visual-impairment",
      desc: "Training built around clear verbal instruction rather than visual demonstration, with consistent equipment placement and time to get familiar with the space.",
    },
  ];

  const steps = [
    {
      title: "Free consultation first",
      body: "We start with a conversation — no commitment, no obligation. I want to understand your circumstances, your history, and your goals before we do anything else.",
    },
    {
      title: "Check-in at the start of every session",
      body: "How are you feeling today? Energy, pain, sleep, any changes. The session plan is finalised then — because what works one week may not be right the next.",
    },
    {
      title: "Progress that adapts to you",
      body: "There is no fixed template. Programmes are built around your body and your goals — and adjusted as those things change.",
    },
  ];

  const faqs = [
    {
      title: "Do I need a GP referral?",
      body: "No. A GP referral is welcome but not required. I will ask about your medical history, and for some circumstances I may ask you to check with your GP or specialist team before we begin.",
    },
    {
      title: "How is this different from a regular personal trainer?",
      body: "I'm qualified in Exercise Referral, and hold the Level 4 Cancer and Exercise Rehabilitation qualification. That means I understand contraindicated movements, medication effects, fatigue management, and how capacity changes from one session to the next.",
    },
    {
      title: "What if my situation isn't covered here?",
      body: "Please still get in touch. This is where my training and experience are deepest, but the first conversation is free and I would always rather tell you honestly whether I'm the right person.",
    },
    {
      title: "What if I am having a bad day when I come in?",
      body: "That is what the check-in is for. I adapt the session to how you actually feel — not how the plan says you should feel. You will always leave having done something genuinely useful, even on the difficult days.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main-content">
        <PageHero
          layout="split"
          image="/images/who-health.jpg"
          imageAlt="A woman seated on a bench inside the power rack in the private Worthing studio, seen side-on, holding a single cable handle with her arm stretched overhead."
          imageObjectPosition="50% 38%"
          imageObjectPositionWide="50% 35%"
          eyebrow={"Specialist Training"}
          heading={<>Specialist<br />Personal Training</>}
          subhead={"Most personal training assumes a body that works in a predictable way. Mine does not. I work with people whose needs are routinely designed around rather than designed for."}
          primaryCta={bookCta}
          secondaryCta={{ label: "Find Out More", href: "#specialisms", variant: "ghost-white" }}
          imageDescription={"A cable exercise at the power rack. A woman in black sits on a bench inside the rack, seen from the side, with one arm stretched fully overhead holding a single cable handle, so the movement is done seated and one side at a time. Weight plates are stored on the rack's pegs, a bar and one loose plate lie on the floor at the front of the frame, and a large exercise ball sits on a rack above to the left."}
        />

        {/* THE APPROACH */}
        <Section background="white">
          <div className="ds-split">
            <figure className="ef-figure">
              {/* Square, not the default 3:4 — the photo is landscape with Esther and the client side by
                  side, and a portrait crop cuts one of them out (WO-EF-074) */}
              <Reveal y={40} className="ds-split-img" style={{ aspectRatio: "1 / 1" }}>
                <Image
                  src="/images/specialise-3.jpg"
                  alt="Esther and a client side by side on the studio mats, both down in the same low crouch with their hands on the mat, Esther doing the movement alongside her rather than watching."
                  fill
                  sizes="(max-width: 1000px) 100vw, 50vw"
                  style={{ objectFit: "cover", objectPosition: "50% 70%" }}
                />
              </Reveal>
              <details className="ef-desc">
                <summary>Describe this image</summary>
                <p>Esther and a client work side by side on two blue mats, both in the same position: one foot forward in a deep crouch, leaning over the front knee with their hands low by the mat. Esther is doing the movement with her rather than standing over her. Resistance bands and a foam roller hang on the wall to the left, two wooden plyo boxes are stacked to the right beside a vertical rack of round weights, and a window, a TV and a desk are on the back wall. The floor around the mats is clear.</p>
              </details>
            </figure>
            <div>
              <SectionHeading
                eyebrow={"The Approach"}
                eyebrowColor="teal"
                heading={"Specialist training is not general training done gently"}
              />
              <Reveal y={24}>
                <p className="ds-body" style={{ marginTop: 20, marginBottom: 16 }}>
                  {"The goal is not weight loss, not aesthetics, and not performance. The goal is capability — building strength that translates into the things you actually want to do, and confidence in a body whose circumstances have changed."}
                </p>
                <p className="ds-body" style={{ marginBottom: 16 }}>
                  {"Every session starts with a check-in. The plan for that day is set then, based on how you actually feel — not how you felt last week."}
                </p>
                <p className="ds-body" style={{ marginBottom: 28 }}>
                  {"Sessions are one-to-one in a private studio. There is no gym floor to navigate, no crowd, and no audience — which matters more than people expect."}
                </p>
                <CtaButton cta={bookCta} />
              </Reveal>
            </div>
          </div>
        </Section>

        {/* THE THREE SPECIALISMS */}
        <Section background="cream" id="specialisms">
          <SectionHeading
            eyebrow={"Where I Specialise"}
            heading={"In Depth"}
            intro={"I would rather do one thing properly than many things approximately. If your situation sits outside this, please still ask."}
          />
          <Reveal y={40} start="top 80%" style={{ marginTop: 40 }}>
            <IndexList
              accent="rose"
              panelEyebrow={"Specialist areas"}
              items={specialisms.map(({ icon, title, href, desc }) => ({
                icon,
                title,
                body: desc,
                cta: { label: "Learn more", href },
              }))}
            />
          </Reveal>
        </Section>

        {/* HOW IT WORKS */}
        <Section background="white">
          <SectionHeading eyebrow={"How It Works"} eyebrowColor="teal" heading={"What to Expect from Your Sessions"} />
          <div className="ds-art-divider"><PulseLine accent="teal" /></div>
          <div style={{ marginTop: 48 }}>
            <ProcessFlow steps={steps} />
          </div>
        </Section>

        {/* FAQ */}
        <Section background="cream">
          <FaqSplit
            eyebrow={"Common Questions"}
            heading={"Questions About Specialist Training"}
            intro={"If your question is not covered here, just ask — I would always rather you did."}
            accent="rose"
            cta={bookCta}
            items={faqs}
          />
        </Section>

        <CTABand
          layout="split"
          image="/images/studio-1.jpg"
          imageAlt="Esther standing at the kettlebell shelves in the private Worthing studio with her hands resting on the bells, smiling towards the camera, the mirror and whiteboard behind her and the adjustable bench in the foreground."
          heading={"Ready to find out if this is right for you?"}
          body={"The first conversation is free, with no commitment. I work with a small number of clients at a time \u2014 so every person gets my full attention."}
          primaryCta={{ label: "Book a Free Consultation", href: BOOKINGS_URL }}
          secondaryCta={{ label: "Call: 07517 658 128", href: "tel:07517658128", variant: "ghost-white" }}
          imageDescription={"Esther stands at the kettlebell shelves with both hands resting on bells along the top row, turned back towards the camera and smiling. Some of the bells carry coloured dots. Step platforms are stacked under the shelves, adjustable dumbbells sit on the floor to the left, and plates rest on the floor by her feet. The mirror, the whiteboard and the suspension straps are on the wall behind her, and the adjustable bench stands upright in the foreground on the right."}
        />
      </main>
      <Footer />
    </div>
  );
}
