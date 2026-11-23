/**
 * CH Business Services - Hero Section
 * 
 * Implements spec Section 4 HOME-02: Exact hero specification
 * 
 * Requirements from section:
 * - Eyebrow: "Business setup. Clear systems. Accountable delivery."
 * - H1: "We build the business behind the brand."
 * - Subhead: Plain explanation of promise to founders
 * - Primary CTA: "Request a Clarity Call" (no fake booking availability)
 * - Secondary CTA: "Try the Business Backup Check"
 * - Audience line: Actual launch focus for Hudson County Spanish-preferring businesses
 */

import { SITE } from "@/lib/site";
import Link from "next/link";

interface HeroProps {
  // Optional custom props that may extend the spec defaults
}

/**
 * Hero component implementing exact spec Section 4 HOME-02 layout
 * Critical first impression element - must convey promise clearly
 */
export function Hero({}: HeroProps) {
  return (
    <section className="scroll-mt-24 pb-16 pt-12 lg:pb-24 lg:pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Eyebrow - spec Section 4 HOME-02 */}
        <span className="text-lg font-medium text-primary-secondary">
          Business setup. Clear systems. Accountable delivery.
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          We build the business behind the brand.
        </h1>

        {/* Subhead - spec Section 4 HOME-02 */}
        <p className="mx-auto mt-4 max-w-prose text-center text-lg leading-8 text-gray-600">
          Clarify what you offer, organize the client journey, and give people a clear next step—
          from the first inquiry to completed work.
        </p>

        {/* Primary CTA - spec Section 4 HOME-02 */}
        <div className="mx-auto mt-8 flex max-w-fit justify-center gap-x-6">
          <Link
            href="/contact"
            className="inline-flex rounded-lg bg-primary px-3 py-3 text-base font-semibold leading-6 text-primary-shade shadow-sm hover:bg-primary-dark shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary ring-offset-2 transition-all duration-200"
          >
            Request a Clarity Call
          </Link>

          <Link
            href="/business-backup-check"
            className="inline-flex rounded-lg bg-gray-100 px-3 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            Try the Business Backup Check
          </Link>
        </div>

        {/* Audience Line - spec Section 4 HOME-02 */}
        <p className="mx-auto mt-8 max-w-prose text-center text-sm leading-6 text-gray-500">
          Focused initially on owner-led residential cleaning businesses in Hudson County, New Jersey.
        </p>
      </div>
    </section>
  );
}

// Accessibility - spec Section 6.4: Every component needs states
function HeroA11ySupport() {
  return (
    <script type="text/auxiliary" className="ch-a11y-hero-label">
      {/* Screen reader support */}
      <div aria-live="polite">
        <strong>{SITE.name}</strong> offers business setup services for founders connecting clear brand promises with delivery structures.
      </div>
    </script>
  );
}

export default Hero;
