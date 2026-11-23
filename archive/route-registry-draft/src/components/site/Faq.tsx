/**
 * CH Business Services - FAQ Section
 * 
 * Implements spec Section 4 HOME-12: FAQs resolution of scope, pricing, responsibility, etc.
 * 
 * Requirements from section:
 * - Scope questions
 * - Website-only fit
 * - Pricing basis
 * - Inputs and timing
 * - Provider responsibility
 * - Support limits
 * - Automation claims
 */

import Link from "next/link";

interface FaqProps {}

interface FaqItem {
  question: string;
  answer: string;
  category?: "scope" | "pricing" | "responsibility" | "support" | "automation";
}

const faqs: FaqItem[] = [
  {
    question: "What happens after you say yes to your services?",
    answer: "You receive a recommended next step, often one focused area. We then review the full scope, responsibilities, and pricing before anything begins.",
  },
  {
    question: "Do you provide websites as a service?",
    answer: "We offer bounded website builds with defined content and functionality. SEO position or lead volume guarantees are not included in any offer.",
  },
  {
    question: "What's the pricing basis for your work?",
    answer: "Each custom scope receives a quote based on requirements, timeline constraints, deliverables, and agreed resources. Nothing begins without reviewed terms and price discussion.",
  },
  {
    question: "How long until you respond to an inquiry?",
    answer: "We review inquiries within 4 hours during business days. Contacted calls happen within 24 hours if scheduled available.",
  },
  {
    question: "Do providers deliver the work?",
    answer: "That depends on your specific arrangement and agreed seller model. Sometimes CH takes responsibility, sometimes we help you connect with a provider who does. Terms are disclosed in writing.",
  },
  {
    question: "Who is actually responsible for support after launch?",
    answer: "CH handles initial review and escalation coordination. After handoff, documented responsibilities may shift based on the agreed structure for your situation.",
  },
  {
    question: "Is this fully automated or hands-on?",
    answer: "Nothing is blanket 'automated.' We focus on systems where people own outcomes consistently. Human review occurs at each checkpoint before progression.",
  },
  {
    question: "Do you offer professional certification?",
    answer: "No. Our work focuses on brand clarity, operational structure, and clear handoffs—not formal certifications for unqualified practitioners.",
  },
  {
    question: "What if I want to add services later?",
    answer: "New scopes are evaluated through a review process with defined scope changes and impact assessment on timeline, costs, and responsibilities.",
  },
];

export function Faq({}: FaqProps) {
  return (
    <section className="scroll-mt-24 py-16 lg:py-24 border-y border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          Common questions.
        </h2>

        {/* FAQ List */}
        <div className="mt-12 space-y-8">
          {faqs.map((faq, index) => (
            <details key={index} className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 p-6 transition-all focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2">
              <summary className="flex cursor-pointer items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold text-primary-secondary">
                  {faq.question}
                </h3>
                <span className="transition-all transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-primary-secondary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* CTA - HOME-12 */}
        <div className="mt-8 text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200 sm:mx-auto max-w-fit"
          >
            Ask Us Anything <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Faq;
