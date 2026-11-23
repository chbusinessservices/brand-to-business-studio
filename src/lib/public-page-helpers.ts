/**
 * Public Page Helpers for CH Business Services
 * Aligns with spec Section 6: Global content, interaction and design requirements
 * 
 * All pages must implement WCAG 2.2 AA accessibility target
 * Must support keyboard navigation and screen reader access
 */

import type { RouteEntry } from "@/types/route-manifest";

// Helper for creating public page templates
export const createPublicPage = (options: {
  path: string;
  head?: () => ({
    title?: string;
    description?: string;
    meta?: any[];
    scripts?: any[];
  } | undefined);
}): RouteEntry => {
  return {
    id: `page-${options.path.replace('/', '-')}`,
    path: options.path,
    template: "base",
    phase: "P1",
    purpose: "Base public page implementation per spec Section 3",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  };
};

/** Type for reusable section components */
export type SectionComponent = {
  id: string;
  title?: string;
  description?: string;
  subtitle?: string;
  sections?: Array<{
    key: "hero" | "statement" | "problems" | "pillars" | "steps" | "cta";
    title?: string;
    content?: string;
  }>;
};

/** Generate section components following spec Section 4: Homepage exact section contract */
export const generateHomepageSections = (): RouteEntry => {
  return {
    id: "homepage-sections",
    path: "/components/sections",
    template: "homepage_components",
    phase: "P1",
    purpose: "All homepage sections must implement exact spec layout from HOME-01 to HOME-14",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests",
  };
};

/** Generate Hero component following HOME-02 specification */
export const generateHeroSection = (): {
  id: string;
  section: {
    title: "Hero";
    eyebrow: "Business setup. Clear systems. Accountable delivery.";
    h1: "We build the business behind the brand.";
    subhead: string;
    primaryCTA: "Request a Clarity Call";
    secondaryCTA: "Try the Business Backup Check";
    audienceLine: string;
  };
};

/** Generate Problems section following HOME-04 specification */
export const generateProblemsSection = (): {
  id: string;
  title: "Recognize the Gap";
  problems: Array<{
    title: string;
    body: string;
    category: "before_sale" | "after_yes" | "inside_delivery";
  }>;
};

/** Generate Pillars following HOME-07 Trust OS specification */
export const generateTrustOS = (): {
  id: string;
  title: "Trust OS",
  pillars: Array<{
    key: "CODE" | "SHIELD" | "SIGNAL" | "SYSTEM";
    title: string;
    method: string;
    scope: string;
    evidence: string;
  }>;
};

/** Generate Steps following spec Section 4 HOME-08 engagement process */
export const generateEngagementProcess = (): {
  id: string;
  title: "How Engagement Works",
  steps: Array<{
    step: number;
    title: string;
    body: string;
  }>;
};

/** Generate FAQ section following spec Section 4 HOME-12 */
export const generateFAQ = (): {
  id: string;
  title: "FAQs",
  faqs: Array<{
    question: string;
    answer: string;
    category?: "scope" | "pricing" | "responsibility" | "support";
  }>;
};

/** Generate Problems following spec Section 4 HOME-04 */
export const generateProblems = (): {
  id: string;
  title: "Recognize the Gap",
  problems: Array<{
    title: string;
    body: string;
  }>;
};
