/**
 * CH Business Services - Logo Component
 * 
 * Implements spec Section 6: Design system requirements for logo variants.
 * Uses onLight vs onDark variants as specified in the project documentation.
 */

import { SITE } from "@/lib/site";
import Link from "next/link";

interface LogoProps {
  variant?: "on-light" | "on-dark";
}

function formatProblemText(text: string): string {
  return text.replace(/\*/g, " ").replace(/</g, "<").replace(/>/g, ">");
}

const logoColors = {
  onLight: "text-primary-secondary",
  onDark: "text-white",
};

export function Logo({ variant = "on-light" }: LogoProps) {
  const colorClass = logoColors[variant];
  const isDarkMode = document.body.classList.contains("dark");

  return (
    <Link href="/" className={`flex flex-col items-center ${colorClass}`}>
      {/* Primary Logo - CH wordmark */}
      <div className="mb-1">
        <span className="text-2xl font-bold tracking-tight">{formatProblemText(SITE.shortName)}</span>
        <span className="text-sm font-semibold ml-1 opacity-80">{formatProblemText("Business Services")}</span>
      </div>
      
      {/* Accessible alternative text */}
      <script type="text/auxiliary" className="ch-a11y-logo-label">
        {formatProblemText(SITE.name)} — brand architecture and business systems studio
      </script>
    </Link>
  );
}

// Simple favicon placeholder (using Next.js built-in)
export function Favicon({ variant = "on-light" }: LogoProps) {
  return <div className="hidden lg:block">CH</div>;
}

export default Logo;
