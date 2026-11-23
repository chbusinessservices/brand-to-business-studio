// Business details and booking configuration for CH Business Services.
// Change these values here; every page reads from this file.

export const SITE = {
  name: "CH Business Services",
  shortName: "CH",
  domain: "chbusinessservices.pro",
  category: "Brand architecture and business systems studio",
  email: "office@chbusinessservices.pro",
  emailHref: "mailto:office@chbusinessservices.pro",
  phone: "(929) 515-5434",
  phoneHref: "tel:+19295155434",
  established: 2023,
  founder: "Elias Chouchani",
  /** External booking page (Zoho Bookings). Set to null to hide every booking link. */
  bookingUrl: "https://zbooking.us/cjlJ1" as string | null,
  headline: "We build the business behind the brand.",
  supporting:
    "We help founders connect a clear brand promise with the structure to deliver it—from positioning and websites to organized onboarding, clear responsibilities, and repeatable workflows.",
} as const;

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/examples", label: "Examples" },
  { href: "/business-backup-check", label: "Backup Check" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy information" },
  { href: "/terms", label: "Website terms" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export const SERVICE_OPTIONS = ["CODE", "SHIELD", "SIGNAL", "SYSTEM", "General Inquiry"] as const;
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export const PROBLEMS = [
  {
    title: "Your offer takes too much explaining.",
    body: "People are interested, but it takes a long conversation before they understand what you do and who it is for.",
  },
  {
    title: "Your website leaves the next step unclear.",
    body: "Visitors read the page and are not sure whether to call, book, or send a message—so many do nothing.",
  },
  {
    title: "Onboarding changes from client to client.",
    body: "Each new client gets a slightly different start, and small details are rebuilt from memory every time.",
  },
  {
    title: "Too much depends on you remembering everything.",
    body: "Who owns what, what comes next, and what is still open lives mostly in your head instead of a shared system.",
  },
] as const;

export const PILLARS = [
  {
    key: "CODE",
    title: "Brand clarity",
    method: "Define the promise.",
    scope: "Audience, promise, positioning, messaging, voice, and identity.",
    evidence: "Approved positioning and messaging documents.",
  },
  {
    key: "SHIELD",
    title: "Responsibilities and review coordination",
    method: "Address the risks.",
    scope:
      "Clarify ownership, document open issues, and identify items requiring appropriate professional review.",
    evidence: "Responsibility map and review-status record.",
  },
  {
    key: "SIGNAL",
    title: "Websites and market presence",
    method: "Make the value visible.",
    scope: "Explain the promise, supporting proof, process, and next step.",
    evidence: "Agreed website/content outputs and tested inquiry path.",
  },
  {
    key: "SYSTEM",
    title: "Client experience and operations",
    method: "Build the systems to deliver.",
    scope: "Organize onboarding, workflows, SOPs, responsibilities, and delivery tracking.",
    evidence: "Documented workflows and assigned owners.",
  },
] as const;

export const STEPS = [
  {
    title: "Tell us what feels disconnected.",
    body: "Share a few sentences through the inquiry form. No preparation or documents needed.",
  },
  {
    title: "Discuss your situation on a clarity call.",
    body: "A free 15-minute conversation to understand where things stand and what you want to change.",
  },
  {
    title: "Receive a recommended next step.",
    body: "CH suggests a sensible starting point—sometimes one focused area, sometimes none at all.",
  },
  {
    title: "Review scope, responsibilities, and pricing before proceeding.",
    body: "Nothing begins until you have reviewed what is included, who owns what, and what it costs.",
  },
] as const;

export const FAQS = [
  {
    q: "Do I need all four phases?",
    a: "No. CODE, SHIELD, SIGNAL, and SYSTEM are connected areas, not a mandatory package. Many engagements begin with one area. We identify the starting point first and only recommend what fits your situation.",
  },
  {
    q: "Can CH help with one specific project?",
    a: "Yes. If you already know what you need—clearer messaging, a website that explains your offer, or a more organized onboarding process—CH can focus on that project. Its scope is defined and agreed before work begins.",
  },
  {
    q: "What happens on the clarity call?",
    a: "It is a free 15-minute conversation about what feels disconnected in your business, what you have already tried, and what a useful next step might be. It is not a sales pitch, and you should not expect a fixed quote on the call itself.",
  },
  {
    q: "How is custom work priced?",
    a: "Custom work is priced according to its specific scope. Once CH understands your situation, you receive a recommended scope, the responsibilities on each side, and pricing to review before anything proceeds.",
  },
  {
    q: "What responsibilities remain with the client?",
    a: "You keep ownership of your business decisions, approvals, the accuracy of the information you provide, and any legal, tax, financial, or regulatory decisions. Each engagement documents who owns which tasks so expectations stay clear.",
  },
  {
    q: "When is another professional needed?",
    a: "Whenever a question requires legal, tax, accounting, insurance, or other licensed advice. Through SHIELD, CH helps identify and document these items so you can take them to an appropriately licensed professional. CH does not provide that advice itself.",
  },
] as const;

export const PROFESSIONAL_DISCLAIMER =
  "CH's coordination and operational consulting do not replace advice from appropriately licensed legal, tax, accounting, or other professionals.";

/**
 * About section. Biography paragraphs stay unpublished until the owner supplies
 * and approves them: leave `founderBio` empty to keep it off the site.
 */
export const ABOUT = {
  intro:
    "CH Business Services is a brand architecture and business systems studio for service-business founders. The work sits where a brand's promise meets the day-to-day structure needed to keep it—so what clients are told and what clients experience stay connected.",
  approach:
    "Engagements begin with listening and a clear recommendation, not a predetermined package. Practical outcomes come first; framework names come second.",
  founderBio: [] as string[],
};

/**
 * Scoped offers. Each is CH implementation work (CH contracts with the client).
 * No prices are published: scope and pricing are agreed in writing first.
 */
export const OFFERS = [
  {
    slug: "cleaning-business-setup",
    name: "Cleaning Business Setup",
    short: "A focused setup for owner-led residential cleaning businesses that already have customers.",
    whoFor:
      "Owner-led residential cleaning businesses with existing customers. Our initial focus is Hudson County, New Jersey; other service businesses are welcome to ask whether it fits.",
    problem:
      "Customers find you by word of mouth, but quotes, bookings, first visits and follow-ups are handled differently each time and mostly depend on the owner.",
    includes: [
      "A clear description of what you offer, to whom, and what happens next",
      "A simple website or page that explains the offer and collects requests",
      "A consistent path from first request to quote, first visit and follow-up",
      "Written responsibilities: what you own, what CH owns, what needs another professional",
    ],
    excludes: [
      "Legal, tax, insurance or licensing advice",
      "Hiring, payroll or staff management",
      "Guaranteed bookings, revenue or rankings",
    ],
    pillars: ["CODE", "SIGNAL", "SYSTEM"],
  },
  {
    slug: "websites-inquiry",
    name: "Websites & Inquiry",
    short: "A website that explains your offer and an inquiry path that reliably reaches you.",
    whoFor: "Service businesses whose site leaves visitors unsure what you do or how to take the next step.",
    problem:
      "Visitors read the page and leave, or messages arrive incomplete, in different places, or not at all.",
    includes: [
      "Messaging for the pages that matter: what you do, who it is for, what happens next",
      "A website build or rebuild scoped to agreed pages",
      "A tested inquiry form that stores each request and shows an honest confirmation",
      "A short handoff so you know where requests land and who answers them",
    ],
    excludes: [
      "Ongoing advertising or paid campaign management",
      "Guaranteed search rankings or traffic",
      "Work outside the agreed pages",
    ],
    pillars: ["CODE", "SIGNAL"],
  },
  {
    slug: "client-journey-systems",
    name: "Client Journey & Systems",
    short: "A bounded improvement to how new clients are onboarded and how work is handed off.",
    whoFor: "Founders whose onboarding and delivery change from client to client.",
    problem:
      "Each new client gets a slightly different start, and who owns what lives mostly in the owner's head.",
    includes: [
      "A map of the current client journey and where it breaks",
      "A documented onboarding sequence and handoff checklist",
      "Assigned owners for each recurring step",
      "Simple written procedures your team can follow",
    ],
    excludes: [
      "Software licences or subscriptions (you choose and own your tools)",
      "Legal, HR or accounting decisions",
      "Open-ended ongoing operations management",
    ],
    pillars: ["SHIELD", "SYSTEM"],
  },
] as const;
export type Offer = (typeof OFFERS)[number];

/** Evidence standard used on /examples. Nothing below may be client proof until approved. */
export const EVIDENCE_LABELS = [
  { label: "Illustrative sample", body: "Created by CH to show the format of a deliverable. Not a real client and not a result." },
  { label: "CH internal work", body: "Work CH did on its own business, such as this website." },
  { label: "Client evidence", body: "Published only with the client's written permission and the facts checked. None is published yet." },
] as const;

/** Ungated self-reflection. No scores, no diagnosis, nothing is stored or sent. */
export const BACKUP_CHECK = [
  { area: "Offer", q: "Could someone else explain what you sell, to whom, in two sentences?" },
  { area: "First contact", q: "If a new customer messages you today, do you know exactly where it lands and who answers?" },
  { area: "Quoting", q: "Do you price and quote the same way each time, written down somewhere other than your head?" },
  { area: "First visit", q: "Does every new customer get the same welcome and the same information before the first visit?" },
  { area: "Responsibilities", q: "Is it written down who does what, including what you would hand off if you were away for a week?" },
  { area: "Follow-up", q: "After a job, is there a set next step—a check-in, a review request, a rebooking?" },
  { area: "Records", q: "Could you find a customer's history, agreements and notes in under two minutes?" },
  { area: "Professional review", q: "Do you know which questions in your business need a lawyer, accountant or insurer rather than a guess?" },
] as const;

export const LEGAL_DRAFT_NOTE =
  "Working draft prepared from how the website is currently built. It must be reviewed and approved by the owner—and ideally a qualified professional—before it is relied on. It does not claim compliance with any specific law.";
