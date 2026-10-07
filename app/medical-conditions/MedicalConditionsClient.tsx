"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BOOKINGS_URL } from "@/lib/booking";
import {
  Section,
  SectionHeading,
  PageHero,
  FeatureBand,
  StatBadge,
  CTABand,
  Callout,
  Reveal,
  CtaButton,
  FaqSplit,
} from "@/components/ds";
import { IconRibbon } from "@/components/icons";


export default function MedicalConditionsClient() {
  const howIWork = [
    { title: "Screened properly", body: "Before we start, I screen you properly, and I\u2019m always happy to check in with your GP or consultant. If you need medical clearance, we get it documented, so we\u2019re both working from something clear rather than a passing \u201Cit should be fine\u201D." },
    { title: "Three questions I ask", body: "I ask what you\u2019ve been told to avoid, what a bad day looks like for you, and what you\u2019ve already tried. It\u2019s surprising how often someone is still carrying a restriction that expired months ago." },
    { title: "A pause, not a ban", body: "If something is acute or unstable, exercise may need to stop for a while. That\u2019s usually a pause, not a permanent ban. Once things settle, we work out how, and how much." },
  ];

  const firstSession = [
    { title: "A proper baseline", body: "A gentle check of where you are today: how you move, how strong you are, and any limits. It\u2019s a starting point, never a test, and it\u2019s not about finding out what breaks you." },
    { title: "Leave feeling capable", body: "You should leave your first session feeling capable, not exhausted. Leaving wiped out would only confirm what you were afraid of, so that\u2019s not what we aim for." },
    { title: "Adapted on the day, quietly", body: "Your plan adapts to how you feel that day, without a fuss, and without turning every change into a conversation about your condition." },
    { title: "No \u201Ceasier option\u201D", body: "Changing an exercise so you can do it well isn\u2019t falling short of anyone. It\u2019s the smarter way to get more from it, and in a private studio there\u2019s no one to compare yourself with." },
  ];

  const progress = [
    { title: "Sleeping better", body: "Often the first change people notice, well before anything else shifts." },
    { title: "More energy, less pain", body: "The everyday wins that make the rest of life easier." },
    { title: "Trust in your own body", body: "Rebuilt one session at a time, at a pace you can manage." },
  ];

  const faqs = [
    { title: "Do I need my GP\u2019s permission first?", body: "It depends on your condition and where you are with it. I screen everyone before we start, and if medical clearance is needed we get it documented. I\u2019m always happy to check in with your GP or consultant." },
    { title: "What if I have a bad day?", body: "Then the session adapts. Every session starts with a check-in, and I change the plan to match how you feel that day. Telling me it\u2019s a bad day doesn\u2019t mean being told you can\u2019t train." },
    { title: "What if you\u2019re not the right trainer for me?", body: "Then I\u2019ll tell you, and help you find who is. Sometimes that means splitting your programme with another specialist so you get the right expertise for each part." },
    { title: "I\u2019m not a \u201Cgym person\u201D. Is this for me?", body: "Very often, yes. Many of the people I work with never saw themselves as gym people. Sessions are one-to-one in a private studio in Worthing: no busy gym floors, no one watching." },
  ];

  const bookCta = { label: "Book a Free Consultation", href: BOOKINGS_URL, arrow: true };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main-content">
      <PageHero
        image="/images/consultation-standing-chat-mats.jpg"
        imageAlt="Esther standing on the blue mats in the private Worthing studio with a pen and a sheet of notes, smiling as she talks with a client at the start of a session."
        imageObjectPosition="81% 40%"
        imageObjectPositionWide="50% 40%"
        imageDescription={"A first conversation in the studio. Esther stands on the blue mats holding a pen and a sheet of notes, smiling towards a client who has her back to the camera. Nobody is lifting anything yet \u2014 talking comes first. Foam rollers and blocks hang in fixed places on the wall behind her, resistance bands are racked by the door, and the mats are clear."}
        eyebrow={"Training With a Medical Condition"}
        heading={<>{"Training That Adapts"}<br />{"to Your Health"}</>}
        subhead={"Private, one-to-one personal training in Worthing for people living with a medical condition. Screened properly, paced to you, and adapted to how your body actually feels today. No busy gym floors. No one watching."}
        primaryCta={bookCta}
        secondaryCta={{ label: "How I Work", href: "#how-i-work", variant: "ghost-white" }}
        badge={<StatBadge variant="rose" value="L4" label={"Cancer & Exercise Rehabilitation"} />}
      />

      {/* WHY IT STALLS */}
      <Section background="white">
        <div className="ds-split">
          <div>
            <SectionHeading
              eyebrow={"Where You Might Be"}
              eyebrowColor="teal"
              heading={"Nobody said no. But nobody said yes either."}
            />
            <Reveal y={24}>
              <p className="ds-body" style={{ marginTop: 20, marginBottom: 16 }}>
                {"Living with a medical condition doesn\u2019t mean you have to stop being active. But the fear of doing harm \u2014 yours, and your family\u2019s \u2014 tends to linger, and \u201Crest is best\u201D is an easy thing to believe when you\u2019re frightened."}
              </p>
              <p className="ds-body" style={{ marginBottom: 16 }}>
                {"Doctors are understandably careful about advising the wrong thing, so exercise often never comes up. When nobody recommends it, it\u2019s natural to assume it isn\u2019t for you."}
              </p>
              <p className="ds-body" style={{ marginBottom: 28 }}>
                {"And when your body feels like it has let you down, asking more of it is frightening. That isn\u2019t a lack of motivation, and a training plan alone won\u2019t fix it. It takes time, and someone who will go at a pace you can actually manage."}
              </p>
              <Callout
                icon={IconRibbon}
                accent="rose"
                title={"Qualified beyond standard personal training"}
                body={"I\u2019m qualified in GP Exercise Referral and hold the Level 4 Cancer and Exercise Rehabilitation qualification (CanRehab). In practice, it means I can work safely with complex, stable conditions, and adapt as your health changes."}
              />
              <div style={{ marginTop: 28 }}>
                <CtaButton cta={bookCta} />
              </div>
            </Reveal>
          </div>
          <figure className="ef-figure">
            <Reveal y={40} className="ds-split-img">
              <Image
                src="/images/active-ageing-rapport-laughing.jpg"
                alt="Esther laughing with an older client between exercises in the private Worthing studio, one hand at his arm, in front of the kettlebell shelves."
                fill
                sizes="(max-width: 1000px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "41% 50%" }}
              />
            </Reveal>
            <details className="ef-desc">
              <summary>Describe this image</summary>
              <p>Esther and an older client stand close together between exercises, both laughing. She has a hand at his arm, checking a position rather than holding him up, and he stands relaxed and upright. Behind them the kettlebells sit on their shelves in weight order, the suspension straps hang from the ceiling, and the whiteboard is on the far wall. The floor around them is clear.</p>
            </details>
          </figure>
        </div>
      </Section>

      {/* HOW I WORK */}
      <Section background="cream">
        <div id="how-i-work">
          <SectionHeading eyebrow={"How I Work"} heading={"Safe First, Then Confident"} />
        </div>
        <Reveal y={40} start="top 80%" style={{ marginTop: 40 }}>
          <FeatureBand
            accent="rose"
            items={howIWork.map((s) => ({ title: s.title, body: s.body }))}
          />
        </Reveal>
      </Section>

      {/* YOUR FIRST SESSION */}
      <Section background="white">
        <div className="ds-split">
          <div>
            <SectionHeading eyebrow={"Your First Session"} eyebrowColor="teal" heading={"A Starting Point, Not a Test"} />
            <div className="ds-featlist">
              {firstSession.map((c) => (
                <div key={c.title} className="ds-feat">
                  <span className="ds-feat-dot" />
                  <div>
                    <div className="ds-feat-t">{c.title}</div>
                    <div className="ds-feat-c">{c.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <figure className="ef-figure">
            <Reveal y={40} className="ds-split-img">
              <Image src="/images/active-ageing-hand-position-cue.jpg" alt="Esther guiding an older client’s hand and wrist into position in the private Worthing studio, looking down at his grip as she sets it up." fill sizes="(max-width: 1000px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "61% 50%" }} />
            </Reveal>
            <details className="ef-desc">
              <summary>Describe this image</summary>
              <p>Esther stands beside an older client and gently guides his hand and wrist into position, her eyes on his grip rather than on him. He holds his arm out and lets her adjust it. A 10kg kettlebell and a lighter one sit on the low rack behind them, and a padded bench and a step are stored along the far wall, so the space they are working in is clear.</p>
            </details>
          </figure>
        </div>
      </Section>

      {/* QUOTE */}
      <Section background="cream">
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Callout
            icon={IconRibbon}
            accent="teal"
            title={"If something isn\u2019t a big deal to me, it becomes less of a big deal to you."}
            body={"Most people I work with have spent months being met with concern. Being met with something closer to normal is a relief, and it hands the say in what you\u2019re capable of back to you."}
          />
        </div>
      </Section>

      {/* WHAT PROGRESS LOOKS LIKE */}
      <Section background="white">
        <SectionHeading eyebrow={"What Progress Looks Like"} heading={"Maintenance Is the Achievement"} />
        <p className="ds-body" style={{ maxWidth: 640, margin: "0 auto 40px", textAlign: "center" }}>
          {"With a health condition there\u2019s no \u201Cafter\u201D photo, and I don\u2019t work that way anyway. If yours is progressive or fluctuating, holding steady is a real achievement. Sometimes the win is that the line didn\u2019t go down."}
        </p>
        <Reveal y={40} start="top 80%">
          <FeatureBand
            accent="teal"
            items={progress.map((s) => ({ title: s.title, body: s.body }))}
          />
        </Reveal>
      </Section>

      {/* HONEST ABOUT SCOPE */}
      <Section background="cream">
        <SectionHeading eyebrow={"Being Honest With You"} eyebrowColor="teal" heading={"If I\u2019m Not the Right Person, I\u2019ll Tell You Who Is"} />
        <Reveal y={24}>
          <p className="ds-body" style={{ maxWidth: 640, margin: "0 auto 16px", textAlign: "center" }}>
            {"My qualifications let me work with complex, stable conditions. They don\u2019t cover training someone through acute instability. If what you need is outside what I can safely do, I\u2019ll say so. It\u2019s a redirection, not a rejection: \u201CI\u2019m not the right person for this, and here\u2019s who is.\u201D"}
          </p>
          <p className="ds-body" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            {"It doesn\u2019t always mean handing you over, either. Sometimes a programme works best split between specialists: someone else takes the part that needs their qualification, and I keep mine. You don\u2019t lose a trainer. You gain a team."}
          </p>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section background="white">
        <FaqSplit
          eyebrow={"Common Questions"}
          heading={"Questions You Might Have"}
          intro={"If your question is not covered here, just ask \u2014 I would always rather you did."}
          accent="rose"
          cta={bookCta}
          items={faqs}
        />
      </Section>

      <CTABand
        image="/images/rapport-trainer-and-client-laughing.jpg"
        imageAlt="Esther and a client standing side by side in the private Worthing studio, laughing together beside the rack of exercise balls."
        imagePosition="43% 40%"
        imageDescription={"Esther and a client stand side by side, mid-laugh, turned towards each other. Nobody is training in this moment \u2014 it is the conversation between exercises. Behind them the exercise balls sit on their rack in size order with the medicine balls stacked below, and the window, wall clock and desk are on the back wall. The floor between them is clear."}
        heading={"Your first conversation is free, with no commitment."}
        body={"Tell me what you\u2019ve been told, what you\u2019ve tried, and what a bad day looks like, and we\u2019ll take it from there. I work with a small number of clients at a time, so every person gets my full attention."}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKINGS_URL }}
        secondaryCta={{ label: "Call: 07517 658 128", href: "tel:07517658128", variant: "ghost-white" }}
      />
      </main>
      <Footer />
    </div>
  );
}
