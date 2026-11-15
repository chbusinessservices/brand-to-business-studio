import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — CH Business Services" },
      { name: "description", content: "Choose a new password for your CH owner account." },
      { property: "og:title", content: "Set a new password — CH Business Services" },
      { property: "og:description", content: "Choose a new password for your CH owner account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session && isRecovery) setReady(true);
      else if (s.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <AuthShell>
      <p className="eyebrow text-muted-foreground">CH Business Services</p>
      <h1 className="display mt-4 text-4xl">Set a new password</h1>
      {!ready ? (
        <p className="mt-6 text-muted-foreground">
          Open this page from the reset link in your email. If the link has expired, request a new
          one from the{" "}
          <a href="/auth" className="underline">
            sign-in page
          </a>
          .
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" autoComplete="new-password" className="h-12 text-base" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pw2">Confirm new password</Label>
            <Input id="pw2" type="password" autoComplete="new-password" className="h-12 text-base" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" size="xl" disabled={busy}>
            {busy && <Loader2 className="animate-spin" aria-hidden />} Save password
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
