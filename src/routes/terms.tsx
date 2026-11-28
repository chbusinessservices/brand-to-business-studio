import { createFileRoute } from "@tanstack/react-router";
import { DraftNote, PageShell, Prose, ProseSection, pageHead } from "@/components/site/PageShell";
import { PROFESSIONAL_DISCLAIMER, SITE } from "@/lib/site";

export const Route = createFileRoute("/terms/")({
  head: () => pageHead("/terms/", "Website Terms", "Draft terms for using the CH Business Services website. These do not replace a written service agreement.", "article"),
  component: () => (
    <PageShell>
      <Prose>
        <DraftNote />
        <p className="eyebrow text-muted-foreground">Website terms</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">Using this website</h1>
        <div className="mt-12">
          <ProseSection title="What these cover"><p>These terms cover use of {SITE.domain}. They are not a service agreement. Any paid work is governed by a separate written scope and agreement you review before it starts.</p></ProseSection>
          <ProseSection title="Information on this site"><p>Content describes how CH typically works. It is general information, not a promise of any result, and may change. Examples are labelled; illustrative samples are not client results.</p></ProseSection>
          <ProseSection title="Professional advice"><p>{PROFESSIONAL_DISCLAIMER}</p></ProseSection>
          <ProseSection title="Inquiries and the assistant"><p>Sending an inquiry does not create an engagement or book an appointment. The website assistant gives general guidance only and can be wrong; check anything important with CH directly.</p></ProseSection>
          <ProseSection title="Acceptable use"><p>Please do not misuse the forms, attempt to access private areas, or submit content that is unlawful or not yours to share.</p></ProseSection>
          <ProseSection title="Contact"><p><a className="link-underline" href={SITE.emailHref}>{SITE.email}</a> · <a className="link-underline" href={SITE.phoneHref}>{SITE.phone}</a></p></ProseSection>
        </div>
      </Prose>
    </PageShell>
  ),
});
