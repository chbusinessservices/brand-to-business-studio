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
  { href: "#services", label: "Services" },
  { href: "#method", label: "Method" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
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
