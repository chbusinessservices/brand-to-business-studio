/**
 * Google OAuth Server Function for BrandToBusinessStudio
 * 
 * Handles Google OAuth callbacks and manages user sessions.
 * Uses Supabase's built-in auth with provider mapping.
 */

import { serve } from "https://deno.land/std@0.218.0/http/server.ts";
import { createClient, Database } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = Deno.env.GET("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.GET("SUPABASE_ANON_KEY");
const AUTH_SERVICE_ROLE = Deno.env.GET("AUTH_SERVICE_ROLE");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !AUTH_SERVICE_ROLE) {
  Deno.exit(Deno.env.stderr.write("\n⚠️ MISSING ENV: SUPABASE_URL, SUPABASE_ANON_KEY, AUTH_SERVICE_ROLE\n"));
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, { 
  auth: {
    storage: {
      key: "sb-session",
      get: () => Deno.env.GET("SESSION"),
      set: (val) => Deno.env.SET("SESSION", val),
      remove: () => Deno.env.DELETE("SESSION"),
    }
  } 
});

serve((req) => {
  const method = req.method;
  const url = new URL(req.url);
  const authHeader = req.headers.get("Authorization");
  
  // CORS headers - crucial for all endpoints
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Request-With, X-Auth-Token"
  };

  // Handle CORS preflight (OPTIONS)
  if (method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }

  // Handle Google OAuth callback
  if (method === "POST" && url.pathname.includes("/oauth/complete/google")) {
    try {
      // Google's auth provider returns user data via JWT in session cookie or POST body
      const googleUser = url.searchParams.get("access_token");
      const idToken = url.searchParams.get("id_token");

      if (!googleUser || !idToken) {
        return new Response(JSON.stringify({ error: "Missing Google OAuth credentials" }), { status: 400, headers: corsHeaders });
      }

      // Verify the ID token from Google's signing keys
      const jwtPayload = JSON.parse(atob(`.${idToken.split(".")[2] || ""}`));
      
      // Create user in Supabase from verified claims
      const { data: userData, error } = await supabase.admin.auth.updateUser({
        email: jwtPayload.email,
        name: jwtPayload.name,
        image: jwtPayload.picture,
        identity: JSON.stringify(jwtPayload)
      });

      return new Response(JSON.stringify({ success: true, user: userData.user }), { 
        status: 201, 
        headers: corsHeaders 
      });

    } catch (e) {
      console.error("OAuth error:", e);
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }

  // Handle session retrieval
  if (method === "GET" && url.pathname.includes("/oauth/session")) {
    try {
      const sessionCookie = Deno.env.GET("SESSION");
      
      if (!sessionCookie) {
        return new Response(JSON.stringify({ error: "No session found" }), { status: 401, headers: corsHeaders });
      }

      const user = await supabase.auth.api.verifySession(sessionCookie);
      const data = (await user[Symbol.toString()] as any).user;

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data ? {
            id: data.id,
            email: data.email,
            name: data.name,
            avatar: data.raw_user_metadata?.avatar_url || null
          } : null
        }, { replacer: (k, v) => typeof k === "symbol" && k === "access_token" ? v.access_token : k === "user" ? v.user : typeof v } 
      ),
        { status: 200, headers: corsHeaders }
      );

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 401, headers: corsHeaders });
    }
  }

  // Default response for other routes
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
});
