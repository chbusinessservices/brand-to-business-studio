import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Check, ClipboardCopy, FileText, Loader2, MessageSquareText, RotateCcw, Square } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AGENT_LIMITS,
  AGENT_ROLES,
  AGENT_ROLE_INFO,
  PREFILL_INQUIRY_EVENT,
  type AgentRole,
  type PrefillInquiryDetail,
} from "@/lib/agent/roles";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };
type StreamLine = { type: "delta"; text: string } | { type: "done" } | { type: "error"; message: string };

const ENDPOINT = "/api/public/agency-agent-chat";
const FALLBACK_ERROR =
  "The assistant isn't available right now. You can still use the inquiry form, or email or call CH directly.";

/** POST to the assistant and feed streamed text to onDelta. Resolves with the full text. */
async function streamAgent(
  body: { agentRole: AgentRole; messages: ChatMessage[]; task?: "chat" | "summary" },
  onDelta: (full: string) => void,
  signal: AbortSignal,
): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? FALLBACK_ERROR);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const raw = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!raw) continue;
      const line = JSON.parse(raw) as StreamLine;
      if (line.type === "delta") {
        full += line.text;
        onDelta(full);
      } else if (line.type === "error") {
        throw new Error(line.message);
      }
    }
  }
  if (!full.trim()) throw new Error(FALLBACK_ERROR);
  return full;
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<AgentRole>("intake-guide");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<null | "chat" | "summary">(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, summary, pending, error]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const info = AGENT_ROLE_INFO[role];
  const userCount = messages.filter((m) => m.role === "user").length;
  const atLimit = messages.length >= AGENT_LIMITS.maxMessages - 1;

  async function send(text: string) {
    const content = text.trim().slice(0, AGENT_LIMITS.maxMessageChars);
    if (!content || pending) return;
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setError(null);
    setPending("chat");
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const reply = await streamAgent({ agentRole: role, messages: history }, (full) => {
        setMessages([...history, { role: "assistant", content: full }]);
      }, ac.signal);
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (err) {
      if (ac.signal.aborted) {
        // Keep whatever arrived; drop an empty reply bubble.
        setMessages((prev) => (prev.at(-1)?.content ? prev : history));
      } else {
        setMessages(history);
        setError(err instanceof Error ? err.message : FALLBACK_ERROR);
      }
    } finally {
      setPending(null);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  async function summarize() {
    if (pending || userCount === 0) return;
    setError(null);
    setSummary("");
    setPending("summary");
    const ac = new AbortController();
    abortRef.current = ac;
    const history = messages.filter((m) => m.content.trim());
    try {
      const text = await streamAgent(
        { agentRole: role, messages: history, task: "summary" },
        (full) => setSummary(full),
        ac.signal,
      );
      setSummary(text.trim());
    } catch (err) {
      setSummary(null);
      if (!ac.signal.aborted) setError(err instanceof Error ? err.message : FALLBACK_ERROR);
    } finally {
      setPending(null);
      abortRef.current = null;
    }
  }

  function addSummaryToForm() {
    if (!summary) return;
    window.dispatchEvent(
      new CustomEvent<PrefillInquiryDetail>(PREFILL_INQUIRY_EVENT, {
        detail: { message: summary.slice(0, 2000) },
      }),
    );
    setOpen(false);
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  }

  async function copySummary() {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; the text stays selectable */
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setSummary(null);
    setError(null);
    setDraft("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed bottom-4 left-4 z-40 inline-flex h-11 items-center gap-2 border border-foreground bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 print:hidden md:bottom-6 md:left-6"
      >
        <MessageSquareText className="h-4 w-4" aria-hidden />
        <span>Ask a question</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <SheetHeader className="space-y-1 border-b px-5 pb-4 pt-5 text-left">
            <p className="eyebrow text-muted-foreground">CH guide · AI assistant</p>
            <SheetTitle className="display text-2xl font-normal">How can we help?</SheetTitle>
            <SheetDescription className="text-sm leading-relaxed">
              Answers come from an AI, not a person, and nothing here is sent to CH unless you use
              the inquiry form. Please don't share passwords or financial details.
            </SheetDescription>
          </SheetHeader>

          <div role="radiogroup" aria-label="Choose a guide" className="grid grid-cols-3 border-b">
            {AGENT_ROLES.map((r) => {
              const selected = r === role;
              return (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={pending !== null}
                  onClick={() => setRole(r)}
                  className={cn(
                    "border-r px-2 py-3 text-xs font-medium leading-tight transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-60 sm:text-[0.8rem]",
                    selected ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {AGENT_ROLE_INFO[r].label}
                </button>
              );
            })}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5" aria-live="polite" aria-busy={pending !== null}>
            <p className="text-sm text-muted-foreground">{info.blurb}</p>

            {messages.length === 0 && (
              <div className="mt-4 grid gap-2">
                {info.starters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="border px-3 py-2.5 text-left text-sm transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <ol className="mt-4 grid gap-4">
              {messages.map((m, i) => (
                <li key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[88%] text-[0.95rem] leading-relaxed",
                      m.role === "user" ? "bg-foreground px-3.5 py-2.5 text-background" : "border-l-2 border-stone pl-3.5",
                    )}
                  >
                    <span className="sr-only">{m.role === "user" ? "You said:" : "Guide replied:"}</span>
                    {m.role === "assistant" ? (
                      m.content ? (
                        <AssistantMarkdown text={m.content} />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Writing a reply" />
                      )
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {summary !== null && (
              <section aria-label="Inquiry summary" className="mt-6 border border-foreground p-4">
                <p className="eyebrow flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" aria-hidden /> Your summary
                </p>
                {summary ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{summary}</p>
                ) : (
                  <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground" aria-label="Writing summary" />
                )}
                {summary && pending === null && (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" size="sm" onClick={addSummaryToForm}>
                        Add to inquiry form
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={copySummary}>
                        {copied ? <Check aria-hidden /> : <ClipboardCopy aria-hidden />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Review and edit it in the form before sending. Adding it does not send anything.
                    </p>
                  </>
                )}
              </section>
            )}

            {error && (
              <div role="alert" className="mt-5 border border-destructive/40 p-3 text-sm">
                <p className="text-destructive">{error}</p>
                <p className="mt-2 text-muted-foreground">
                  <a className="underline" href={SITE.emailHref}>{SITE.email}</a> ·{" "}
                  <a className="underline" href={SITE.phoneHref}>{SITE.phone}</a>
                </p>
              </div>
            )}
          </div>

          <div className="border-t px-5 pb-5 pt-3">
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <button
                type="button"
                onClick={summarize}
                disabled={userCount === 0 || pending !== null}
                className="link-underline font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                Turn this into an inquiry summary
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden /> Start over
                </button>
              )}
            </div>

            {atLimit ? (
              <p className="text-sm text-muted-foreground">
                This conversation is at its length limit. Create a summary or start over.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(draft);
                }}
                className="flex items-end gap-2"
              >
                <label htmlFor="ch-assistant-input" className="sr-only">
                  Your question for the {info.label}
                </label>
                <Textarea
                  id="ch-assistant-input"
                  ref={inputRef}
                  rows={2}
                  maxLength={AGENT_LIMITS.maxMessageChars}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void send(draft);
                    }
                  }}
                  placeholder="Type your question…"
                  className="min-h-[52px] resize-none text-base"
                />
                {pending ? (
                  <Button type="button" size="icon" variant="outline" onClick={() => abortRef.current?.abort()} aria-label="Stop">
                    <Square aria-hidden />
                  </Button>
                ) : (
                  <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send question">
                    <ArrowUp aria-hidden />
                  </Button>
                )}
              </form>
            )}

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Ready to talk?{" "}
              {SITE.bookingUrl && (
                <>
                  <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    Book a clarity call
                  </a>
                  {" · "}
                </>
              )}
              <a href={SITE.emailHref} className="underline">Email</a>
              {" · "}
              <a href={SITE.phoneHref} className="underline">{SITE.phone}</a>
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function AssistantMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
            {children}
          </a>
        ),
        h1: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
        h2: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
        h3: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
        img: () => null,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
