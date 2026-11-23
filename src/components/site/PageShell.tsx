import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AssistantWidget } from "./AssistantWidget";
import { LEGAL_DRAFT_NOTE, SITE } from "@/lib/site";

const ORIGIN = "https://brand-to-business-studio.lovable.app";

/** Per-page head metadata: unique title/description, self-referencing canonical. */
export function pageHead(path: string, title: string, description: string, type = "website") {
  const full = `${title} — ${SITE.name}`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: `${ORIGIN}${path}` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}${path}` }],
  };
}

export function PageShell({ children, assistant = true }: { children: ReactNode; assistant?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      {assistant && <AssistantWidget />}
    </div>
  );
}

export function PageIntro({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-5 pt-14 pb-14 md:px-10 md:pt-24 md:pb-20">
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <h1 className="display mt-6 max-w-5xl text-[clamp(2.5rem,6.5vw,5.5rem)]">{title}</h1>
        {lead && (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">{lead}</p>
        )}
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-5xl px-5 py-14 md:px-10 md:py-20">{children}</div>;
}

export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t py-10 md:grid-cols-12 md:gap-8">
      <h2 className="text-xl font-medium md:col-span-4">{title}</h2>
      <div className="space-y-4 leading-relaxed text-foreground/85 md:col-span-8">{children}</div>
    </section>
  );
}

export function DraftNote() {
  return (
    <div role="note" className="mb-12 border-l-2 border-stone bg-muted p-5 text-sm leading-relaxed">
      <p className="eyebrow text-muted-foreground">Draft — requires owner review</p>
      <p className="mt-2">{LEGAL_DRAFT_NOTE}</p>
    </div>
  );
}

export function NextStep({ title = "Not sure where to start?" }: { title?: string }) {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-10 md:py-20">
        <div>
          <h2 className="display text-[clamp(2rem,4.2vw,3.2rem)]">{title}</h2>
          <p className="mt-4 max-w-xl text-ink-muted">
            A free 15-minute clarity call is a conversation, not a pitch. You leave with a sensible next step—or none.
          </p>
        </div>
        <a
          href="/contact"
          className="inline-flex h-14 shrink-0 items-center justify-center border border-ink-foreground px-7 font-medium transition-colors hover:bg-ink-foreground hover:text-ink"
        >
          Request a Free 15-Minute Clarity Call
        </a>
      </div>
    </section>
  );
}
