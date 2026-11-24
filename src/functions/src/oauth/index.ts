/**
 * Google OAuth Server Function for BrandToBusinessStudio
 * 
 * This function handles the callback from Google's OIDC provider
 * and creates/returns Supabase auth users.
 */

import { serve } from "https://deno.land/std@0.218.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import type { Session } from "@supabase/sslr";

const SUPABASE_URL = Deno.env.GET("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.GET("SUPABASE_ANON_KEY");
const GOOGLE_CLIENT_ID = Deno.env.GET("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.GET("GOOGLE_CLIENT_SECRET");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  Deno.exit(Deno.env.stderr.write("\n⚠️ MISSING ENV VARIABLES: SUPABASE_URL, SUPABASE_ANON_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET\n"));
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve((req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const bearerToken = authHeader.substring(7);
  let session: Session | null = null;

  try {
    // Verify JWT if it's a session cookie or access token
    const { data, error } = await supabase.auth.api.verifySession(bearerToken, { 
      query: { serviceRoleKey: "anon" },
      referrer: req.headers.get("referer") || null
    });
    
    session = data;

  } catch (err) {
    // For OAuth callbacks, we may not have a JWT yet - create new user
    if (req.method === "POST") {
      const code = Deno.env.GET("CODE");
      
      if (!code) {
        return new Response(JSON.stringify({ error: "Missing authorization code" }), { status: 400 });
      }

      // Google OAuth callback - exchange code for token then user
      // Note: This is a simplified flow - production should use Supabase's built-in OAuth
      
      // For now, create anonymous session from the auth code
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        session = await supabase.auth.api.getSession();
      }
    }

    return new Response(JSON.stringify({ error: "Invalid token", details: err.message }), { status: 401 });
  }

  // Handle various HTTP methods from Netlify routing
  if (req.method === "OPTIONS") {
    return new Response("", {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Request-With"
      }
    });
  }

  if (req.method === "POST") {
    // User is authenticating via Google
    const authHeader = req.headers.get("Authorization");
    
    try {
      // Extract Google's JWT from the OAuth response
      const jwtPayload = JSON.parse(atob(`${authHeader?.split(".")?.[1] ?? ""}.`));
      
      const userInfo = {
        sub: jwtPayload.sub,
        email: jwtPayload.email,
        picture: jwtPayload.picture || null,
        name: jwtPayload.name || null,
        nickname: jwtPayload.name?.replace(" ", "_") || null,
      };

      // Create or retrieve user in Supabase
      const { data: userData, error } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        password: "temp-auth-token", // Will be replaced with proper session
        identity: JSON.stringify(userInfo),
      });

      if (error) throw new Error(error.message);

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: userData.user ?? { ...userData.user, raw_user_metadata: {} } 
        }), 
        { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
      );

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (req.method === "GET" && req.url.includes("/session")) {
    // Return current session for auth state
    const { data, error } = await supabase.auth.api.getSession();
    
    return new Response(
      JSON.stringify({ 
        session: error ? null : { user: data.user?.user ?? null, access_token: data.access_token } 
      }), 
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  return new Response(JSON.stringify({ success: true }), { 
    status: 200, 
    headers: { "Access-Control-Allow-Origin": "*" } 
  });
});
