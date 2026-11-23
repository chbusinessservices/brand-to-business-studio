import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import "@lovable.dev/cloud-auth-js/styles.css";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AuthShell, GoogleIcon } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Owner sign-in — CH Business Services" },
      { name: "description", content: "Sign in to the CH Business Services owner workspace." },
      { property: "og:title", content: "Owner sign-in — CH Business Services" },
      { property: "og:description", content: "Sign in to the CH Business Services owner workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

const credsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setNotice(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (mode === "forgot") {
      const parsed = z.string().trim().email().safeParse(email);
      if (!parsed.success) return setError("Enter a valid email address");
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (error) return setError(error.message);
      return setNotice("If an account exists for that email, a reset link is on its way.");
    }

    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check your details");

    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      setBusy(false);
      if (error) return setError(error.message === "Invalid login credentials" ? "Email or password is incorrect." : error.message);
      navigate({ to: "/dashboard", replace: true });
    } else {
      const { data, error } = await supabase.auth.signUp({
        ...parsed.data,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      setBusy(false);
      if (error) return setError(error.message);
      if (data.session) navigate({ to: "/dashboard", replace: true });
      else setNotice("Check your inbox and confirm your email to finish creating your account.");
    }
  }

  async function oauth(provider: "google" | "lovable") {
    setError(null);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/auth`,
    });
    if (result.error) return setError(result.error.message ?? "Sign-in failed. Please try again.");
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  const title =
    mode === "signin" ? "Owner sign-in" : mode === "signup" ? "Create an account" : "Reset your password";

  return (
    <AuthShell>
      <p className="eyebrow text-muted-foreground">CH Business Services</p>
      <h1 className="display mt-4 text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">
        {mode === "forgot"
          ? "Enter your email and we'll send a link to set a new password."
          : "The inquiry dashboard is available only to authorized CH accounts."}
      </p>

      {notice ? (
        <div role="status" className="mt-8 flex gap-3 border border-foreground p-5">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div>
            <p>{notice}</p>
            <button type="button" onClick={() => switchMode("signin")} className="link-underline mt-3 text-sm text-muted-foreground">
              Back to sign in
            </button>
          </div>
        </div>
      ) : (
        <>
          {mode !== "forgot" && (
            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={() => oauth("google")}
                className="flex h-12 w-full items-center justify-center gap-[10px] border border-[#747775] bg-[#FFFFFF] px-3 text-sm font-medium text-[#1F1F1F] transition-colors hover:bg-[#F7F7F7]"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <button type="button" className="lovable-auth-button h-12 w-full" onClick={() => oauth("lovable")}>
                Continue with Lovable
              </button>
              <div className="my-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className={mode === "forgot" ? "mt-8 grid gap-5" : "grid gap-5"}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" className="h-12 text-base" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== "forgot" && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button type="button" onClick={() => switchMode("forgot")} className="link-underline text-xs text-muted-foreground">
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className="h-12 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" size="xl" disabled={busy} className="w-full">
              {busy && <Loader2 className="animate-spin" aria-hidden />}
              {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                No account yet?{" "}
                <button type="button" onClick={() => switchMode("signup")} className="text-foreground underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("signin")} className="text-foreground underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </>
      )}
    </AuthShell>
  );
}
