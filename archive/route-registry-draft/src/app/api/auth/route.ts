/**
 * CH Business Services - Authentication API Handler
 * 
 * Implements spec Section 8: Secure authentication, session management, and role-based access
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/integrations/supabase/admin";

export const dynamic = "force-dynamic";

/** Handle POST /api/auth/sign-in - secure user authentication */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Create user session with Supabase (spec Section 16 security requirement)
    const { data, error } = await supabaseAdmin.auth.admin.signUp({
      email: body.email,
      password: body.password,
      options: { emailRedirectTo: "https://chbusinessservices.pro/auth", 
                 autoSignInUserAgent: false 
      });

    if (error || !data) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // Generate and return session token
    const sessionId = await supabaseAdmin.auth.signIn({
      provider: "credentials",
      redirectTo: "/dashboard",
    });

    return NextResponse.json({
      success: true,
      message: "Successfully authenticated",
      session: sessionId,
    });

  } catch (error) {
    console.error("Auth sign-in failed:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/** Handle POST /api/auth/mfa - MFA verification */
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const verifyResult = await supabaseAdmin.rpc("auth.verify_otp", { 
      email, 
      totp: otp 
    });

    return NextResponse.json({ 
      success: true, 
      message: "Verification successful" 
    });

  } catch (error) {
    console.error("MFA verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }
}

/** Handle POST /api/auth/recover - account recovery */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.resend.email({
      email,
      type: "recovery",
    });

    if (error) {
      return NextResponse.json({ error: "Recovery failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "If your email is in our system, we've sent you a link to reset your password."
    });

  } catch (error) {
    console.error("Account recovery failed:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/** Handle GET /api/auth/session - verify current session */
export async function GET(request: NextRequest) {
  try {
    const { data, user } = await supabaseAdmin.auth.admin.getSession();
    
    return NextResponse.json({
      isAuthenticated: true,
      email: user?.email,
      roles: data.data.user?.roles,
    });

  } catch (error) {
    console.error("Session check failed:", error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      message: "No active session" 
    }, { status: 401 });
  }
}

export const GET = async (request: NextRequest) => {
  return NextResponse.json({ message: "Not Found", available: true });
};
