import { z } from "zod";
import { AGENT_LIMITS, AGENT_ROLES } from "./roles";

export const agentChatRequestSchema = z
  .object({
    agentRole: z.enum(AGENT_ROLES),
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(AGENT_LIMITS.maxMessageChars),
        }),
      )
      .min(1)
      .max(AGENT_LIMITS.maxMessages),
    /** "summary" asks for an inquiry-ready summary of the conversation so far. */
    task: z.enum(["chat", "summary"]).default("chat"),
    /** Stream newline-delimited JSON (default) or return a single JSON reply. */
    stream: z.boolean().default(true),
  })
  .refine((v) => v.messages.some((m) => m.role === "user"), {
    message: "At least one visitor message is required.",
  })
  .refine((v) => v.task === "summary" || v.messages.at(-1)?.role === "user", {
    message: "The last message must come from the visitor.",
  })
  .refine(
    (v) => v.messages.reduce((n, m) => n + m.content.length, 0) <= AGENT_LIMITS.maxTotalChars,
    { message: "This conversation is too long. Please start a new one." },
  );

export type AgentChatRequest = z.infer<typeof agentChatRequestSchema>;

const PROJECT_ID = "ef607033-0cc6-4e0b-962d-864c8a1293c3";

/** Origins allowed to call the assistant from a browser. */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // same-origin navigations and server-to-server calls send no Origin
  let host: string;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "chbusinessservices.pro" ||
    host === "www.chbusinessservices.pro" ||
    host === "brand-to-business-studio.lovable.app" ||
    // This project's own preview and stable URLs only, not every hosted site.
    ((host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com")) &&
      host.includes(PROJECT_ID))
  );
}
