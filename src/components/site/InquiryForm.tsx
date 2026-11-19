import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { inquiryFieldsSchema } from "@/lib/inquiry-schema";
import { submitInquiry } from "@/lib/inquiries.functions";
import { SERVICE_OPTIONS, SITE } from "@/lib/site";
import { PREFILL_INQUIRY_EVENT, type PrefillInquiryDetail } from "@/lib/agent/roles";
import { cn } from "@/lib/utils";

const SERVICE_HINTS: Record<(typeof SERVICE_OPTIONS)[number], string> = {
  CODE: "Brand clarity",
  SHIELD: "Responsibilities",
  SIGNAL: "Website & presence",
  SYSTEM: "Client experience",
  "General Inquiry": "Not sure yet",
};

type Phase = { kind: "idle" } | { kind: "error"; message: string } | { kind: "success" };

export function InquiryForm() {
  const submit = useServerFn(submitInquiry);
  const startedAt = useRef<number>(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const successRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    resolver: zodResolver(inquiryFieldsSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      website: "",
      message: "",
      serviceInterest: [],
    },
    mode: "onTouched",
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (phase.kind === "success") successRef.current?.focus();
  }, [phase.kind]);

  // The site assistant can hand over a visitor-approved summary for the message field.
  useEffect(() => {
    function onPrefill(e: Event) {
      const message = (e as CustomEvent<PrefillInquiryDetail>).detail?.message?.trim();
      if (!message) return;
      setPhase({ kind: "idle" });
      startedAt.current = Date.now();
      // Wait for the form to be visible again if it was showing the success screen.
      window.setTimeout(() => {
        form.setValue("message", message.slice(0, 2000), { shouldDirty: true, shouldValidate: true });
        form.setFocus("message");
      }, 0);
    }
    window.addEventListener(PREFILL_INQUIRY_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_INQUIRY_EVENT, onPrefill);
  }, [form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setPhase({ kind: "idle" });
    try {
      const result = await submit({
        data: {
          ...values,
          company: honeypot.current?.value ?? "",
          elapsedMs: Math.max(0, Date.now() - startedAt.current),
        },
      });
      if (result.ok) {
        setPhase({ kind: "success" });
        form.reset();
      } else {
        setPhase({ kind: "error", message: result.message });
      }
    } catch (err) {
      console.error(err);
      setPhase({
        kind: "error",
        message:
          "We couldn't confirm that your inquiry was sent. Please try again, or contact us directly.",
      });
    }
  });

  if (phase.kind === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="border border-foreground bg-background p-7 outline-none md:p-10"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="display mt-6 text-3xl md:text-4xl">Thank you.</h3>
        <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed">
          Your inquiry has been received. CH will contact you to discuss the next step.
        </p>

        {SITE.bookingUrl && (
          <div className="mt-8 border-t pt-8">
            <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
              Want to secure a time right away? Schedule directly on our calendar:
            </p>
            <Button asChild size="xl" className="mt-5 w-full sm:w-auto">
              <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book 15-Minute Clarity Call
                <ArrowUpRight aria-hidden />
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Opens our booking calendar in a new tab. Your inquiry stays on file either way.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setPhase({ kind: "idle" });
          }}
          className="link-underline mt-8 text-sm text-muted-foreground"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const isSubmitting = form.formState.isSubmitting;
  const messageLength = form.watch("message")?.length ?? 0;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate className="border bg-background p-6 md:p-10" aria-describedby="form-note">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" className="h-12 text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business name</FormLabel>
                <FormControl>
                  <Input autoComplete="organization" className="h-12 text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Website <span className="font-normal text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="url"
                    autoComplete="url"
                    placeholder="yourbusiness.com"
                    className="h-12 text-base"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>What prompted you to reach out?</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className="min-h-[140px] text-base"
                  placeholder="A few sentences is plenty—what feels disconnected right now?"
                  {...field}
                />
              </FormControl>
              <div className="flex items-start justify-between gap-4">
                <FormMessage />
                <span
                  className={cn(
                    "ml-auto shrink-0 text-xs tabular-nums text-muted-foreground",
                    messageLength > 2000 && "text-destructive",
                  )}
                >
                  {messageLength}/2000
                </span>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceInterest"
          render={({ field }) => {
            const selected = (field.value ?? []) as string[];
            return (
              <FormItem className="mt-6">
                <p id="service-interest-label" className="text-sm font-medium leading-none">
                  Service interest{" "}
                  <span className="font-normal text-muted-foreground">(optional, choose any)</span>
                </p>
                <div role="group" aria-labelledby="service-interest-label" className="flex flex-wrap gap-2 pt-1">
                  {SERVICE_OPTIONS.map((opt) => {
                    const active = selected.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          field.onChange(
                            active ? selected.filter((s) => s !== opt) : [...selected, opt],
                          )
                        }
                        className={cn(
                          "group flex min-h-11 items-center gap-2 border px-4 py-2 text-left text-sm transition-colors",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-input hover:border-foreground",
                        )}
                      >
                        <span className="font-medium tracking-wide">{opt}</span>
                        <span
                          className={cn(
                            "text-xs",
                            active ? "text-background/70" : "text-muted-foreground",
                          )}
                        >
                          {SERVICE_HINTS[opt]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FormDescription>Not sure? Leave this blank—we'll figure it out together.</FormDescription>
              </FormItem>
            );
          }}
        />

        {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {phase.kind === "error" && (
          <div
            role="alert"
            className="mt-6 flex gap-3 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <p>{phase.message}</p>
              <p className="mt-1">
                You can also reach us at{" "}
                <a href={SITE.emailHref} className="underline">
                  {SITE.email}
                </a>{" "}
                or{" "}
                <a href={SITE.phoneHref} className="underline">
                  {SITE.phone}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p id="form-note" className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            We use these details only to respond to your inquiry. See our{" "}
            <a href="/privacy" className="underline">
              privacy information
            </a>
            .
          </p>
          <Button type="submit" size="xl" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden /> Sending…
              </>
            ) : (
              "Send Inquiry"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
