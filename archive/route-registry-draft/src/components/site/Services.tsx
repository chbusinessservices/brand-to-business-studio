/**
 * CH Business Services - Services Section
 * 
 * Implements spec Section 4 HOME-05: Offer selection
 * 
 * Requirements from section:
 * - Primary setup card plus narrower website and systems options
 * - Situation, scoped outcome, examples of work, price basis
 * - No "everything included" language
 */

import Link from "next/link";

interface ServicesProps {}

type ServiceOption = {
  title: string;
  description: string;
  situation: string;
  outcome: string;
  link: string;
  scopingNote?: string;
};

const serviceOptions: ServiceOption[] = [
  {
    title: "Cleaning Business Setup",
    description: "Complete inquiry-to-completion journey for Hudson County residential cleaning businesses",
    situation: "You're an owner-led residential cleaning business with existing customers in Hudson County, NJ. Your service definition is clear but needs structure.",
    outcome: "Agreed scope definition, essential website, defined request/estimate communications, responsible handoff system, and accountable support.",
    link: "/services/cleaning-business-setup",
  },
  {
    title: "Websites & Inquiry",
    description: "Bounded website build and working inquiry implementation for owner-led businesses",
    situation: "Your existing website leaves the inquiry path unclear. Visitors read but don't take action.",
    outcome: "Focused page with defined content, tested inquiry path, clear call-to-action, and reliable submission.",
    link: "/services/websites-inquiry",
  },
  {
    title: "Client Journey & Systems",
    description: "One existing handoff workflow improved with defined owners, files, approvals and limited integrations",
    situation: "Your onboarding works but varies by client. Small details are rebuilt from memory each time.",
    outcome: "Improved operational system with documented owners, shared files, approved workflows, and reduced rework.",
    link: "/services/client-journey-systems",
  },
];

export function Services({}: ServicesProps) {
  return (
    <section className="scroll-mt-24 py-16 lg:py-24 border-y border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          Service options for different situations.
        </h2>

        {/* Service Cards Grid */}
        <div className="mt-12 grid gap-y-8 md:grid-cols-3">
          {serviceOptions.map((option, index) => (
            <div 
              key={index} 
              className={`rounded-xl border ${
                option.link === "/services/cleaning-business-setup"
                  ? "border-primary/20 bg-gray-50 dark:bg-gray-900/30" 
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/30"
              } p-6 shadow-sm transition-all hover:shadow-md`}
            >
              <h3 className="text-lg font-semibold text-primary-secondary">
                {option.title}
              </h3>

              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {option.description}
              </p>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {option.situation}
              </p>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                {option.outcome}
              </p>

              {option.scopingNote && (
                <div className="mt-3 rounded-lg bg-primary/5 p-3">
                  <p className="text-xs text-primary-dark font-medium">
                    Note: {option.scopingNote}
                  </p>
                </div>
              )}

              <Link 
                href={option.link}
                className="mt-4 inline-flex items-center gap-x-2 rounded-lg bg-primary px-3 py-2 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* No "everything included" - spec HOME-05 */}
        <div className="mt-8 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary-secondary">
            Each option is scoped and separate.
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No blanket "fully automated" promises. Custom scope receives honest quote basis with defined steps to obtain reliable pricing.
          </p>
        </div>

        {/* CTA - spec HOME-05 */}
        <div className="mt-8 text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200 sm:mx-auto max-w-fit"
          >
            Which one fits your situation? <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Services;
