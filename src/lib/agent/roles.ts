// Visitor-facing assistant roles. Safe for the browser: labels and starter
// questions only. The full instructions for each role stay on the server
// (src/lib/agent/prompts.server.ts).

export const AGENT_ROLES = ["intake-guide", "service-scope", "operations-support"] as const;
export type AgentRole = (typeof AGENT_ROLES)[number];

export const AGENT_ROLE_INFO: Record<
  AgentRole,
  { label: string; blurb: string; starters: readonly string[] }
> = {
  "intake-guide": {
    label: "Intake Guide",
    blurb: "Put into words what feels disconnected in your business.",
    starters: [
      "I'm not sure what's wrong—things just feel scattered.",
      "Clients like us, but explaining what we do takes too long.",
    ],
  },
  "service-scope": {
    label: "Service Scope",
    blurb: "Understand CODE, SHIELD, SIGNAL and SYSTEM—and where you might start.",
    starters: [
      "What's the difference between the four areas?",
      "Do I need all four, or can I start with one?",
    ],
  },
  "operations-support": {
    label: "Operations Support",
    blurb: "Think through onboarding, responsibilities and day-to-day workflows.",
    starters: [
      "Every client onboarding is different. Where do I begin?",
      "Too much depends on me remembering everything.",
    ],
  },
};

/** Limits shared by the widget and the server route. */
export const AGENT_LIMITS = {
  maxMessages: 20,
  maxMessageChars: 2000,
  maxTotalChars: 16000,
} as const;

/** Browser event the widget fires to place a summary into the inquiry form. */
export const PREFILL_INQUIRY_EVENT = "ch:prefill-inquiry";
export type PrefillInquiryDetail = { message: string };
