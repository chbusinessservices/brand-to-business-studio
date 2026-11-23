/**
 * CH Business Services - Trust OS Section
 * 
 * Implements spec Section 4 HOME-07: Trust OS explanation
 * 
 * Requirements from section:
 * - Explain CODE, SHIELD, SIGNAL, SYSTEM without forcing four purchases
 * - Not blanket legal protection or mandatory purchases
 */

import Link from "next/link";

interface TrustOSProps {}

const pillars = [
  {
    key: "CODE",
    title: "Brand clarity",
    method: "Define the promise.",
    scope: "Audience, promise, positioning, messaging, voice, and identity.",
    evidence: "Approved positioning documents.",
  },
  {
    key: "SHIELD",
    title: "Responsibilities and review coordination",
    method: "Address the risks.",
    scope: "Clarify ownership, document open issues, and identify items requiring appropriate professional review.",
    evidence: "Responsibility map and review-status record.",
  },
  {
    key: "SIGNAL",
    title: "Websites and market presence",
    method: "Make the value visible.",
    scope: "Explain the promise, supporting proof, process, and next step.",
    evidence: "Agreed website/content outputs and tested inquiry path.",
  },
  {
    key: "SYSTEM",
    title: "Client experience and operations",
    method: "Build the systems to deliver.",
    scope: "Organize onboarding, workflows, SOPs, responsibilities, and delivery tracking.",
    evidence: "Documented workflows and assigned owners.",
  },
];

export function TrustOS({}: TrustOSProps) {
  return (
    <section className="scroll-mt-24 py-16 lg:py-24 border-y border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          Our Trust OS. Four pillars, one system.
        </h2>

        {/* Pillars Grid - spec HOME-07 */}
        <div className="mt-12 grid gap-y-8 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className={`rounded-xl border ${
                index === 3 // SYSTEM is last, more prominent
                  ? "border-primary/30 bg-gray-50 dark:bg-gray-900/40" 
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/30"
              } p-6 shadow-sm`}
            >
              <div className="flex items-center gap-x-3">
                <span className={`text-lg font-semibold ${index === 3 ? "text-primary" : "text-primary-secondary"}`}>
                  {pillar.key}
                </span>
                <h3 className="mt-2 text-sm font-medium text-primary-secondary">{pillar.title}</h3>
              </div>

              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                {pillar.method}
              </p>

              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {pillar.scope}
              </p>

              <div className="mt-3 rounded-lg bg-primary/5 p-2">
                <p className="text-xs font-medium text-primary-dark">
                  • Evidence: {pillar.evidence}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Spec HOME-07 clarification */}
        <div className="mt-8 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-primary-secondary">
            Four pillars, not four purchases.
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We don't force customers into each element individually. The Trust OS organizes the scoped solution 
            around what actually matters for your business setup journey. None of this must be a separate fee 
            unless explicitly agreed in written scope. No blanket legal protection—only documented responsibilities 
            and clear escalation paths when things need review.
          </p>
        </div>

        {/* CTA - spec HOME-07 */}
        <div className="mt-8 text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200 sm:mx-auto max-w-fit"
          >
            How Does This Apply To You? <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TrustOS;
