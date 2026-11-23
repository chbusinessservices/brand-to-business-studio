import { createFileRoute } from "@tanstack/react-router";
import { NextStep, PageShell, pageHead } from "@/components/site/PageShell";
import { About } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  head: () => pageHead("/about", "About", "About CH Business Services, a brand architecture and business systems studio founded by Elias Chouchani."),
  component: () => (
    <PageShell>
      <About />
      <NextStep />
    </PageShell>
  ),
});
