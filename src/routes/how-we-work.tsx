import { createFileRoute } from "@tanstack/react-router";
import { NextStep, PageIntro, PageShell, pageHead } from "@/components/site/PageShell";
import { Faq, HowItWorks, Method } from "@/components/site/Sections";

export const Route = createFileRoute("/how-we-work")({
  head: () => pageHead("/how-we-work", "How We Work", "The CH Trust OS method, the four steps from first inquiry to agreed scope, and answers to common questions."),
  component: () => (
    <PageShell>
      <PageIntro eyebrow="How we work" title="Clear steps, written responsibilities." lead="Every engagement starts with listening and a recommendation. Nothing begins until scope, ownership and price are agreed." />
      <Method />
      <HowItWorks />
      <Faq />
      <NextStep />
    </PageShell>
  ),
});
