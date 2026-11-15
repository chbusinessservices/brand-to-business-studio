import { z } from "zod";
import { SERVICE_OPTIONS } from "./site";

const optionalUrl = z
  .string()
  .trim()
  .max(255, { message: "Website must be under 255 characters" })
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine(
    (v) => {
      if (!v) return true;
      const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
      try {
        const u = new URL(withProtocol);
        return u.hostname.includes(".") && !u.hostname.includes(" ");
      } catch {
        return false;
      }
    },
    { message: "Enter a valid website, like example.com" },
  );

/** Fields a visitor fills in. Shared by the form (client) and the server handler. */
export const inquiryFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name" })
    .max(100, { message: "Name must be under 100 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Enter a valid email address" })
    .max(255, { message: "Email must be under 255 characters" }),
  businessName: z
    .string()
    .trim()
    .min(1, { message: "Please enter your business name" })
    .max(150, { message: "Business name must be under 150 characters" }),
  website: optionalUrl,
  message: z
    .string()
    .trim()
    .min(10, { message: "Please share a little more (at least 10 characters)" })
    .max(2000, { message: "Please keep this under 2,000 characters" }),
  serviceInterest: z.array(z.enum(SERVICE_OPTIONS)).max(SERVICE_OPTIONS.length).default([]),
});

export type InquiryFields = z.input<typeof inquiryFieldsSchema>;

/** Full payload sent to the server, including spam-protection signals. */
export const inquirySubmissionSchema = inquiryFieldsSchema.extend({
  /** Honeypot: hidden from people, must stay empty. */
  company: z.string().max(200).optional().default(""),
  /** Milliseconds the form was open before submit. */
  elapsedMs: z.number().int().min(0).max(1000 * 60 * 60 * 24),
});

export type InquirySubmission = z.input<typeof inquirySubmissionSchema>;

export const MIN_FILL_MS = 3000;
export const MAX_PER_IP_PER_HOUR = 3;
export const MAX_PER_EMAIL_PER_DAY = 3;

export type SpamVerdict = { allowed: true } | { allowed: false; reason: "honeypot" | "too_fast" };

export function checkSpamSignals(input: { company?: string; elapsedMs: number }): SpamVerdict {
  if (input.company && input.company.trim().length > 0) return { allowed: false, reason: "honeypot" };
  if (input.elapsedMs < MIN_FILL_MS) return { allowed: false, reason: "too_fast" };
  return { allowed: true };
}

export function isRateLimited(counts: { ipLastHour: number; emailLastDay: number }): boolean {
  return counts.ipLastHour >= MAX_PER_IP_PER_HOUR || counts.emailLastDay >= MAX_PER_EMAIL_PER_DAY;
}

export function normalizeWebsite(v?: string): string | null {
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export const INQUIRY_STATUSES = ["new", "contacted", "scheduled", "completed", "archived"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
export const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  archived: "Archived",
};
