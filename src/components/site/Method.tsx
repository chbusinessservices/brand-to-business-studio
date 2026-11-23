/**
 * CH Business Services - Method Section
 * 
 * Implements spec Section 4 HOME-06: Promise-to-delivery example
 * 
 * Requirements from section:
 * - Visible trigger, input, accountable role, due-date rule, escalation and acceptance
 * - Persistent sample label explaining what it does NOT prove
 */

import Link from "next/link";

interface MethodProps {}

function formatProblemText(text: string): string {
  return text.replace(/\*/g, " ").replace(/</g, "<").replace(/>/g, ">");
}

export function Method({}: MethodProps) {
  return (
    <section className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Visible Trigger - spec HOME-06 */}
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary-secondary">
            A promise-to-delivery example.
          </h2>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            We build the system so when you say yes, someone takes responsibility immediately.
            The sample below shows what happens: trigger → accountable person → due date → escalation path.
          </p>
        </div>

        {/* Input Example */}
        <div className="mt-8 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary-secondary">
            From trigger to accountability.
          </h2>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            A visitor lands on your site and finds clarity in the work you offer. They see the promise, 
            understand the scope, and recognize this isn't something they should handle alone.
            CH's system ensures they're connected to someone who can act—not just a form submission.
          </p>
        </div>

        {/* Accountable Role */}
        <div className="mt-8 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary-secondary">
            Who owns the next step?
          </h2>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            Every inquiry becomes a task with an owner, not just another message in a system.
            We track what's received, when we've contacted, scheduled the call, and confirmed details.
            Nothing lives in memory—only documented progress toward resolution.
          </p>
        </div>

        {/* Due Date Rule */}
        <div className="mt-8 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary-secondary">
            The rule we follow.
          </h2>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            Received inquiries go through triage within 4 hours. Contacted calls happen within 
            24 hours. Scheduled appointments are confirmed with written details and clear expectations.
            Escalation to review occurs if something goes quiet beyond the agreed timeline.
          </p>
        </div>

        {/* Persistent Sample Label - spec HOME-06 */}
        <div className="mt-8 rounded-lg bg-primary/5 p-4">
          <label className="text-xs font-medium text-primary-dark flex items-center gap-x-2">
            ⚠️ This is a sample, not customer permission.
            <span aria-hidden="true">⚠️</span>
          </label>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            This example demonstrates our process structure. Actual implementation depends on your specific situation, 
            approved capacity, and operational review. Nothing here claims guaranteed outcome or revenue.
          </p>
        </div>

        {/* CTA - spec HOME-06 */}
        <div className="mt-12 text-center">
          <Link 
            href="/business-backup-check" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200 sm:mx-auto max-w-fit"
          >
            See if You Need This Work <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Method;
