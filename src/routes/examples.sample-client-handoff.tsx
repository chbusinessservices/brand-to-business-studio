import { createFileRoute } from "@tanstack/react-router";
import { NextStep, PageIntro, PageShell, Prose, ProseSection, pageHead } from "@/components/site/PageShell";

export const Route = createFileRoute("/examples/sample-client-handoff")({
  head: () => pageHead("/examples/sample-client-handoff", "Sample Client Handoff (Illustrative)", "An illustrative handoff document for a fictional cleaning business, showing the format CH uses. Not a real client or result.", "article"),
  component: Sample,
});

const ROWS = [
  ["New request arrives", "Website form", "Owner", "Reply the same working day"],
  ["Quote sent", "Written quote template", "Owner", "Within two working days of the walkthrough"],
  ["First visit confirmed", "Welcome message", "Owner", "Two days before the visit"],
  ["Follow-up", "Check-in message", "Owner", "Three days after the visit"],
];

function Sample() {
  return (
    <PageShell>
      <div role="note" className="border-b bg-muted">
        <p className="mx-auto max-w-7xl px-5 py-4 text-sm md:px-10">
          <strong>Illustrative sample.</strong> "Maple Street Cleaning" is fictional. This shows the format of a handoff, not a real client, result or recommendation.
        </p>
      </div>
      <PageIntro eyebrow="Illustrative sample" title="Client handoff: Maple Street Cleaning" lead="The one-page record a business owner keeps once setup work is finished." />
      <Prose>
        <ProseSection title="What was agreed">
          <p>A clear offer description, a single request form on the website, and a written path from first request to follow-up.</p>
        </ProseSection>
        <ProseSection title="Client journey">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead><tr className="border-b">{["Step", "Tool", "Owner", "Timing (sample)"].map((h) => <th key={h} className="py-2 pr-4 font-medium">{h}</th>)}</tr></thead>
              <tbody>{ROWS.map((r) => <tr key={r[0]} className="border-b">{r.map((c) => <td key={c} className="py-3 pr-4">{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </ProseSection>
        <ProseSection title="Responsibilities">
          <p><strong>Owner:</strong> pricing, approvals, customer communication, accuracy of information.</p>
          <p><strong>CH:</strong> the agreed setup work, documented and handed over.</p>
          <p><strong>Another professional:</strong> insurance, contracts and tax questions, listed for the owner to take to a licensed advisor.</p>
        </ProseSection>
        <ProseSection title="Open items">
          <p>Example only: confirm liability insurance wording with an insurance professional.</p>
        </ProseSection>
      </Prose>
      <NextStep />
    </PageShell>
  );
}
