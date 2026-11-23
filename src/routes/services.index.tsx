import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NextStep, PageIntro, PageShell, pageHead } from "@/components/site/PageShell";
import { Services as Pillars } from "@/components/site/Sections";
import { OFFERS } from "@/lib/site";

export const Route = createFileRoute("/services/")({
  head: () =>
    pageHead(
      "/services",
      "Services",
      "Three scoped offers from CH Business Services—Cleaning Business Setup, Websites & Inquiry, and Client Journey & Systems—each agreed in writing before work begins.",
    ),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Services"
        title="Choose one focused piece of work."
        lead="Each offer has a defined scope, written responsibilities and pricing you review before anything begins. You do not need all of them—most work starts with one."
      />
      <section className="border-b">
        <ul className="mx-auto grid max-w-7xl md:grid-cols-3">
          {OFFERS.map((o, i) => (
            <li key={o.slug} className="border-b px-5 py-10 md:border-b-0 md:border-r md:px-8 md:last:border-r-0">
              <p className="eyebrow text-muted-foreground">0{i + 1} · {o.pillars.join(" / ")}</p>
              <h2 className="mt-4 text-2xl font-medium">{o.name}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{o.short}</p>
              <Link
                to={`/services/${o.slug}` as "/services/websites-inquiry"}
                className="link-underline mt-6 inline-flex items-center gap-2 font-medium"
              >
                See scope <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Pillars />
      <NextStep />
    </PageShell>
  );
}
