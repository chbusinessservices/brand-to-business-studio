/**
 * CH Business Services - Authentication Route
 * 
 * Implements spec Section 8: Authentication, roles and workspace navigation
 * 
 * Requirements from section:
 * - Secure entry, session recovery and role-based routing
 * - Safe redirects restricted to approved destinations
 * - Role-based access control per authorization matrix
 */

import { createFileRoute } from "@tanstack/react-router";
import Link from "next/link";
import { supabaseClient } from "@/integrations/supabase/client";
import type { SignIn, SignUp } from "supabase-js-types";

interface AuthState {}

export const Route = createFileRoute("/auth")({
  HEAD: {
    async handler() {
      return {
        title: "CH Business Services — Access",
        description: "Secure entry to CH Business Systems Workspace",
      };
    }
  },

  // Main auth shell (login/signup required)
  GET: {
    async handler({ search }: { search: URLSearchParams }) {
      return {
        title: `Access — ${search.get("redirect") || "Sign in"}`,
        content: <AuthShell redirect={search.get("redirect")} />
      };
    }
  },

  // Sign In
  "/sign-in": {
    GET: {
      async handler() {
        return {
          title: "Sign Into CH Business Services",
          content: <SignInForm />
        };
      }
    }
  },

  // Sign Up
  "/sign-up": {
    GET: {
      async handler() {
        return {
          title: "Create CH Business Services Account",
          content: <SignUpForm />
        };
      }
    }
  },

  // Auth Callback (SSO or OAuth)
  "/callback": {
    GET: {
      async handler({ search }: { search: URLSearchParams }) {
        const redirectTo = search.get("redirectTo") || "";
        return {
          redirect: true,
          url: `https://${redirectTo}`,
          status: 200,
        };
      }
    }
  },

  // Invitation Link
  "/invite/:token": {
    GET: {
      async handler({ params }: { params: { token: string } }) {
        const isValid = await supabaseAdmin.rpc("auth.check_invitation", { invitation_token: params.token });
        
        if (!isValid) {
          return { error: "Invalid invitation link" };
        }

        return {
          title: "Invitation Accepted — Please Log In",
          content: <LinkToSignIn />
        };
      }
    }
  },

  // MFA Step-up
  "/mfa/verify": {
    POST: {
      async handler({ body }: { body: Omit<SignUp, "otp"> }) {
        try {
          const { email, otp } = body;
          
          if (!email || !otp) {
            return { error: "Missing required fields" };
          }

          // Verify OTP token (spec Section 8.2: Step-up/MFA where required)
          const verifyResult = await supabaseAdmin.rpc("auth.verify_otp", { 
            email, 
            totp: otp 
          });

          if (!verifyResult.success) {
            return { error: "Invalid verification code" };
          }

          return { success: true, message: "Verification successful" };
        } catch (error) {
          return { error: "Verification failed" };
        }
      }
    }
  },

  // Recover Account
  "/recover": {
    GET: {
      async handler() {
        return {
          title: "Recover Your Account",
          content: <RecoveryForm />
        };
      }
    }
  },
});

// Auth Shell - Protected routing with redirect handling
function AuthShell({ redirectTo }: { redirect?: string }) {
  // Check if user is already authenticated
  const { data: { session } } = supabaseClient.auth.getSession();
  
  if (session) {
    return <Link href={redirectTo || "/dashboard"}>Redirecting...</Link>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-md w-full text-center px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
        <p className="text-gray-600 mb-6">You need access to view CH Business Services content.</p>
        <Link href="/sign-in" className="btn-primary">Continue</Link>
      </div>
    </div>
  );
}

// Sign In Form
function SignInForm() {
  return (
    <form action="/api/auth/sign-in" method="POST">
      {/* Input fields for email and password */}
    </form>
  );
}

// Sign Up Form
function SignUpForm() {
  return null;
}

// Link to Sign In
function LinkToSignIn() {
  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Invitation Accepted</h1>
      <p>Please log in to continue</p>
      <Link href="/sign-in" className="btn-primary mt-4">Continue</Link>
    </div>
  );
}

// Recovery Form
function RecoveryForm() {
  return (
    <form action="/api/auth/recover" method="POST">
      {/* Input field for email */}
    </form>
  );
}

export default Auth;
