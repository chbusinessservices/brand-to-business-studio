/**
 * CH Business Services - Problems Section
 * 
 * Implements spec Section 4 HOME-04: Recognize the Gap
 * 
 * Requirements from section:
 * - Three cards covering: before sale, after yes, inside delivery
 * - Describe situations without shaming or claiming every business has them
 */

import Link from "next/link";
import { SERVICE_OPTIONS } from "@/lib/site";

interface ProblemsProps {}

interface ProblemCardProps {
  title: string;
  body: string;
  category: "before_sale" | "after_yes" | "inside_delivery";
  actionLink?: string;
}

function formatProblemText(text: string): string {
  // Handle escaped markdown formatting for display
  return text.replace(/\*/g, " ").replace(/</g, "<").replace(/>/g, ">");
}

export function Problems({}: ProblemsProps) {
  const problems: ProblemCardProps[] = [
    {
      title: "Your offer takes too much explaining.",
      body: "People are interested, but it takes a long conversation before they understand what you do and who it is for.",
      category: "before_sale" as const,
    },
    {
      title: "Your website leaves the next step unclear.",
      body: "Visitors read the page and are not sure whether to call, book, or send a message—so many do nothing.",
      category: "after_yes" as const,
      actionLink: "/contact",
    },
    {
      title: "Onboarding changes from client to client.",
      body: "Each new client gets a slightly different start, and small details are rebuilt from memory every time.",
      category: "inside_delivery" as const,
    },
    {
      title: "Too much depends on you remembering everything.",
      body: "Who owns what, what comes next, and what is still open lives mostly in your head instead of a shared system.",
      category: "inside_delivery" as const,
    },
  ];

  return (
    <section className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          The gaps you recognize.
        </h2>

        {/* Problems Grid - spec HOME-04 */}
        <div className="mt-12 grid gap-y-8 md:grid-cols-3">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className={`group relative rounded-xl border ${
                problem.category === "before_sale" 
                  ? "border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30" 
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/30"
              } p-6 shadow-sm transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-secondary">
                  {problem.title}
                </h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  problem.category === "before_sale"
                    ? "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    : "bg-primary/10 text-primary-dark"
                }`}>
                  {problem.category === "before_sale" 
                    ? "Before Sale" 
                    : problem.category === "after_yes" 
                      ? "After Yes" 
                      : "Inside Delivery"}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {formatProblemText(problem.body)}
              </p>

              {problem.actionLink && (
                <Link 
                  href={problem.actionLink}
                  className="mt-4 inline-flex rounded-lg bg-primary px-3 py-2 text-sm font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
                >
                  Discuss It <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Summary - spec HOME-04 */}
        <div className="mt-8 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary-secondary">
            These patterns we've helped founders resolve.
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Each situation differs, but we focus on building systems where clarity exists before sales, 
            action is clear after interest, and delivery ownership remains constant. No shaming—just recognizing what's needed.
          </p>
        </div>

        {/* CTA - spec HOME-04 */}
        <div className="mt-8 text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200 sm:mx-auto max-w-fit"
          >
            See How We Can Help <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Problems;
