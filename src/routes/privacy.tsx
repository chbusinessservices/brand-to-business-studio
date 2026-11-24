import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE } from "@/lib/site";

const TITLE = "Privacy information — CH Business Services";
const DESCRIPTION =
  "How CH Business Services handles the information you share through the website inquiry form, booking link, and site analytics.";

export const Route = createFileRoute("/privacy/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t py-10 md:grid-cols-12 md:gap-8">
      <h2 className="text-xl font-medium md:col-span-4">{title}</h2>
      <div className="space-y-4 leading-relaxed text-foreground/85 md:col-span-8">{children}</div>
    </section>
  );
}

function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-14 md:px-10 md:py-20">
        <div role="note" className="border-l-2 border-stone bg-muted p-5 text-sm leading-relaxed">
          <p className="eyebrow text-muted-foreground">Draft — requires owner review</p>
          <p className="mt-2">
            This privacy information is a working draft prepared from how the website is currently
            built. It must be reviewed and approved by the owner—and ideally by a qualified
            professional—before it is relied on. It does not claim compliance with any specific law.
          </p>
        </div>

        <p className="eyebrow mt-12 text-muted-foreground">Privacy information</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">How we handle your information</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          This page explains what {SITE.name} collects through {SITE.domain}, why, and who else is
          involved in providing the website.
        </p>

        <div className="mt-12">
          <Section title="Who we are">
            <p>
              {SITE.name} is a brand architecture and business systems studio. For any privacy
              question or request, contact{" "}
              <a href={SITE.emailHref} className="underline">{SITE.email}</a> or call{" "}
              <a href={SITE.phoneHref} className="underline">{SITE.phone}</a>.
            </p>
          </Section>

          <Section title="Information you send through the inquiry form">
            <p>When you submit the contact form, we store:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Your name, email address, and business name</li>
              <li>Your website, if you provide it</li>
              <li>What prompted you to reach out, and any services you selected</li>
              <li>The date and time of the submission</li>
            </ul>
            <p>
              To prevent spam and repeated automated submissions, we also store a one-way hashed
              value derived from your network (IP) address. The hash is used only to limit how many
              inquiries can be sent in a short period; we do not store your IP address itself.
            </p>
            <p>
              We use this information only to respond to your inquiry and to manage our
              conversation with you. We do not sign you up for newsletters or marketing emails. If
              that ever changes, we will ask for your separate consent first.
            </p>
          </Section>

          <Section title="Where it is stored and who can see it">
            <p>
              Inquiries are stored in a hosted database provided through Lovable Cloud. Access to
              submitted inquiries is limited to authorized {SITE.name} accounts. Website visitors
              cannot view, change, or delete other people’s inquiries.
            </p>
            <p>
              <strong className="font-medium">Retention:</strong> Inquiries are currently kept
              until you ask us to delete them or {SITE.name} removes them; there is no automatic
              deletion. You may ask us to delete your inquiry at any time by emailing {SITE.email}.
            </p>
          </Section>

          <Section title="Website assistant">
            <p>
              The home page offers an optional AI assistant that answers questions about our
              services. What you type is sent, together with the conversation so far, to an AI model
              provided through Lovable’s AI service to generate a reply. We use a model whose
              provider does not retain this content after replying; Lovable’s own handling is
              described in its privacy policy linked below.
            </p>
            <p>
              {SITE.name} does not save these conversations, and they are not sent to us. Nothing
              reaches {SITE.name} unless you choose to copy a summary into the inquiry form and
              submit it. Please do not enter passwords, financial details, or other sensitive
              information in the assistant.
            </p>
          </Section>

          <Section title="Booking link">
            <p>
              If you choose to schedule a clarity call, you will be taken to our external booking
              page, provided by Zoho Bookings. Information you enter there is collected and handled
              by that service under its own privacy terms. Submitting our inquiry form does not
              book an appointment.
            </p>
          </Section>

          <Section title="Site analytics">
            <p>
              The website uses Lovable’s built-in visitor analytics to understand how the site is
              used. It records the pages visited, where visitors came from, their country, browser,
              operating system and device type, how long they stay, how fast pages load, errors, and
              which buttons and links are clicked.
            </p>
            <p>
              This analytics uses no cookies, stores nothing on your device, does not keep IP
              addresses, and does not identify individual visitors. Detailed data is kept for 90
              days and daily summaries for a year. Lovable collects this data for us.{" "}
              <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                Lovable’s privacy policy
              </a>{" "}
              explains how it handles it. The site currently has no cookie banner, so this is
              recorded for every visitor.
            </p>
          </Section>

          <Section title="Cookies and local storage">
            <p>
              Public pages of this website do not set advertising or tracking cookies. The website’s
              hosting may set short-lived technical cookies—for example to route your visit to the
              current version of the site or to filter automated traffic. They are not used for
              advertising or to build a profile of you. If an
              authorized owner signs in to the private dashboard, the sign-in session is kept in
              that browser’s local storage so they stay signed in. Visitors who never sign in are
              not affected.
            </p>
          </Section>

          <Section title="Other services used to show the site">
            <p>
              The website’s typefaces are loaded from Google Fonts, which means your browser
              requests font files from Google’s servers, and Google receives your IP address as part
              of that request. Email and phone links open your own email or phone app.
            </p>
            <p>
              Owners may sign in with Google or Lovable accounts; this affects only people signing
              in to the private dashboard.
            </p>
          </Section>

          <Section title="Professional advice">
            <p>
              {SITE.name}’s coordination and operational consulting do not replace advice from
              appropriately licensed legal, tax, accounting, or other professionals.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              Draft prepared November 17, 2026. We will update this page if the way the website
              collects information changes.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
