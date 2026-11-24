/**
 * Chat Widget - Auth Required Features
 * Renders login button before chat widget appears
 */

import { useEffect } from "react";
import { GoogleAuthButton } from "./ui/google-auth-btn";
import type { Session } from "@supabase/supabase-js";

interface Props {
  onLogin: () => Promise<void>;
  showOnMount?: boolean;
}

export function AuthWidget({ onLogin, showOnMount = true }: Props) {
  useEffect(() => {
    // Check if user is authenticated before showing secure content
    const checkAuth = async () => {
      try {
        const data = await fetch("/oauth/session");
        const json = await data.json();
        
        if (json.error || !json.success) {
          // User not authenticated - redirect to login
          onLogin();
          return;
        }
      } catch (err) {
        console.log("Auth check failed, showing login button");
      }
    };

    if (showOnMount) {
      setTimeout(checkAuth, 100);
    }
  }, [onLogin]);

  return null; // No visible output - logic handles everything in useEffect
}
