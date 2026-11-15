import { ArrowDown, ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Monogram } from "./Logo";
import { InquiryForm } from "./InquiryForm";
import {
  ABOUT,
  FAQS,
  PILLARS,
  PROBLEMS,
  PROFESSIONAL_DISCLAIMER,
  SITE,
  STEPS,
} from "@/lib/site";
import { cn } from "@/lib/utils";

const wrap = "mx-auto max-w-7xl px-5 md:px-10";

function SectionLabel({ index, children, dark }: { index: string; children: string; dark?: boolean }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", dark ? "text-ink-muted" : "text-muted-foreground")}>
      <span className={cn("tabular-nums", dark ? "text-ink-foreground" : "text-foreground")}>{index}</span>
      <span aria-hidden className={cn("h-px w-8", dark ? "bg-ink-border" : "bg-border")} />
      {children}
    </p>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative border-b">
      <div className={cn(wrap, "pt-14 pb-0 md:pt-24")}>
        <div className="flex flex-wrap items-center justify-between gap-3 animate-rise">
          <p className="eyebrow text-muted-foreground">{SITE.category}</p>
          <p className="eyebrow hidden text-muted-foreground sm:block">Est. {SITE.established}</p>
        </div>

        <h1
          id="hero-title"
          className="display mt-8 text-[clamp(2.9rem,9vw,7.75rem)] animate-rise [animation-delay:80ms]"
        >
          We build the business{" "}
          <span className="font-serif font-normal italic tracking-[-0.01em]">behind the brand.</span>
        </h1>

        <div className="mt-10 grid gap-10 pb-16 md:mt-14 md:grid-cols-12 md:pb-24 animate-rise [animation-delay:160ms]">
          <p className="text-lg leading-relaxed text-foreground/80 md:col-span-6 md:col-start-7 md:text-xl">
            A clear promise needs a clear way to deliver. CH connects brand strategy with the
            structure behind the client experience.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:col-start-7 md:-mt-4">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <a href="#contact">
                Request a Free 15-Minute Clarity Call
                <ArrowDown aria-hidden />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
              <a href="#services">Explore Our Services</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t">
        <ol className={cn(wrap, "grid grid-cols-2 md:grid-cols-4")}>
          {PILLARS.map((p, i) => (
            <li
              key={p.key}
              className={cn(
                "border-border py-5 md:py-6",
                i % 2 === 1 ? "pl-5 md:pl-6" : "pr-5 md:pr-6",
                i % 2 === 0 && "border-r",
                i < 2 && "border-b md:border-b-0",
                "md:border-r md:px-6 md:first:pl-0 md:last:border-r-0",
              )}
            >
              <p className="eyebrow text-muted-foreground">0{i + 1}</p>
              <p className="mt-2 font-medium tracking-[0.08em]">{p.key}</p>
              <p className="text-sm text-muted-foreground">{p.title.split(" and ")[0]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Statement() {
  return (
    <section aria-label="What CH does" className="border-b bg-muted">
      <div className={cn(wrap, "grid gap-8 py-16 md:grid-cols-12 md:py-24")}>
        <div className="md:col-span-3">
          <Monogram variant="onLight" size={56} />
        </div>
        <p className="display text-[clamp(1.6rem,3.4vw,2.75rem)] leading-[1.18] md:col-span-9">
          {SITE.supporting}
        </p>
      </div>
    </section>
  );
}

export function Problems() {
  return (
    <section id="problems" aria-labelledby="problems-title" className="border-b">
      <div className={cn(wrap, "py-20 md:py-28")}>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel index="01">Recognizable problems</SectionLabel>
            <h2 id="problems-title" className="display mt-6 text-[clamp(2.1rem,4.6vw,3.6rem)]">
              Where does your business feel disconnected?
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground md:col-span-5 md:col-start-8 md:self-end">
            These are common, and none of them mean something is wrong with you. They usually mean
            the business has grown faster than the structure supporting it.
          </p>
        </div>

        <ul className="mt-14 grid border-t border-l md:grid-cols-2">
          {PROBLEMS.map((p, i) => (
            <li
              key={p.title}
              className="group border-r border-b p-7 transition-colors duration-300 hover:bg-muted md:p-10"
            >
              <p className="eyebrow text-muted-foreground">0{i + 1}</p>
              <h3 className="mt-8 text-2xl font-medium leading-snug tracking-[-0.01em] md:text-[1.7rem]">
                {p.title}
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-ink text-ink-foreground">
      <div className={cn(wrap, "py-20 md:py-28")}>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel index="02" dark>
              Services
            </SectionLabel>
            <h2 id="services-title" className="display mt-6 text-[clamp(2.1rem,4.6vw,3.6rem)]">
              Connect the promise with the process.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-ink-muted md:col-span-4 md:col-start-9 md:self-end">
            Four areas of work, each with a clear output you can review—so progress is something you
            can see, not just something you are told.
          </p>
        </div>

        <ul className="mt-14 border-t border-ink-border">
          {PILLARS.map((p, i) => (
            <li
              key={p.key}
              className="grid gap-4 border-b border-ink-border py-9 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div className="md:col-span-3">
                <p className="eyebrow text-ink-muted">0{i + 1}</p>
                <p className="display mt-3 text-4xl tracking-[0.02em] md:text-5xl">{p.key}</p>
              </div>
              <div className="md:col-span-5">
                <h3 className="text-xl font-medium md:text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{p.scope}</p>
              </div>
              <div className="md:col-span-4 md:border-l md:border-ink-border md:pl-8">
                <p className="eyebrow text-ink-muted">Evidence of progress</p>
                <p className="mt-3 leading-relaxed">{p.evidence}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-6 border border-ink-border p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <p className="max-w-2xl text-xl leading-relaxed md:text-2xl">
            Not every engagement needs every phase.{" "}
            <span className="text-ink-muted">
              We identify the starting point before recommending scope.
            </span>
          </p>
          <Button asChild size="xl" variant="inverse" className="w-full shrink-0 md:w-auto">
            <a href="#contact">
              Find your starting point <ArrowRight aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Method() {
  return (
    <section id="method" aria-labelledby="method-title" className="border-b">
      <div className={cn(wrap, "grid gap-14 py-20 md:grid-cols-12 md:py-28")}>
        <div className="md:col-span-5">
          <SectionLabel index="03">Method</SectionLabel>
          <h2 id="method-title" className="display mt-6 text-[clamp(2.1rem,4.6vw,3.6rem)]">
            The CH Trust OS
          </h2>
          <p className="mt-8 space-y-1 text-xl leading-relaxed md:text-2xl">
            {PILLARS.map((p) => (
              <span key={p.key} className="block">
                {p.method}
              </span>
            ))}
          </p>
          <p className="mt-8 max-w-md leading-relaxed text-muted-foreground">
            The four areas are connected, not sequential packages. Clarity informs what needs
            protecting, what is worth showing, and what has to run reliably—so work in one area
            strengthens the others. You start wherever the gap is.
          </p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <div className="grid h-full grid-cols-2 grid-rows-2 border">
              {PILLARS.map((p, i) => (
                <div
                  key={p.key}
                  className={cn(
                    "flex flex-col p-4 transition-colors duration-300 hover:bg-muted sm:p-7",
                    i % 2 === 0 && "border-r",
                    i < 2 && "border-b",
                    i < 2 ? "justify-start" : "justify-end",
                    i % 2 === 1 && "items-end text-right",
                  )}
                >
                  <p className="eyebrow text-muted-foreground">0{i + 1}</p>
                  <p className="mt-2 text-lg font-medium tracking-[0.08em] sm:text-2xl">{p.key}</p>
                  <p className="mt-1 max-w-[11rem] text-sm leading-snug text-muted-foreground sm:text-base">
                    {p.method}
                  </p>
                </div>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="rounded-full bg-background p-2 sm:p-3">
                <Monogram variant="onLight" size={88} className="h-16 w-16 sm:h-[88px] sm:w-[88px]" />
              </div>
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Connected areas, not mandatory packages.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="border-b bg-muted">
      <div className={cn(wrap, "py-20 md:py-28")}>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionLabel index="04">How it works</SectionLabel>
            <h2 id="how-title" className="display mt-6 text-[clamp(2.1rem,4.6vw,3.6rem)]">
              A calm way to begin.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground md:col-span-5 md:col-start-8 md:self-end">
            The introductory call is for understanding, not for selling. A detailed proposal, if
            one makes sense, comes afterward.
          </p>
        </div>

        <ol className="mt-14 grid border-t md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={cn(
                "border-b py-8 md:border-b-0 md:py-10",
                i > 0 && "md:border-l md:pl-7",
                i < 3 && "md:pr-7",
              )}
            >
              <p className="display text-5xl text-stone md:text-6xl">{i + 1}</p>
              <h3 className="mt-6 text-xl font-medium leading-snug">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b">
      <div className={cn(wrap, "grid gap-12 py-20 md:grid-cols-12 md:py-28")}>
        <div className="md:col-span-4">
          <SectionLabel index="05">About</SectionLabel>
          <div className="mt-10 flex aspect-square max-w-[240px] md:max-w-[320px] items-center justify-center border bg-muted">
            <Monogram variant="onLight" size={180} className="h-1/2 w-1/2" alt="CH monogram" />
          </div>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <h2 id="about-title" className="display text-[clamp(2.1rem,4.6vw,3.6rem)]">
            A studio for the structure behind the work.
          </h2>
          <p className="mt-8 text-lg leading-relaxed md:text-xl">{ABOUT.intro}</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">{ABOUT.approach}</p>
          {ABOUT.founderBio.map((para) => (
            <p key={para.slice(0, 24)} className="mt-5 leading-relaxed text-muted-foreground">
              {para}
            </p>
          ))}
          <div className="mt-10 flex items-center gap-4 border-t pt-6">
            <Monogram variant="onLight" size={44} />
            <div>
              <p className="font-medium">{SITE.founder}</p>
              <p className="text-sm text-muted-foreground">Founder, {SITE.name}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-b">
      <div className={cn(wrap, "grid gap-12 py-20 md:grid-cols-12 md:py-28")}>
        <div className="md:col-span-4">
          <SectionLabel index="06">FAQ</SectionLabel>
          <h2 id="faq-title" className="display mt-6 text-[clamp(2.1rem,4.6vw,3.6rem)]">
            Questions, answered plainly.
          </h2>
        </div>
        <div className="md:col-span-8">
          <Accordion type="single" collapsible className="border-t">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`}>
                <AccordionTrigger className="min-h-16 gap-6 py-6 text-left text-lg font-medium hover:no-underline md:text-xl [&>svg]:h-5 [&>svg]:w-5">
                  <span className="flex gap-5">
                    <span className="eyebrow mt-1.5 text-muted-foreground">0{i + 1}</span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-7 pl-0 text-base leading-relaxed text-muted-foreground md:pl-11">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 border-l-2 border-stone bg-muted p-6">
            <p className="eyebrow text-muted-foreground">Please note</p>
            <p className="mt-3 leading-relaxed">{PROFESSIONAL_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-muted">
      <div className={cn(wrap, "grid gap-12 py-20 md:py-28 lg:grid-cols-12")}>
        <div className="lg:col-span-4">
          <SectionLabel index="07">Contact</SectionLabel>
          <h2 id="contact-title" className="display mt-6 text-[clamp(2.1rem,4.6vw,3.6rem)]">
            Request a free 15-minute clarity call.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Tell us a little about your business and what prompted you to reach out. CH will reply
            to arrange a time to talk.
          </p>

          <ul className="mt-10 border-t">
            <li className="border-b">
              <a href={SITE.emailHref} className="group flex min-h-16 items-center gap-4 py-4">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="min-w-0">
                  <span className="eyebrow block text-muted-foreground">Email</span>
                  <span className="link-underline break-all">{SITE.email}</span>
                </span>
              </a>
            </li>
            <li className="border-b">
              <a href={SITE.phoneHref} className="group flex min-h-16 items-center gap-4 py-4">
                <Phone className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                <span>
                  <span className="eyebrow block text-muted-foreground">Phone</span>
                  <span className="link-underline">{SITE.phone}</span>
                </span>
              </a>
            </li>
            {SITE.bookingUrl && (
              <li className="border-b">
                <a
                  href={SITE.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-16 items-center gap-4 py-4"
                >
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                  <span>
                    <span className="eyebrow block text-muted-foreground">Prefer to book directly?</span>
                    <span className="link-underline">Open the booking calendar</span>
                  </span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
