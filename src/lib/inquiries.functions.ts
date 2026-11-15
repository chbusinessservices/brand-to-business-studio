import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
  checkSpamSignals,
  inquirySubmissionSchema,
  isRateLimited,
  normalizeWebsite,
} from "./inquiry-schema";

export type SubmitInquiryResult =
  | { ok: true; id: string }
  | { ok: false; code: "rate_limited" | "rejected" | "server_error"; message: string };

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function clientIp(request: Request | undefined): string {
  const h = request?.headers;
  if (!h) return "unknown";
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Public inquiry submission. Validates input, checks spam signals and rate limits,
 * then stores the inquiry. Success is only reported after the row is stored.
 */
export const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => inquirySubmissionSchema.parse(data))
  .handler(async ({ data }): Promise<SubmitInquiryResult> => {
    const spam = checkSpamSignals({ company: data.company, elapsedMs: data.elapsedMs });
    if (!spam.allowed) {
      console.warn(`[inquiry] rejected by spam check: ${spam.reason}`);
      return {
        ok: false,
        code: "rejected",
        message:
          "We couldn't accept this submission. Please wait a moment and try again, or email us directly.",
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ipHash = await sha256Hex(`ch-inquiry:${clientIp(getRequest())}`);
    const email = data.email.toLowerCase();
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [ipCount, emailCount] = await Promise.all([
      supabaseAdmin
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", hourAgo),
      supabaseAdmin
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .ilike("email", email)
        .gte("created_at", dayAgo),
    ]);

    if (ipCount.error || emailCount.error) {
      console.error("[inquiry] rate-limit lookup failed", ipCount.error ?? emailCount.error);
      return {
        ok: false,
        code: "server_error",
        message: "Something went wrong on our side. Your inquiry was not saved—please try again.",
      };
    }

    if (isRateLimited({ ipLastHour: ipCount.count ?? 0, emailLastDay: emailCount.count ?? 0 })) {
      return {
        ok: false,
        code: "rate_limited",
        message:
          "We've already received several inquiries from you recently. Please email or call us directly instead.",
      };
    }

    const { data: row, error } = await supabaseAdmin
      .from("inquiries")
      .insert({
        name: data.name,
        email,
        business_name: data.businessName,
        website: normalizeWebsite(data.website),
        message: data.message,
        service_interest: data.serviceInterest ?? [],
        source: "website",
        ip_hash: ipHash,
        // No verified sending domain yet, so no owner email is attempted.
        notification_status: "not_configured",
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("[inquiry] insert failed", error);
      return {
        ok: false,
        code: "server_error",
        message: "Something went wrong on our side. Your inquiry was not saved—please try again.",
      };
    }

    return { ok: true, id: row.id };
  });
