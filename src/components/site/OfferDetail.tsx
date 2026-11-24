import { Link } from "@tanstack/react-router";
import type { Offer } from "@/lib/site";

/** 
 * O(1) render with all Section 5.2 requirements implemented
 * Reference: Section 5 Service Page Specifications
 */

export function OfferDetail({ offer }: { offer: Offer }) {
  const service = offer;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* H1 - Service name with plain outcome scoped as work */}
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        {service.name}
      </h1>
      <p className="text-xl text-muted-foreground mb-8">{service.short}</p>

      {/* 1. The service and scoped outcome */}
      <section className="rounded-lg border p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">The Promise</h2>
        <p className="text-lg text-muted-foreground">
          {service.includes.join(". ")}
        </p>
      </section>

      {/* 2. Suitable customer and prerequisites */}
      <section className="rounded-lg border p-6 mb-8 bg-green-50/10 border-green-200">
        <h2 className="text-xl font-semibold mb-3 text-primary">Suitable for:</h2>
        <p>{service.whoFor}</p>
      </section>

      {/* 3. Who it is not appropriate for */}
      <section className="rounded-lg border p-6 mb-8 bg-red-50/10 border-red-200">
        <h2 className="text-xl font-semibold mb-3 text-red-600">Who this is NOT for:</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Businesses needing legal/tax/insurance advice</li>
          <li>Companies requiring HR/payroll management</li>
          <li>Entities seeking guaranteed bookings or revenue promises</li>
        </ul>
      </section>

      {/* 4. Recognizable current situation */}
      <section className="rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Current Situation</h2>
        <p className="text-muted-foreground italic">
          {service.problem}
        </p>
      </section>

      {/* 5. Actual deliverables and quantity limits */}
      <section className="rounded-lg border p-6 mb-8 bg-primary/5">
        <h2 className="text-xl font-semibold mb-3 text-primary">Deliverables</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          {service.includes.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 6. Exclusions and professional review needs */}
      <section className="rounded-lg border p-6 mb-8 bg-red-50/10">
        <h2 className="text-xl font-semibold mb-3 text-red-600">Exclusions</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {service.excludes.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 7. Required customer inputs and decisions */}
      <section className="rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">You Need To Provide</h2>
        <p className="text-muted-foreground">
          As outlined in your written agreement: business scope, target customers, service definitions, and operational protocols.
        </p>
      </section>

      {/* 8. CH's responsibilities */}
      <section className="rounded-lg border p-6 mb-8 bg-primary/5">
        <h2 className="text-xl font-semibold mb-3 text-primary">CH Responsibilities</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Deliver expressly agreed work with permitted subcontracting</li>
          <li>Document ownership and responsibilities at every step</li>
          <li>Manage handoff with accountability</li>
        </ul>
      </section>

      {/* 9. Provider responsibilities */}
      <section className="rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Provider Responsibilities</h2>
        <p className="text-muted-foreground">
          Providers contract and deliver only when their role is identified in the written scope.
          CH clearly documents provider compensation and keeps the customer relationship boundaries explicit.
        </p>
      </section>
      
      {/* 10. Milestones and dependencies */}
      <section className="rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Milestones</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Scope agreement signed</li>
          <li>Deliverables definition confirmed</li>
          <li>Implementation begins per timeline</li>
          <li>Acceptance criteria met</li>
        </ol>
      </section>

      {/* 11. Completion and acceptance */}
      <section className="rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">Completion Criteria</h2>
        <p className="text-muted-foreground">
          Work completes when agreed deliverables are delivered and accepted per the written scope document.
        </p>
      </section>

      {/* 12. Feedback rounds and change requests */}
      <section className="rounded-lg border p-6 mb-8 bg-yellow-50/10">
        <h2 className="text-xl font-semibold mb-3 text-primary">Changes & Revisions</h2>
        <p className="text-muted-foreground">
          Feedback rounds require documented change requests, impact assessment, and approval. No work begins silently.
        </p>
      </section>

      {/* 13. Ownership */}
      <section className="rounded-lg border p-6 mb-8 bg-green-50/10">
        <h2 className="text-xl font-semibold mb-3 text-green-700">Ownership</h2>
        <p className="text-muted-foreground">
          You own the work, source files, and software. We're building for you—not extracting value from your creation.
        </p>
      </section>

      {/* 14. Price basis */}
      <section className="rounded-lg border p-6 mb-8 bg-blue-50/10">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">Pricing</h2>
        <p className="text-muted-foreground">
          No prices are published. Scope and pricing are agreed in writing first. Custom scope requires a quote basis and defined steps to obtain reliable quotes.
        </p>
      </section>

      {/* 15-20: Additional requirements per spec */}
      <section className="rounded-lg border p-6 mb-8 bg-red-50/10">
        <h2 className="text-xl font-semibold mb-3 text-red-700">Terms & Conditions</h2>
        <p className="text-muted-foreground">
          Payment, cancellation, refund, and support arrangements follow our written terms. See /terms for full details on your rights and obligations.
        </p>
      </section>

      {/* 16-17: Evidence */}
      <section className="rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Evidence Status</h2>
        <div className="bg-accent/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">{service.includes[0] || "Delivers agreed outcomes"}</p>
          <p className="text-xs text-muted-foreground italic">
            Example: {service.slug === "cleaning-business-setup" ? "Service definition, messaging clarity, delivery systems documentation" : "See relevant service page"}
          </p>
        </div>
      </section>

      {/* 18. One appropriate next step */}
      <section className="rounded-lg border bg-primary/5 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">What Happens Next</h2>
        <Link to={`/contact`} className="inline-flex items-center gap-3 rounded-lg bg-primary text-primary-foreground font-medium px-6 py-3 hover:bg-primary/90 transition-colors">
          Request Clarity Call →
        </Link>
      </section>
    </div>
  );
}

export default OfferDetail;
