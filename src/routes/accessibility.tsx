import { createFileRoute } from "@tanstack/react-router";
import { DraftNote, PageShell, Prose, ProseSection, pageHead } from "@/components/site/PageShell";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/accessibility/")({
  head: () => pageHead("/accessibility/", "Accessibility", "The accessibility work done on the CH Business Services website, known limitations, and how to ask for help.", "article"),
  component: () => (
    <PageShell>
      <Prose>
        <DraftNote />
        <p className="eyebrow text-muted-foreground">Accessibility</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">Accessibility information</h1>
        <div className="mt-12">
          <ProseSection title="What we have done"><p>Pages use headings in order, labelled form fields, a skip-to-content link, visible keyboard focus, and text with strong contrast. Layouts were checked on phone, tablet and desktop sizes.</p></ProseSection>
          <ProseSection title="Known limitations"><p>The site has not had an independent accessibility audit, and we do not claim conformance with any specific standard. The external booking calendar is provided by another company and may behave differently.</p></ProseSection>
          <ProseSection title="Need another way?"><p>If anything is hard to use, email <a className="link-underline" href={SITE.emailHref}>{SITE.email}</a> or call <a className="link-underline" href={SITE.phoneHref}>{SITE.phone}</a> and we will help another way.</p></ProseSection>
        </div>
      </Prose>
    </PageShell>
  ),
});
