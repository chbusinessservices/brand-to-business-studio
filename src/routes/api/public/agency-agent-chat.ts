import { createFileRoute } from "@tanstack/react-router";
import { agentChatRequestSchema, isAllowedOrigin } from "@/lib/agent/request-schema";

// Public visitor assistant for the CH Business Services website.
// POST { agentRole, messages, task?, stream? }
//   stream: true (default)  -> application/x-ndjson lines: {"type":"delta","text":"..."} ... {"type":"done"}
//                              or {"type":"error","message":"..."} if the reply fails mid-way
//   stream: false           -> { "reply": "..." }
// Errors before streaming starts -> { "error": "..." } with a 4xx/5xx status.
// Instructions and the AI key never leave the server.

const MODEL = "openai/gpt-6-astra";

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && isAllowedOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function jsonError(message: string, status: number, origin: string | null) {
  return Response.json({ error: message }, { status, headers: corsHeaders(origin) });
}

const FRIENDLY_FAILURE =
  "The assistant isn't available right now. You can still use the inquiry form, or email or call CH directly.";

export const Route = createFileRoute("/api/public/agency-agent-chat")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      },

      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (!isAllowedOrigin(origin)) return jsonError("This origin is not allowed.", 403, origin);

        const contentLength = Number(request.headers.get("content-length") ?? "0");
        if (contentLength > 64_000) return jsonError("Request is too large.", 413, origin);

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return jsonError("Send a JSON body.", 400, origin);
        }
        const parsed = agentChatRequestSchema.safeParse(body);
        if (!parsed.success) {
          return jsonError(parsed.error.issues[0]?.message ?? "Invalid request.", 400, origin);
        }
        const { agentRole, messages, task, stream } = parsed.data;

        const [{ buildSystemPrompt, SUMMARY_INSTRUCTION }, gateway] = await Promise.all([
          import("@/lib/agent/prompts.server"),
          import("@lovable.dev/ai-gateway"),
        ]);

        const input = messages.map((m) => ({ role: m.role, content: m.content }));
        if (task === "summary") input.push({ role: "user", content: SUMMARY_INSTRUCTION });

        const payload = {
          model: MODEL,
          instructions: buildSystemPrompt(agentRole),
          input,
          max_output_tokens: 700,
        } as const;

        const failureStatus = (err: unknown) => {
          if (err instanceof gateway.RateLimitError) return 429;
          if (err instanceof gateway.RequestRejectedError) return 400;
          return 503;
        };
        const failureMessage = (err: unknown) =>
          err instanceof gateway.RateLimitError
            ? "The assistant is busy. Please try again in a minute."
            : FRIENDLY_FAILURE;

        if (!stream) {
          try {
            const res = await gateway.generateResponse(payload);
            let reply = "";
            for (const item of res.output ?? []) {
              if (item.type !== "message") continue;
              for (const part of item.content) {
                if (part.type === "output_text") reply += part.text;
                else if (part.type === "refusal") reply += part.refusal;
              }
            }
            reply = reply.trim();
            if (!reply) return jsonError(FRIENDLY_FAILURE, 502, origin);
            return Response.json({ reply }, { headers: corsHeaders(origin) });
          } catch (err) {
            console.error("[agency-agent-chat] generate failed", err);
            return jsonError(failureMessage(err), failureStatus(err), origin);
          }
        }

        let events: Awaited<ReturnType<typeof gateway.streamResponse<typeof MODEL>>>;
        try {
          events = await gateway.streamResponse(payload, { signal: request.signal });
        } catch (err) {
          console.error("[agency-agent-chat] stream start failed", err);
          return jsonError(failureMessage(err), failureStatus(err), origin);
        }

        const encoder = new TextEncoder();
        const line = (obj: unknown) => encoder.encode(`${JSON.stringify(obj)}\n`);
        const body$ = new ReadableStream<Uint8Array>({
          async start(controller) {
            let sent = false;
            try {
              for await (const event of events) {
                if (event.type === "response.output_text.delta" && event.delta) {
                  sent = true;
                  controller.enqueue(line({ type: "delta", text: event.delta }));
                } else if (event.type === "response.refusal.delta" && event.delta) {
                  sent = true;
                  controller.enqueue(line({ type: "delta", text: event.delta }));
                }
              }
              controller.enqueue(
                sent ? line({ type: "done" }) : line({ type: "error", message: FRIENDLY_FAILURE }),
              );
            } catch (err) {
              if (!request.signal.aborted) {
                console.error("[agency-agent-chat] stream failed", err);
                controller.enqueue(line({ type: "error", message: failureMessage(err) }));
              }
            } finally {
              controller.close();
            }
          },
        });

        return new Response(body$, {
          headers: {
            ...corsHeaders(origin),
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
