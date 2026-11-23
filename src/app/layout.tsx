/**
 * CH Business Services - Root Layout
 * 
 * Implements spec Section 6: Global content, interaction and design requirements
 * 
 * This provides the root layout following WCAG 2.2 AA accessibility target per specification.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CH Business Services | We build the business behind the brand",
  description: "Brand architecture and business systems studio helping service-business founders connect a clear brand promise with the structure to deliver it.",
};

import { Inter } from "next/font/google";
import { Providers } from "next-themes";
import { ToastContainer } from "sonner";
import ErrorPage from "@/lib/error-page";
import "./styles.css";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

// Global styles following spec Section 6 design requirements
function Styles() {
  return <style>{`
    /* Accessibility foundation - WCAG 2.2 AA target */
    :root {
      --color-primary: rgb(150 153 174);
      --color-primary-dark: rgb(90 96 125);
      --font-sans: ${inter};
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-primary: rgb(238 241 252);
        --color-primary-dark: rgb(179 180 196);
        font-family: ${inter.style.fontFamily};
      }
    }

    body {
      font-family: var(--font-sans, ui);
      background-color: #ffffff;
      color: #1f2937;
    }

    /* Focus indicators - WCAG 2.4.7 */
    *:focus-visible {
      outline: 3px solid rgb(59 130 246);
      outline-offset: 2px;
    }

    /* Skip to content link (WCAG 2.4.1) */
    .skip-to-main {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
  `}</style>;
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Providers attribute="class" defaultTheme="system">{children}</ThemeProvider>;
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error boundary caught:", error);
    return (
      <div className="p-8 text-center">
        <h1>An error occurred</h1>
        <p>We encountered an unexpected error. Please try again or contact support.</p>
      </div>
    );
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans bg-white text-gray-900">
        <Styles />
        <ToastContainer position="bottom-right" richColors />
        
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
