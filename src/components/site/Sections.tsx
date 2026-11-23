/**
 * CH Business Services - Components Exports
 * 
 * Centralizes all homepage section components per spec Section 4 and Section 6 design requirements.
 * 
 * All sections implement WCAG 2.2 AA accessibility target from spec Section 6.3.
 */

import { SITE } from "@/lib/site";
import Link from "next/link";
import NavLinks, { NAV_LINKS } from "./NavLinks";
import Hero from "./Hero";
import Statement from "./Statement";
import Problems from "./Problems";
import Services from "./Services";
import Method from "./Method";
import HowItWorks from "./HowItWorks";
import TrustOS from "./TrustOS";
import Faq from "./Faq";
import Contact from "./Contact";

interface SectionsProps {}

function formatProblemText(text: string): string {
  return text.replace(/\*/g, " ").replace(/</g, "<").replace(/>/g, ">");
}

export function About({}: SectionsProps) {
  return (
    <section className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          About CH Business Services.
        </h2>

        <div className="mt-10 space-y-6 text-lg leading-8 text-gray-700 dark:text-gray-300">
          <p>
            We help founders connect a clear brand promise with the structure to deliver it—from 
            positioning and websites to organized onboarding, clear responsibilities, and repeatable workflows.
          </p>

          <h3 className="text-xl font-semibold text-primary-secondary mt-6">
            What we do
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>Define brand positioning and messaging clarity</li>
            <li>Build focused websites with working inquiry paths</li>
            <li>Organize client journeys with accountable ownership</li>
            <li>Document workflows where nothing lives in memory</li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-secondary mt-6">
            What we're not
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>We don't provide accreditation, formal certification, or professional licensing</li>
            <li>No guarantees on income, rankings, or outcome metrics</li>
            <li>No blanket "fully automated" promises—we focus on human accountability</li>
          </ul>

          <div className="rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-6">
            <h3 className="text-base font-semibold text-primary-secondary">
              Operating principles
            </h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Truthful scope, responsible handoff, documented decisions, and learning through actual work. 
              Private faith is not an employee qualification—we build systems where accountability exists everywhere.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a href="/about" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200">
            Learn More <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function BusinessBackupCheck({}: SectionsProps) {
  const prompts = [
    "What's the customer's next action?",
    "Who owns what outcome right now?",
    "What triggers the issue, and what inputs matter?",
    "What approved instructions should everyone follow?",
    "What obligations have you assigned?",
    "Is there a draft vs. final distinction we're missing?",
    "Did someone fail to hand off properly?",
    "Who needs to escalate if things go quiet?",
    "What proves agreement and completion?",
    "What evidence shows nothing is left open?"
  ];

  return (
    <section className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          Business Backup Check.
        </h2>

        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Use this as a mirror, not assessment tool. Answer honestly about your current setup 
          and what feels disconnected. No pass/fail score or prediction of risk.
        </p>

        <div className="mt-8 space-y-4">
          {prompts.map((prompt, index) => (
            <label key={index} className={`block p-6 rounded-lg border ${
              index % 2 === 0 
                ? "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700"
                : "bg-primary/5 dark:bg-gray-800/20 border-primary/20"
            } transition-all hover:shadow-md`}>
              <span className="text-sm font-semibold text-primary-secondary">Prompt {index + 1}:</span>
              <p className="mt-2 text-base text-gray-700 dark:text-gray-300">{prompt}</p>
            </label>
          ))}
        </div>

        <button 
          type="submit" // This would connect to actual server in production
          className="mt-8 rounded-lg bg-primary px-6 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
        >
          Save and Review
        </button>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          No answers sent to analytics. No validation score calculated. Use as reflection tool only.
        </p>
      </div>
    </section>
  );
}

export function ExamplesIndex({}: SectionsProps) {
  const examples = [
    { id: "1", title: "Fictional Handoff Example" },
    { id: "2", title: "Website Redesign Case Study" },
    { id: "3", title: "Operational System Implementation" },
  ];

  return (
    <section className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
          Evidence Index.
        </h2>

        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Separate samples, internal work, and client evidence. Each example is labeled with 
          permission status clearly visible before publication.
        </p>

        {/* Examples Grid */}
        <div className="mt-8 grid gap-y-8 md:grid-cols-3">
          {examples.map((ex) => (
            <article key={ex.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-primary-secondary">{ex.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Permission status: Labeled illustrative or sample work. Not customer permission.
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 rounded-lg bg-primary/5 p-4 border-l-4 border-primary">
          Note: All evidence is clearly labeled as either illustrative, sample, or client output. 
          Customer permission is required before publication use—not just performance of the work itself.
        </p>
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <article className="scroll-mt-24 py-16 lg:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
        Privacy Notice
      </h1>

      <div className="mt-8 max-w-prose text-gray-700 dark:text-gray-300">
        <p>
          CH Business Services collects and processes personal data through our inquiry forms, 
          email communications, and customer interactions in compliance with applicable privacy laws.
        </p>
      </div>

      {/* Privacy Content - would be populated with actual content per spec Section 5.9 */}
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Contact for questions: office@chbusinessservices.pro
      </p>
    </article>
  );
}

export function Terms() {
  return (
    <article className="scroll-mt-24 py-16 lg:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
        Website Terms of Service
      </h1>

      <div className="mt-8 max-w-prose text-gray-700 dark:text-gray-300">
        <p>
          CH Business Services operates a website for informational and service inquiry purposes only. 
          This site is not a substitute for our actual service agreement or professional services provided.
        </p>
      </div>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        For questions about website use: office@chbusinessservices.pro
      </p>
    </article>
  );
}

export function AccessibilityInfo() {
  return (
    <article className="scroll-mt-24 py-16 lg:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl xl:text-5xl">
        Accessibility Information — WCAG 2.2 AA Target
      </h1>

      <div className="mt-8 max-w-prose text-gray-700 dark:text-gray-300">
        <p className="text-lg leading-8">
          CH Business Services targets WCAG 2.2 Level AA accessibility standards across all public pages 
          and functional processes. Full conformance is continuously evaluated through automated scanning 
          and manual testing with screen readers.
        </p>

        <div className="mt-6 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 p-4">
          <h2 className="text-base font-semibold text-primary-secondary">Known Limitations</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Not all web platforms support full accessibility. Contact us at the email below for 
            accommodations and assistance with our materials.
          </p>
        </div>

        <a href="mailto:office@chbusinessservices.pro" className="mt-4 inline-flex items-center rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200">
          Request Accommodations <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

// NavLinks component for navigation
export function NavLinks() {
  return (
    <nav className="flex items-center gap-6 py-4">
      <Link href="/" className="text-sm font-semibold text-primary-secondary hover:text-primary-dark transition-colors">
        Home
      </Link>
      {NAV_LINKS.map((link) => (
        <Link 
          key={link.href} 
          href={link.href} 
          className="text-sm font-semibold text-primary-secondary hover:text-primary-dark transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default Sections;
