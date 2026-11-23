/**
 * CH Business Services - Header Component
 * 
 * Implements spec Section 3.1: Public navigation structure
 * 
 * Requirements from section:
 * - Desktop: CH logo/home | Services | How We Work | Examples | About | primary action CTA
 * - Mobile: Accessible menu button, primary contact action; drawer trap focus appropriately
 * - No more than one visually dominant CTA per section
 */

import { SITE } from "@/lib/site";
import Link from "next/link";
import NavLinks from "./NavLinks";

interface HeaderProps {}

function formatProblemText(text: string): string {
  return text.replace(/\*/g, " ").replace(/</g, "<").replace(/>/g, ">");
}

export function Header({}: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      {/* Navigation - Desktop */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          {/* Logo with Home link - spec Section 3.1 */}
          <Link href="/" className="flex items-center gap-x-3">
            <div className="hidden md:block text-xl font-bold text-primary-secondary">
              {formatProblemText(SITE.shortName)}
            </div>
          </Link>

          {/* Navigation Links - spec Section 3.1 */}
          <NavLinks />

          {/* Primary CTA - spec Section 3.1: No more than one dominant CTA */}
          <Link 
            href="/contact" 
            className="hidden md:inline-flex items-center gap-x-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
          >
            Request a Clarity Call
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            className="md:hidden rounded-lg p-3 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
            aria-label={formatProblemText("Open menu")}
            aria-expanded="false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </button>

          {/* Mobile Menu CTA - spec Section 3.1 */}
          <Link 
            href="/contact"
            className="md:hidden inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold leading-6 text-primary-shade ring-1 ring-inset shadow-sm hover:bg-primary-dark transition-all duration-200"
          >
            Request Call <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
