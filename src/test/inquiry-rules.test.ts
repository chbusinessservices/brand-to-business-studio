import { describe, expect, it } from "vitest";
import {
  checkSpamSignals,
  inquiryFieldsSchema,
  isRateLimited,
  normalizeWebsite,
} from "@/lib/inquiry-schema";

const valid = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  businessName: "Lee Studio",
  message: "Our onboarding changes every time.",
  serviceInterest: ["SYSTEM"],
};

describe("inquiry form rules", () => {
  it("accepts a complete inquiry without a website", () => {
    expect(inquiryFieldsSchema.safeParse(valid).success).toBe(true);
  });

  it("requires name, email, business name and message", () => {
    for (const key of ["name", "email", "businessName", "message"] as const) {
      expect(inquiryFieldsSchema.safeParse({ ...valid, [key]: "" }).success).toBe(false);
    }
  });

  it("rejects an invalid email", () => {
    expect(inquiryFieldsSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("only allows CODE, SHIELD, SIGNAL, SYSTEM and General Inquiry as service interests", () => {
    expect(
      inquiryFieldsSchema.safeParse({ ...valid, serviceInterest: ["CODE", "General Inquiry"] }).success,
    ).toBe(true);
    expect(inquiryFieldsSchema.safeParse({ ...valid, serviceInterest: ["COURSES"] }).success).toBe(false);
  });

  it("rejects messages over 2000 characters", () => {
    expect(inquiryFieldsSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false);
  });

  it("adds https:// to a bare website", () => {
    expect(normalizeWebsite("example.com")).toBe("https://example.com");
  });
});

describe("spam protection", () => {
  it("rejects a filled honeypot", () => {
    expect(checkSpamSignals({ company: "Acme", elapsedMs: 10_000 }).allowed).toBe(false);
  });

  it("rejects submissions made in under 3 seconds", () => {
    expect(checkSpamSignals({ company: "", elapsedMs: 2999 }).allowed).toBe(false);
    expect(checkSpamSignals({ company: "", elapsedMs: 3000 }).allowed).toBe(true);
  });

  it("limits to 3 per network per hour and 3 per email per day", () => {
    expect(isRateLimited({ ipLastHour: 2, emailLastDay: 2 })).toBe(false);
    expect(isRateLimited({ ipLastHour: 3, emailLastDay: 0 })).toBe(true);
    expect(isRateLimited({ ipLastHour: 0, emailLastDay: 3 })).toBe(true);
  });
});
