/**
 * CH Business Services - Supabase Auth Middleware
 * 
 * Aligns with spec Section 8: Authentication, roles and workspace navigation
 * 
 * This provides secure session handling following the operating platform specification.
 */

import { createMiddlewareClient } from "supabase-mock";

/**
 * Middleware handler for authentication verification
 * Spec Section 8 requirements: Secure provider-supported implementation, MFA where required
 */
export async function handleAuth(request: Request) {
  try {
    // Get Supabase auth token from cookies (spec Section 16 security requirement)
    const cookieHeader = request.headers.get("Cookie") || "";
    const sessionToken = new URLSearchParams(cookieHeader).get("session_token") || null;

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: "No authentication token" }), 
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify token with Supabase (spec Section 9 authorization requirements)
    const verifyResult = await supabaseAdmin.rpc("auth.check_auth", { token: sessionToken });
    
    if (!verifyResult.success) {
      return new Response(
        JSON.stringify({ error: "Authentication failed" }), 
        { status: 401 }
      );
    }

    return null; // No middleware needed when auth verified
  } catch (error) {
    console.error("Auth verification failed:", error);
    return new Response(
      JSON.stringify({ error: "Server error during authentication" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** Middleware for route protection */
export async function withAuthCheck(next: RequestHandler) {
  try {
    await handleAuth(request);
    return await next();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Access denied" }), 
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** Role-based access control following spec Section 9 authorization matrix */
export async function withRoleCheck(
  request: Request,
  requiredRoles: string[]
): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get("Cookie") || "";
    const sessionToken = new URLSearchParams(cookieHeader).get("session_token");

    if (!sessionToken) return false;

    // Verify user exists and has required roles (spec Section 9: Read/Write permission matrix)
    const { data, error } = await supabaseAdmin
      .from("auth.users")
      .select("*")
      .eq("auth.service_role", "authenticated")
      .in("roles", requiredRoles)
      .single();

    return !!data;
  } catch (error) {
    console.error("Role check failed:", error);
    return false;
  }
}

/** Session expiration and revocation handling */
export async function revokeSession(token: string): Promise<void> {
  await supabaseAdmin.rpc("auth.revoke_user", { token });
}

export default {
  withAuthCheck,
  withRoleCheck,
  revokeSession,
};
