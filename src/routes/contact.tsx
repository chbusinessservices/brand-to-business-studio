import { createFileRoute } from "@tanstack/react-router";
import { PageShell, pageHead } from "@/components/site/PageShell";
import { Contact } from "@/components/site/Sections";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("/contact", "Request a Clarity Call", "Send a short inquiry to CH Business Services to arrange a free 15-minute clarity call, or email or call directly."),
  component: () => (
    <PageShell>
      <Contact />
    </PageShell>
  ),
});
