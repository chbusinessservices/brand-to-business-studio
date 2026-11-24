/**
 * Google OAuth Handler - Redirects user to Google's OIDC provider
 */

import { type PageLoad } from "@supabase/supabase-types";

export const LOAD: PageLoad = async () => {
  // Netlify handles the OAuth flow automatically for /auth/sign-in?provider=google
  // We just need to configure the redirect properly in Netlify's site settings
  
  return { content: "Redirecting to Google OAuth..." };
};
