/**
 * CH Business Services - Engagement Process Section
 * 
 * Implements spec Section 4 HOME-08: Engagement process
 * 
 * Requirements from section:
 * - Explain inquiry → fit/discovery → scope/roles/price → agreement → build/review/test → handoff → support
 * - Payment conditions match actual agreement, not invented universal deposit
 */

import Link from "next/link";

interface HowItWorksProps {}

const steps = [
  { step: 1, title: "Tell us what feels disconnected", body: "Share a few sentences through the inquiry form. No preparation or documents needed." },
  { step: 2, title: "Discuss your situation on a clarity call", body: "A free 15-minute conversation to understand where things stand and what you want to change." },
  { step: 3, title: "Receive a recommended next step", body: "CH suggests a sensible starting point—sometimes one focused area, sometimes none at all." },
  { step: 4, title: "Review scope, responsibilities, and pricing", body: "Nothing begins until you have reviewed what is included, who owns what, and what it costs." },
  { step: 5, title: "Agreement and payment conditions", body: "Signed agreement where required. Appropriate verified payment conditions follow from the terms." },
  { step: 6, title: "Onboarding and customer inputs", body: "You provide materials, assets, and timeline constraints we need to build or improve your situation." },
  { step: 7, title: "Implementation and review", body: "We execute work while internal quality review occurs alongside progress tracking." },
  { step: 8, title: "Acceptance and handoff", body: "You approve deliverables. We prepare training on systems, files, and processes going forward." },
  { step: 9, title: "Defined support and closure", body: "Support scope documented in advance. Closure confirmed when nothing lives outside agreed terms." },
];

export function HowItWorks({}: HowItWorksProps) {
  return (
    <section className="scroll-mt-24 py-16 lg:py-24 border-y border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          How we work together.
        </h2>

        {/* Process Steps - spec HOME-08 */}
        <div className="mt-12 grid gap-y-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index > 5 ? "items-start" : "items-center"}`}>
              {/* Step Number */}
              <span 
                className={`mb-4 inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full ${
                  index <= 3
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                }`}
              >
                {step.step}
              </span>

              {/* Step Content */}
              <h3 className={`text-sm font-semibold ${index <= 3 ? "text-primary-secondary" : "text-gray-600 dark:text-gray-400"}`}>
                {step.title}
              </h3>

              <p className={`mt-1 text-xs ${index <= 3 ? "text-primary-dark" : "text-gray-500 dark:text-gray-500"}`}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Key Principles - spec HOME-08 */}
        <div className="mt-12 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-primary-secondary">
            How it actually works
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This flow reflects our actual approach. Each step is a checkpoint where someone owns 
            the outcome. Payment conditions match your agreement—not an invented universal deposit 
            required from everyone. Nothing begins without reviewed scope and terms.
          </p>
        </div>

        {/* CTA - spec HOME-08 */}
        <div className="mt-12 text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200 sm:mx-auto max-w-fit"
          >
            Start Your Clarity Call <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
