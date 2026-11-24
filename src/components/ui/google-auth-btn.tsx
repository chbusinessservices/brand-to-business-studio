/**
 * Google Authentication Button Component
 * For chat widget and inquiry forms that require login
 */

import { createClient } from "@supabase/supabase-js";

interface Props {
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "primary" | "ghost";
  showAvatar?: boolean;
  withText?: string;
  children?: React.ReactNode;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export function GoogleAuthButton({ size, variant, showAvatar = false, withText = "Continue with Google", children }: Props) {
  const btnSize = size === "lg" ? "py-2 px-6 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow" :
                  size === "md" ? "py-1.5 px-4 text-xs font-medium border rounded" :
                    "px-3 py-1.5 text-[0.75rem] font-medium text-gray-600 bg-white";

  const btnVariant = variant === "outline" ? "border border-gray-300 hover:border-blue-400" :
                     variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" :
                       "text-blue-600 hover:text-blue-800";

  return (
    <button className={`${btnSize} ${btnVariant} flex items-center justify-center gap-1.5`}
              onClick={() => {
                const btn = document.querySelector<HTMLButtonElement>('[data-testid="google-auth-btn"]');
                if (btn) btn.click();
              }}>
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M15.467 4C9.8 4 5.167 5.6 1.7 7.37a.5.5 0 0 0 -.2.67l.003.006c2.582-2.5 5.648-4.098 9.2-.948Z"/>
        <path fill="#34A853" d="M11.1 15.37a8.03 8.03 0 0 0 6.7-1.8 7.5 7.5 0 0 0 .9-1.42a.5.5 0 0 0 -.05-.6l-.003-.007c-2.813-1.595-5.845-2.324-8.974-2.102.365-.03.727-.09 1.085-.185a7.666 7.666 0 0 0 2.636-1.525A7.946 7.946 0 0 0 11.1 15.37Z"/>
        <path fill="#FBBC05" d="M4.283 7.33a11.2 11.2 0 0 0 6.958-3.45A7.39 7.39 0 0 0 10.9 3a.5.5 0 0 0 .25-.47l-.004-.007c-.272-2.048-2.168-3.512-4.298-3.512a.5.5 0 0 0 -.482.298l-.003.005c-.405.884-.372 1.976.095 2.805A10.5 10.5 0 0 0 4.283 7.33Z"/>
        <path fill="#4285F4" d="M16.153 16.73c-2.963-.45-5.969-.224-8.542.62A7.96 7.96 0 0 0 5.1 14a.5.5 0 0 0 -.18.6l.003.006c1.114 2.666 3.982 4.38 7.1 4.38a8.033 8.033 0 0 0 5.026-1.8A7.532 7.532 0 0 0 16.153 16.73Z"/>
      </svg>
      <span className="hidden sm:inline">{children || withText}</span>
    </button>
  );
}

export function GoogleLoginButton() {
  return (
    <button 
      className="flex items-center gap-2 bg-gray-100 border border-gray-300 hover:bg-gray-50 px-4 py-1.5 rounded text-sm font-medium transition-colors"
      onClick={() => {
        // Redirect to Google auth in production
        window.location.href = "/auth/sign-in?provider=google";
      }}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M15.467 4C9.8 4 5.167 5.6 1.7 7.37a.5.5 0 0 0 -.2.67l.003.006c2.582-2.5 5.648-4.098 9.2-.948Z"/>
        <path fill="#34A853" d="M11.1 15.37a8.03 8.03 0 0 0 6.7-1.8 7.5 7.5 0 0 0 .9-1.42a.5.5 0 0 0 -.05-.6l-.003-.007c-2.813-1.595-5.845-2.324-8.974-2.102.365-.03.727-.09 1.085-.185a7.666 7.666 0 0 0 2.636-1.525A7.946 7.946 0 0 0 11.1 15.37Z"/>
        <path fill="#FBBC05" d="M4.283 7.33a11.2 11.2 0 0 0 6.958-3.45A7.39 7.39 0 0 0 10.9 3a.5.5 0 0 0 .25-.47l-.004-.007c-.272-2.048-2.168-3.512-4.298-3.512a.5.5 0 0 0 -.482.298l-.003.005c-.405.884-.372 1.976.095 2.805A10.5 10.5 0 0 0 4.283 7.33Z"/>
        <path fill="#4285F4" d="M16.153 16.73c-2.963-.45-5.969-.224-8.542.62A7.96 7.96 0 0 0 5.1 14a.5.5 0 0 0 -.18.6l.003.006c1.114 2.666 3.982 4.38 7.1 4.38a8.033 8.033 0 0 0 5.026-1.8A7.532 7.532 0 0 0 16.153 16.73Z"/>
      </svg>
      <span>Sign in with Google</span>
    </button>
  );
}
