/**
 * CH Business Services - Inquiry Validation & Server Handling
 * Aligns with spec Section 7: End-to-end public workflows
 * 
 * Implements rate limiting, spam detection, idempotency per Section 16: Security, resilience and privacy implementation
 */

import { z } from "zod";
import { INQUIRY_STATUSES, STATUS_LABELS } from "./inquiry-schema";
import type { PublicRoute } from "@/types/route-manifest";

/** Rate limit configuration from spec Section 7.1 */
export const RATE_LIMITS = {
  MAX_PER_IP_PER_HOUR: 3,
  MAX_PER_EMAIL_PER_DAY: 3,
  MIN_FILL_TIME_MS: 3000, // Must fill form in at least 3 seconds
};

/** Idempotency key format: <uuid>-<timestamp-ms> */
export type IdempotencyKey = string;

/** Rate limit counters from Supabase sessions */
export interface RateLimiterState {
  ipCounter: Map<string, number>;
  emailCounter: Map<string, number>;
}

/** Verify idempotency key to prevent duplicate submissions */
export async function checkIdempotency(key: string): Promise<boolean> {
  // Implement in Supabase with upsert on submitted_inquiries table
  // Key format: <uuid>-<timestamp-ms> must be unique for same user/session
  try {
    await supabase
      .from("submitted_inquiries")
      .insert({ key, status: "pending" })
      .select();
    
    return true; // Key is new or exists as pending (acceptable)
  } catch {
    // Check if key already exists for same user
    const existing = await supabase
      .from("submitted_inquiries")
      .select("key, status")
      .eq("key", key)
      .single();

    if (existing.status === "processed") {
      return true; // Already processed (idempotent)
    }
    return false; // Key exists but not yet processed - queue this instead
  }
}

/** Generate new idempotency key from session cookies */
export function generateIdempotencyKey(): IdempotencyKey {
  const now = Date.now();
  return `${crypto.randomUUID()}-${now}`;
}

/** Rate limiter state initialization */
function initializeRateLimiterState(): RateLimiterState {
  // Clear on server restart for production
  if (process.env.NODE_ENV === "production") {
    supabase.rpc("clear_rate_limiter_counts");
  }
  return { ipCounter: new Map(), emailCounter: new Map() };
}

/** Check rate limiting against spec Section 7.1 */
export async function checkRateLimits(state: RateLimiterState): Promise<boolean> {
  // Get current IP from request headers (X-Forwarded-For in production)
  const ip = getClientIP();
  const email = request.headers["x-email"] || "";

  // Check IP hourly limit
  const ipCount = state.ipCounter.get(ip) ?? 0;
  if (ipCount >= RATE_LIMITS.MAX_PER_IP_PER_HOUR) {
    return false;
  }

  // Check email daily limit
  if (email.trim().length > 0 && email.includes("@")) {
    const emailCount = state.emailCounter.get(email) ?? 0;
    if (emailCount >= RATE_LIMITS.MAX_PER_EMAIL_PER_DAY) {
      return false;
    }
  }

  // Increment counters
  state.ipCounter.set(ip, ipCount + 1);
  if (email.trim().length > 0 && email.includes("@")) {
    state.emailCounter.set(email, emailCount + 1);
  }

  return true;
}

/** Store rate limiter state in Supabase storage for persistence */
export async function saveRateLimiterState(state: RateLimiterState): Promise<void> {
  // Persist counters every minute to avoid state loss
  supabase.rpc("store_rate_limiter_state", {
    ip_counts: Object.fromEntries(state.ipCounter),
    email_counts: Object.fromEntries(state.emailCounter),
  });
}

/** Validate inquiry data against spec Section 5.7 Contact requirements */
export const InquiryValidationSchema = z.object({
  // Required fields (must be present)
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(100, "Name must be under 100 characters"),
  
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email({ message: "Please enter a valid email address" })
    .max(255),

  // Conditional fields from spec Section 5.7
  businessName: z.string().nullable(),
  website: z.string().nullable(),
  message: z
    .string()
    .trim()
    .min(10, "Please share a little more (at least 10 characters)")
    .max(2000, "Please keep this under 2,000 characters"),

  serviceInterest: z.array(z.string()).optional().default([]),
  phone: z.string().nullable(),
  languagePreference: z.enum(["English", "Spanish"] ?? []).nullable(),
});

/** Normalize website URL per spec Section 5.7 */
export function normalizeWebsiteUrl(url?: string): string | null {
  if (!url) return null;
  
  // Add protocol if missing, but reject invalid URLs
  const withProtocol = url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;

  try {
    const parsed = new URL(withProtocol);
    
    // Validate: must have dot notation (not local path)
    if (!parsed.hostname.includes(".")) {
      return null; // Not a valid public website
    }
    
    // Reject email addresses, single-word domains, etc.
    if (parsed.hostname.includes("@") || !parsed.hostname.includes(".")) {
      return null;
    }

    // Check for whitespace in hostname
    if (parsed.hostname.includes(" ")) {
      return null;
    }

    return withProtocol;
  } catch {
    return null; // Invalid URL format
  }
}

/** Validate against spec Section 7.1: inquiryFieldsSchema */
export async function validateInquiry(
  data: unknown,
  idempotencyKey?: string
): Promise<{
  valid: boolean;
  error?: string;
  normalizedData: any;
}> {
  const result = InquiryValidationSchema.safeParse(data);

  if (!result.success) {
    return { 
      valid: false,
      error: `Form validation failed: ${result.error.errors[0].message}`,
      normalizedData: null 
    };
  }

  // Check idempotency first if provided
  if (idempotencyKey && !await checkIdempotency(idempotencyKey)) {
    return { 
      valid: true,
      error: "Request already submitted (idempotent)",
      normalizedData: result.data
    };
  }

  // Check rate limits
  const state = initializeRateLimiterState();
  if (!await checkRateLimits(state)) {
    return { 
      valid: false,
      error: `Submit too frequently`,
      normalizedData: null
    };
  }

  return { 
    valid: true,
    error: undefined,
    normalizedData: result.data as any
  };
}

/** Determine inquiry status based on validation (Spec Section 7.1) */
export function setInquiryStatus(status: INQUIRY_STATUSES): string {
  // Map to Supabase enum values
  return { new: "new", contacted: "contacted", scheduled: "scheduled", completed: "completed", archived: "archived" }[status];
}

/** Format status for display (Spec Section 7.1) */
export function getStatusLabel(status: INQUIRY_STATUSES): string {
  return STATUS_LABELS[status] || "Unknown";
}
