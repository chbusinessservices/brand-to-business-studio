import { Check, Minus } from "lucide-react";
import { NextStep, PageIntro, PageShell } from "./PageShell";
import { PROFESSIONAL_DISCLAIMER, type Offer } from "@/lib/site";

export function OfferDetail({ offer }: { offer: Offer }) {
  return (
    <PageShell>
      <PageIntro eyebrow={`Service · ${offer.pillars.join(" / ")}`} title={offer.name} lead={offer.short} />
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-2">
        <section className="border-b px-5 py-12 md:border-r md:px-10">
          <h2 className="eyebrow text-muted-foreground">Who it is for</h2>
          <p className="mt-4 text-lg leading-relaxed">{offer.whoFor}</p>
        </section>
        <section className="border-b px-5 py-12 md:px-10">
          <h2 className="eyebrow text-muted-foreground">The problem it addresses</h2>
          <p className="mt-4 text-lg leading-relaxed">{offer.problem}</p>
        </section>
        <section className="border-b px-5 py-12 md:border-r md:px-10">
          <h2 className="text-xl font-medium">Typically included</h2>
          <ul className="mt-6 space-y-4">
            {offer.includes.map((x) => (
              <li key={x} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0" aria-hidden />{x}</li>
            ))}
          </ul>
        </section>
        <section className="border-b px-5 py-12 md:px-10">
          <h2 className="text-xl font-medium">Not included</h2>
          <ul className="mt-6 space-y-4 text-muted-foreground">
            {offer.excludes.map((x) => (
              <li key={x} className="flex gap-3"><Minus className="mt-1 h-4 w-4 shrink-0" aria-hidden />{x}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-3 md:px-10">
          <div><h2 className="eyebrow text-muted-foreground">Who you contract with</h2><p className="mt-3">CH Business Services delivers this work directly.</p></div>
          <div><h2 className="eyebrow text-muted-foreground">Pricing</h2><p className="mt-3">Priced by agreed scope. You review scope, responsibilities and price in writing before anything starts.</p></div>
          <div><h2 className="eyebrow text-muted-foreground">Limits</h2><p className="mt-3 text-muted-foreground">{PROFESSIONAL_DISCLAIMER}</p></div>
        </div>
      </section>
      <NextStep title="See whether this fits." />
    </PageShell>
  );
}
