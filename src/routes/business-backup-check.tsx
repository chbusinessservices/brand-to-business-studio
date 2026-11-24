import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NextStep, PageIntro, PageShell, pageHead } from "@/components/site/PageShell";
import { BACKUP_CHECK } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/business-backup-check/")({
  head: () => pageHead("/business-backup-check/", "Business Backup Check", "Eight plain questions to reflect on how much of your business depends on you remembering everything. No sign-up, no score, nothing stored."),
  component: Check,
});

type Answer = "yes" | "partly" | "no";
const CHOICES: { v: Answer; label: string }[] = [
  { v: "yes", label: "Yes" },
  { v: "partly", label: "Partly" },
  { v: "no", label: "Not yet" },
];

function Check() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const open = BACKUP_CHECK.filter((_, i) => answers[i] && answers[i] !== "yes");
  const done = Object.keys(answers).length === BACKUP_CHECK.length;
  return (
    <PageShell>
      <PageIntro
        eyebrow="Business Backup Check"
        title="What would happen if you stepped away for a week?"
        lead="Eight questions for your own reflection. There is no score and no diagnosis, and your answers stay in this browser tab—nothing is saved or sent."
      />
      <section className="border-b">
        <ol className="mx-auto max-w-5xl px-5 py-10 md:px-10">
          {BACKUP_CHECK.map((item, i) => (
            <li key={item.area} className="border-b py-8">
              <fieldset>
                <legend className="w-full">
                  <span className="eyebrow text-muted-foreground">0{i + 1} · {item.area}</span>
                  <span className="mt-3 block text-lg font-medium">{item.q}</span>
                </legend>
                <div className="mt-5 flex flex-wrap gap-2">
                  {CHOICES.map((c) => (
                    <label key={c.v} className={cn("cursor-pointer border px-5 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", answers[i] === c.v ? "border-foreground bg-foreground text-background" : "hover:border-foreground")}>
                      <input type="radio" name={`q${i}`} value={c.v} checked={answers[i] === c.v} onChange={() => setAnswers((a) => ({ ...a, [i]: c.v }))} className="sr-only" />
                      {c.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>
      </section>
      <section aria-live="polite" className="border-b bg-muted">
        <div className="mx-auto max-w-5xl px-5 py-12 md:px-10">
          <h2 className="text-2xl font-medium">Your reflection</h2>
          {open.length === 0 ? (
            <p className="mt-4 text-muted-foreground">{done ? "You answered yes to every question. Worth checking whether a colleague would answer the same way." : "Answer the questions above to see which areas you might want to look at first."}</p>
          ) : (
            <>
              <p className="mt-4 text-muted-foreground">Areas you marked as partly or not yet in place—these are prompts for thought, not a rating:</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">{open.map((o) => <li key={o.area} className="border bg-background px-4 py-3">{o.area}</li>)}</ul>
            </>
          )}
          {Object.keys(answers).length > 0 && (
            <button type="button" onClick={() => setAnswers({})} className="link-underline mt-8 text-sm">Clear my answers</button>
          )}
        </div>
      </section>
      <NextStep title="Want to talk one of these through?" />
    </PageShell>
  );
}
