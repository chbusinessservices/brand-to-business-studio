import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NextStep, PageIntro, PageShell, pageHead } from "@/components/site/PageShell";
import { EVIDENCE_LABELS } from "@/lib/site";

export const Route = createFileRoute("/examples/")({
  head: () => pageHead("/examples", "Examples & Evidence", "How CH labels its examples: illustrative samples, CH internal work, and client evidence published only with permission."),
  component: () => (
    <PageShell>
      <PageIntro eyebrow="Examples & evidence" title="Every example says what it is." lead="We separate samples from real work, so you never mistake an illustration for a client result." />
      <section className="border-b">
        <ul className="mx-auto grid max-w-7xl md:grid-cols-3">
          {EVIDENCE_LABELS.map((e) => (
            <li key={e.label} className="border-b px-5 py-10 md:border-b-0 md:border-r md:px-8 md:last:border-r-0">
              <h2 className="text-xl font-medium">{e.label}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{e.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-10">
          <p className="eyebrow text-muted-foreground">Illustrative sample</p>
          <h2 className="mt-4 text-2xl font-medium">Sample client handoff</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">The format of a handoff document for a fictional cleaning business. Not a real client.</p>
          <Link to="/examples/sample-client-handoff" className="link-underline mt-6 inline-flex items-center gap-2 font-medium">
            View the sample <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="eyebrow mt-14 text-muted-foreground">CH internal work</p>
          <p className="mt-3 max-w-2xl">This website, its inquiry form and its private request log were built by CH for CH.</p>
        </div>
      </section>
      <NextStep />
    </PageShell>
  ),
});
