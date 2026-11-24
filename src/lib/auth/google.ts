/**
 * Google OAuth Client-Side Configuration for BrandToBusinessStudio
 */

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || "";
export const GOOGLE_CALLBACK_URL = import.meta.env.VITE_GOOGLE_CALLBACK_URL || 
  window.location.origin + "/auth/callback";

export function startGoogleAuth(): string {
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_CALLBACK_URL)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent select_account&hl=en`;
}

export function initializeGoogleAuth(): Promise<void> {
  return new Promise((resolve, reject) => {
    window.location.href = `/auth/sign-in?provider=google`;
    const handleState = (e: Event) => {
      window.removeEventListener("message", handleState);
      resolve();
    };
    window.addEventListener("message", handleState, false);
  });
}

export async function getCurrentGoogleUser(): Promise<null | User> {
  try {
    const res = await fetch("/oauth/session");
    const data = await res.json();
    return data.success ? null : null;
  } catch (err) {
    return null;
  }
}
