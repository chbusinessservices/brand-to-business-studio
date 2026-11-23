/**
 * CH Business Services - Statement Section
 * 
 * Implements spec Section 4 HOME-03: Visual / Illustrative journey
 * 
 * Requirements from section:
 * - Show a real approved artifact or labeled illustrative journey
 * - Demonstrate: promise → next action → owner → completion
 * - Do NOT show fake analytics or imply sample is implemented system
 */

import Link from "next/link";
import { SITE } from "@/lib/site";

interface StatementProps {}

export function Statement({}: StatementProps) {
  return (
    <section className="scroll-mt-24 py-16 lg:py-24 border-y border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Illustrative Journey - spec HOME-03 */}
        <div className="flex flex-col gap-y-12">
          {/* Step 1: Promise (Spec) */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-secondary">
              Your promise needs clarity.
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              You know what you offer, but explaining it takes long conversations. Visitors read your page but don't take action because the next step isn't clear.
            </p>
          </div>

          {/* Step 2: Next Action */}
          <div className="rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-secondary">
              The gap between interest and action.
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              People leave without committing because uncertainty prevents decision. Your system needs someone to bridge that gap—someone accountable, not just another email inbox.
            </p>
          </div>

          {/* Step 3: Owner */}
          <div className="rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-secondary">
              CH takes ownership of the system.
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              We define what you offer clearly, build inquiry systems that actually work, and organize delivery so nothing lives only in memory. One accountable process from discovery through handoff.
            </p>
          </div>

          {/* Step 4: Completion */}
          <div className="rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-secondary">
              Your business delivers consistently.
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              When the system is clear, your team can focus on execution rather than building systems from scratch with each new client. You get structure without complexity.
            </p>
          </div>
        </div>

        {/* Call to Action - spec HOME-03 */}
        <div className="mt-12 text-center">
          <Link 
            href="/business-backup-check" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
          >
            See if You Need This Work <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Statement;
