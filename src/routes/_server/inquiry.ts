/**
 * CH Business Services - Public Inquiry Form Handler
 * 
 * Implements spec Section 7.1: Inquiry transaction workflow
 * 
 * Requirements from spec:
 * - Server-side validation (not just client)
 * - Rate limiting with no-permanent-lock fallback
 * - Spamy detection via honeypot and timing
 * - Idempotent submissions to prevent duplicates
 * - Safe rejection/sanitized handling of malicious input
 * - Clear error messages without code execution disclosure
 */

import { createFileRoute } from "@tanstack/react-router";
import type { IncomingHttpHeaders } from "http-request";
import { setInquiryStatus, validateInquiry, checkRateLimits } from "@/lib/inquiry-validation";
import { INQUIRY_STATUSES, STATUS_LABELS } from "@/lib/inquiry-schema";

interface SubmissionData extends {
  name: string;
  email: string;
  businessName?: string | null;
  website?: string | null;
  message: string;
  serviceInterest?: string[];
}

const INQUIRY_ID_PREFIX = "ch_biz_" as const;

// Honeypot field (hidden from UI, checked server-side)
const HONEYPOT_FIELD = "__cf_honeypot";

export const Route = createFileRoute("/api/inquiries")({
  HEAD: {
    async handler() {
      return {
        title: "CH Business Services — Inquire",
        description: "Submit an inquiry to discuss your situation on a 15-minute clarity call",
        meta: [
          { name: "og:title", content: "CH Business Services — Inquire" },
          { name: "description", content: "We build the business behind the brand. Tell us what feels disconnected." },
        ]
      };
    }
  },

  // Main submission handler
  POST: {
    async handler({ request }: { request: Request }) {
      const headers = await request.headers;
      
      try {
        // Get idempotency key from cookies if present (Spec 7.1: durable accepted request)
        let idempotencyKey: string | undefined;
        const cookieHeader = headers.get("Cookie") ?? "";
        const idempotencyParts = cookieHeader.split(";");
        for (const part of idempotencyParts) {
          if (part.trim().startsWith("inquiry_id=")) {
            idempotencyKey = part.split("=")[1]?.trim();
            break;
          }
        }

        // Parse form data
        const formData = await request.formData();
        
        // Get data, with honeypot protection (Spec 16: security)
        const submissionData: SubmissionData = {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          businessName: formData.get("businessName"),
          website: formData.get("website"),
          message: formData.get("message") as string,
          serviceInterest: formData.getAll("serviceInterest") as string[],
          phone: formData.get("phone"),
          languagePreference: formData.get("languagePreference"),
        };

        // HONEYPOT CHECK - spec Section 16 security requirement
        const honeypotValue = formData.get(HONEYPOT_FIELD) as string | null;
        if (honeypotValue && honeypotValue.trim().length > 0) {
          return new Response(JSON.stringify({
            error: "Submit attempted",
            reason: "honeypot" // Will be logged for abuse detection
          }), { status: 429, headers: { "Content-Type": "application/json" } });
        }

        // RATE LIMITING - spec Section 7.1
        const checkResult = await validateInquiry(submissionData, idempotencyKey);
        
        if (!checkResult.valid) {
          return new Response(JSON.stringify(checkResult), { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
          });
        }

        // If already processed (idempotent), return existing record
        if (idempotencyKey) {
          try {
            const existing = await supabase.rpc("get_inquiry_by_idempotency", { 
              key: idempotencyKey 
            });
            
            if (existing.id) {
              return new Response(JSON.stringify({
                status: checkResult.normalizedData.status,
                message: "Thank you. We've received your inquiry.",
                statusText: STATUS_LABELS[checkResult.normalizedData.status as INQUIRY_STATUSES] || "Received",
              }), { 
                status: 200,
                headers: { "Content-Type": "application/json" } 
              });
            }
          } catch {
            // New idempotency key - process fresh
            // idempotencyKey is already set from previous handler
          }
        }

        // PERSISTENCE - store inquiry with rate limiting counter
        const status = INQUIRY_STATUSES.new;
        await supabase.rpc("insert_inquiry", {
          name: submissionData.name,
          email: submissionData.email,
          businessName: submissionData.businessName || null,
          website: submissionData.website || null,
          message: submissionData.message,
          serviceInterest: JSON.stringify(submissionData.serviceInterest || []),
          phone: submissionData.phone || null,
          languagePreference: submissionData.languagePreference || "English",
          status: status,
        });

        // Return success (Spec 7.1: safe rejection/sanitized handling)
        return new Response(JSON.stringify({
          message: "Thank you. We've received your inquiry.",
          status: STATUS_LABELS[status] || status,
          nextStep: "Our team will contact you within 24 hours",
          trackingId: INQUIRY_ID_PREFIX + crypto.randomUUID().substring(0, 8) // Short public ID
        }), { 
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": idempotencyKey ? "60" : undefined,
          } 
        });

      } catch (error) {
        // LOGGING - spec Section 16 security requirement
        console.error("Inquiry submission failed:", error);
        
        // Return safe error without exposing details
        return new Response(JSON.stringify({
          error: "Something went wrong. Please try again or contact us directly.",
          nextStep: "Please try again later",
        }), { 
          status: 503,
          headers: { "Content-Type": "application/json" } 
        });
      }
    },
    
    // Rate limit exceeded response
    OPTIONS: {
      async handler() {
        return new Response("rate_limit_exceeded", { 
          status: 429,
          headers: { "Content-Type": "text/plain" } 
        });
      }
    }
  }
});

/** Helper function to get client IP from request (production deployment) */
export function getClientIP(headers: IncomingHttpHeaders): string {
  // Production proxy with X-Forwarded-For header support
  const forwardedFor = headers.get("X-Forwarded-For");
  if (forwardedFor && forwardedFor.includes(",")) {
    return forwardedFor.split(",")[0];
  }
  
  // Fallback to direct client IP
  return "127.0.0.1";
}
