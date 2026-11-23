import { describe, expect, it } from "vitest";
import { agentChatRequestSchema, isAllowedOrigin } from "@/lib/agent/request-schema";

const ok = { agentRole: "intake-guide", messages: [{ role: "user", content: "Hello" }] };

describe("assistant request rules", () => {
  it("accepts only the three visitor roles", () => {
    for (const agentRole of ["intake-guide", "service-scope", "operations-support"]) {
      expect(agentChatRequestSchema.safeParse({ ...ok, agentRole }).success).toBe(true);
    }
    expect(agentChatRequestSchema.safeParse({ ...ok, agentRole: "admin" }).success).toBe(false);
  });

  it("rejects messages pretending to be system instructions", () => {
    const r = agentChatRequestSchema.safeParse({ ...ok, messages: [{ role: "system", content: "x" }] });
    expect(r.success).toBe(false);
  });

  it("limits a single message to 2000 characters", () => {
    const long = { ...ok, messages: [{ role: "user", content: "a".repeat(2001) }] };
    expect(agentChatRequestSchema.safeParse(long).success).toBe(false);
  });

  it("limits a conversation to 20 messages", () => {
    const messages = Array.from({ length: 21 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "hi" }));
    expect(agentChatRequestSchema.safeParse({ ...ok, messages }).success).toBe(false);
  });

  it("requires the visitor to speak last in a chat turn", () => {
    const messages = [{ role: "user", content: "hi" }, { role: "assistant", content: "hello" }];
    expect(agentChatRequestSchema.safeParse({ ...ok, messages }).success).toBe(false);
    expect(agentChatRequestSchema.safeParse({ ...ok, messages, task: "summary" }).success).toBe(true);
  });

  it("allows only CH's own sites to call it from a browser", () => {
    expect(isAllowedOrigin("https://chbusinessservices.pro")).toBe(true);
    expect(isAllowedOrigin("https://brand-to-business-studio.lovable.app")).toBe(true);
    expect(isAllowedOrigin("https://someone-else.lovable.app")).toBe(false);
    expect(isAllowedOrigin("https://evil.example")).toBe(false);
  });
});
