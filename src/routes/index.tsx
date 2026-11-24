import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AssistantWidget } from "@/components/site/AssistantWidget";
import {
  FAQS,
  FOOTER_LEGAL_LINKS,
  OFFERS,
  PILLARS,
  PROBLEMS,
  STEPS,
  SITE,
} from "@/lib/site";
import {
  Hero,
  Statement,
  Problems,
  Services,
  Method,
  HowItWorks,
  About,
  Faq,
  Contact,
} from "@/components/site/Sections";

const TITLE = "CH Business Services — We build the business behind the brand.";
const DESCRIPTION =
  "We help founders connect a clear brand promise with the structure to deliver it—from positioning and websites to organized onboarding, clear responsibilities, and repeatable workflows.";

/** 
 * HOME-01 HEADER
 * Programmatically exposed navigation; single dominant CTA
 */
const HEAD = {
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
};

/** 
 * HOME-02 HERO
 * Primary promise + audience + next step
 */
const HEADLINE = SITE.headline;
const SUBHEAD = SITE.supporting;

/** 
 * HOME-03 VISUAL ILLUSTRATIVE JOURNEY
 * Promise → Next Action → Owner → Completion
 */
const VISUAL = {
  label: "Illustrative journey",
  body: "From the first message to completed delivery, we ensure ownership at every step.",
};

/** 
 * HOME-04 RECOGNIZE THE GAP
 * Three cards addressing common pain points
 */
const HOME_PROBLEMS = PROBLEMS;

/** 
 * HOME-05 SERVICE CHOICES
 * Primary setup card + narrower options
 */
export const SERVICES_CONTENT = OFFERS;

/** 
 * HOME-06 PILLARS (CODE/SHIELD/SIGNAL/SYSTEM)
 * Trust OS explanation
 */
const HOME_PILLARS = PILLARS;

/** 
 * HOME-07 ENGAGEMENT PROCESS
 * Full inquiry-to-handoff flow
 */
const HOME_STEPS = STEPS;

/** 
 * HOME-08 BUSINESS BACKUP CHECK
 * Ungated reflection resource link
 */
const BACKUP_CHECK_LINK = {
  href: "/business-backup-check",
  text: "Take the Business Backup Check",
};

/** 
 * HOME-09 PROVIDER CLARITY
 * Explain provider involvement (conditional)
 */
const PROVIDER_CLARITY = {
  label: "Provider Clarity",
  body: "We clarify which providers deliver work and how they're compensated per agreed scope.",
  link: "/for-providers",
};

/** 
 * HOME-10 AUDIENCE/LANGUAGE/VISION
 * Local focus + staged expansion
 */
const AUDIENCE_CLAIM = {
  primary: "Owner-led residential cleaning businesses in Hudson County, New Jersey",
  note: "Other service businesses welcome to inquire if our scope fits.",
};

/** 
 * HOME-11 FAQS
 * Resolve common questions
 */
export const FAQS_CONTENT = FAQS;

/** 
 * HOME-12 CLOSING CTA
 * "What happens after your next customer says yes?"
 */
const CLOSING = {
  question: "What happens after your next customer says yes?",
  action: `Request a Clarity Call`,
  href: "/contact",
};

/** 
 * HOME-13 FOOTER
 * Navigation, verified contact, policies
 */
export const FOOTER_LINKS = FOOTER_LEGAL_LINKS;

// Type-safe inference for route component
declare module "@tanstack/react-router" {
  interface Register {
    components: {
      "/": typeof IndexComponent;
    };
  }
}

export const Route = createFileRoute("/")({
  head: homeRouteHead,
  component: IndexComponent,
});

function homeRouteHead() {
  return HEAD.head();
}

/** 
 * INDEX COMPONENT - Full homepage following Section 4 spec
 */
function IndexComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to main content
      </a>

      {/* Header with primary CTA */}
      <Header />

      {/* Main navigation - not shown, Header handles it */}
      
      {/* HOME-01: Header is above here */}
      
      <main id="main" className="max-w-3xl mx-auto px-6 py-12">
        <Hero />
        
        {/* HOME-02: Hero with exact promise language */}
        <section className="py-12 border-y border-border/50 mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{HEADLINE}</h1>
          <p className="text-xl text-muted-foreground mb-6">{SUBHEAD}</p>
          <p className="text-sm text-muted-foreground italic mb-6">
            Clarify what you offer, organize the client journey, and give people a clear next step—from the first inquiry to completed work.
          </p>
          
          {/* Dual CTAs: Request (primary) + Business Backup Check (secondary) */}
          <div className="flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 h-12 px-8 shadow-md"
            >
              Request a Clarity Call
            </a>
            <button onClick={() => window.location.href = "/business-backup-check"} className="inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary/5 h-12 px-8">
              Try the Business Backup Check
            </button>
          </div>
        </section>

        {/* HOME-03: Visual journey example */}
        <Statement />
        
        {/* HOME-04: Recognize the gap - problems */}
        <Problems />
        
        {/* HOME-05: Service choices */}
        <Services />
        
        {/* HOME-06: Promise-to-delivery example */}
        <Method />
        
        {/* HOME-07: Trust OS */}
        <HowItWorks />
        
        {/* HOME-08: Engagement process */}
        <section className="my-12">
          <h3 className="text-2xl font-semibold mb-6">How engagement works</h3>
          <ol className="list-none space-y-4 text-lg">
            {HOME_STEPS.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="text-sm text-muted-foreground flex-shrink-0">{index + 1}</span>
                <div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* HOME-09: Business Backup Check */}
        <a href="/business-backup-check" className="block mb-8">
          <button className="inline-flex items-center gap-2 rounded-lg border bg-primary/5 hover:bg-primary/10 px-6 py-3 text-lg">
            <span>📋</span>
            <span>{BACKUP_CHECK_LINK.text}</span>
          </button>
        </a>

        {/* HOME-10: Provider clarity (conditional) */}
        {PROVIDER_CLARITY && (
          <section className="my-8">
            <div className="rounded-lg border p-6 bg-muted/5">
              <h3 className="text-xl font-semibold mb-3">{PROVIDER_CLARITY.label}</h3>
              <p className="text-muted-foreground mb-4">{PROVIDER_CLARITY.body}</p>
              <a href={PROVIDER_CLARITY.link} className="inline-flex items-center gap-2 rounded-lg border bg-primary/5 px-6 py-3 text-lg hover:bg-primary/10">
                Learn about our provider arrangement
              </a>
            </div>
          </section>
        )}

        {/* HOME-11: Audience/Language/Vision */}
        <section className="my-8">
          <h3 className="text-xl font-semibold mb-4">Audience and capacity</h3>
          <p className="text-lg text-muted-foreground mb-2">{AUDIENCE_CLAIM.primary}</p>
          <p className="text-sm text-muted-foreground">{AUDIENCE_CLAIM.note}</p>
        </section>

        {/* HOME-12: FAQs */}
        <Faq />

        {/* HOME-13: Closing CTA */}
        <div className="my-16 rounded-xl bg-primary/5 p-8 border">
          <h2 className="text-3xl font-semibold mb-4">{CLOSING.question}</h2>
          <a
            href={CLOSING.href}
            className="inline-flex items-center gap-3 text-xl font-medium hover:underline"
          >
            {CLOSING.action} →
          </a>
        </div>

        {/* HOME-14: Footer */}
      </main>

      <Footer />
      <AssistantWidget />
    </div>
  );
}
