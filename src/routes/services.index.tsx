import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE, EVIDENCE_LABELS } from "@/lib/site";
import {
  IndexHeader,
  ServicesList,
  ServiceDetailSummary,
  ProblemsList,
} from "@/components/site/Sections";

/** 
 * /services - Service index following Section 5.1 spec
 */
export const Route = createFileRoute("/services")({
  head: () => ({
    title: `${SITE.name} — Services`,
    description: `Discover how ${SITE.name} helps you build the business behind your brand`,
    children: {
      "og:title": `${SITE.name} — We build the business behind the brand.`,
      "og:description": `Brand architecture and business systems for service-business founders.`,
      "og:type": "website",
    },
  }),
  component: ServicesIndexPage,
});

/** 
 * /services - Full index page implementation
 */
function ServicesIndexPage() {
  const services = SITE.OFFERS;
  const pillars = SITE.PILLARS;
  
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* H1 for index */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Services</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Choose the relevant scoped offer. Our work is precise, not generalist.
          </p>
        </section>

        {/* Recognizable problem selector */}
        <section className="mb-12 border-y border-border/50 py-8">
          <h2 className="text-2xl font-semibold mb-4">Which situation is this?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Not all our work fits every business. Choose what matches your actual problem:
          </p>
        </section>

        {/* Three approved offers grid */}
        <div className="grid md:grid-cols-[240px_1fr] gap-6 items-start">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`/${service.slug}`}
              className="group rounded-xl border bg-card hover:bg-accent transition-colors"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:underline">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{service.short}</p>
                
                {/* Who For */}
                <div className="bg-primary/5 rounded-lg p-4 mb-3">
                  <p className="text-sm text-primary font-medium mb-1">Suitable for:</p>
                  <p className="text-sm text-primary">{service.whoFor}</p>
                </div>

                {/* Problem */}
                <p className="text-muted-foreground mb-3 italic">
                  {service.problem}
                </p>

                {/* Includes */}
                <div className="bg-muted/5 rounded-lg p-4 mb-3">
                  <p className="font-semibold mb-2 text-primary">Includes</p>
                  <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                    {service.includes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Excludes */}
                <div className="bg-red-50/10 border border-red-200 rounded-lg p-4 mb-3">
                  <p className="font-semibold text-red-600 mb-2">Exclusions</p>
                  <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                    {service.excludes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Pillars */}
                <div className="flex gap-2 mb-4">
                  {service.pillars.map((pillarKey) => {
                    const pillar = pillars.find(p => p.key === pillarKey);
                    return pillar ? (
                      <span key={pillarKey} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {pillar.title}
                      </span>
                    ) : null;
                  })}
                </div>

                {/* Evidence label */}
                <div className="bg-accent/30 border rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">What this delivers</p>
                  <p className="text-muted-foreground text-sm italic">
                    {service.includes[0] || "Delivers agreed outcomes"}
                  </p>
                </div>

                {/* Next step */}
                <a
                  href={`/services/${service.slug}`}
                  className="mt-4 block rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 px-6 py-3 text-center"
                >
                  Explore this service →
                </a>
              </div>
            </a>
          ))}
        </div>

        {/* Method summary */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-4">How we work</h2>
          <p className="text-lg text-muted-foreground mb-6">
            We don't guess. We define scope, responsibilities, and handoffs before starting work.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Clarity first</h3>
              <p className="text-muted-foreground">
                We identify what you're doing, who it's for, and what happens next before a single line of code or document is written.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ownership at every step</h3>
              <p className="text-muted-foreground">
                From your first message to handoff and support, we ensure accountability—not just notes.
              </p>
            </div>
          </div>
        </section>

        {/* Engagement responsibility comparison */}
        <section className="my-12 border-y border-border/50 py-8">
          <h3 className="text-xl font-semibold mb-4">Engagement models</h3>
          <p className="text-lg text-muted-foreground mb-6">
            CH operates three commercial routes depending on who contracts and what we deliver:
          </p>
          
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-primary/5">
              <h4 className="font-semibold mb-2 text-primary">CH implementation</h4>
              <p className="text-muted-foreground">
                CH contracts for the stated work and owns its obligations, including authorized subcontracting.
              </p>
            </div>
            <div className="rounded-lg border p-4 bg-primary/5">
              <h4 className="font-semibold mb-2 text-primary">Provider-direct service</h4>
              <p className="text-muted-foreground">
                Identified provider contracts and delivers; CH's role is sales/matching with approved compensation.
              </p>
            </div>
            <div className="rounded-lg border p-4 bg-primary/5">
              <h4 className="font-semibold mb-2 text-primary">Introduction</h4>
              <p className="text-muted-foreground">
                Customer consents to connection; provider determines suitability and forms its own relationship.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-6 italic">
            The route from your offer determines terms, disclosures, checkout, refund/support responsibility, and reporting. Never infer the route from a button label or default commission percentage.
          </p>
        </section>

        {/* Price basis */}
        <section className="my-8 rounded-lg border bg-primary/5 p-6">
          <h3 className="font-semibold mb-2">Pricing and quotes</h3>
          <p className="text-muted-foreground mb-4">
            No prices are published. Scope and pricing are agreed in writing first.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Custom scope receives a quote basis and a defined step to obtain a reliable quote.
          </p>
        </section>

        {/* Relevant evidence section */}
        <section className="my-8 border-y border-border/50 py-8">
          <h3 className="font-semibold mb-4">What we do (and don't) do</h3>
          
          {/* Exclusions summary from all services */}
          {() => null}
        </section>

        {/* FAQ section embedded here */}
      </main>
      <Footer />
    </>
  );
}
