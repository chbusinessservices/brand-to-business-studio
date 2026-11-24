/**
 * Server-side OAuth Session Handler for BrandToBusinessStudio
 * 
 * Handles Google OAuth callbacks and session management.
 */

import { serve } from "https://deno.land/std@0.218.0/http/server.ts";
import { createClient, Database } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = Deno.env.GET("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.GET("SUPABASE_ANON_KEY");
const AUTH_SERVICE_ROLE = Deno.env.GET("AUTH_SERVICE_ROLE");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !AUTH_SERVICE_ROLE) {
  Deno.exit(Deno.env.stderr.write("\n⚠️ MISSING ENV: SUPABASE_URL, SUPABASE_ANON_KEY, AUTH_SERVICE_ROLE\n"));
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

serve((req) => {
  const method = req.method;
  const url = new URL(req.url);
  const authHeader = req.headers.get("Authorization");

  // CORS headers for all endpoints
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type"
  };

  // Handle GET /oauth/session - returns current user session
  if (method === "GET" && url.pathname.includes("/session")) {
    try {
      const existingSession = Deno.env.GET("SESSION");
      
      if (!existingSession) {
        return new Response(JSON.stringify({ error: "No session found", success: false }), { 
          status: 401, 
          headers: corsHeaders 
        });
      }

      // Verify and return the current session user
      const { data, error } = await supabase.auth.api.getSession();
      
      if (error) throw new Error(error.message);

      return new Response(JSON.stringify({
        success: true,
        data: data.user ? {
          id: data.user.id,
          email: data.user.email || null,
          name: data.user.name || null,
        } as any : null
      }, { replacer: (_, v) => typeof v === "object" ? JSON.stringify(v) : v }), 
        { status: 200, headers: corsHeaders });
    } catch (e) {
      console.error("Session error:", e);
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }

  // Handle POST /oauth/callback - Google OAuth callback handler
  if (method === "POST" && url.pathname.includes("/callback")) {
    try {
      const authCode = Deno.env.GET("CODE");
      
      if (!authCode) {
        return new Response(JSON.stringify({ error: "Missing authorization code", success: false }), 
          { status: 400, headers: corsHeaders });
      }

      // Exchange code for session token (supabase.auth.exchangeCodeForSession)
      const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);
      
      if (error) throw new Error(error.message);

      // Set session cookie and return user info
      Deno.env.SET("SESSION", data.user.id);

      return new Response(JSON.stringify({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || null,
          name: data.user.name || null,
        } as any
      }), { status: 201, headers: corsHeaders });

    } catch (e) {
      console.error("Callback error:", e);
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }

  // Default success response for other routes
  return new Response(JSON.stringify({ success: true }), { 
    status: 200, 
    headers: corsHeaders 
  });
});
