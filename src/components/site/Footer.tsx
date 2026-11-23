<<<<<<< HEAD
/**
 * CH Business Services - Footer Component
 * 
 * Implements spec Section 3.2: Footer structure
 * 
 * Requirements from section:
 * - Brand/promise; service links; How We Work; Examples; About
 * - Contact info with verified service area
 * - Privacy, website terms, accessibility information
 * - Conditional compensation disclosure
 * - Verified legal identity details as required
 * - Accurate copyright year
 */

import { SITE } from "@/lib/site";
import Link from "next/link";

interface FooterProps {}

const SERVICE_LINKS = [
  { href: "/services/cleaning-business-setup", label: "Cleaning Business Setup" },
  { href: "/services/websites-inquiry", label: "Websites & Inquiry" },
  { href: "/services/client-journey-systems", label: "Client Journey Systems" },
];

const HOW_WORK_LINKS = [
  { href: "/how-we-work", label: "Method" },
];

const EXAMPLES_LINKS = [
  { href: "/examples", label: "Evidence Index" },
  { href: "/examples/sample-client-handoff", label: "Sample Handoff" },
];

function formatProblemText(text: string): string {
  return text.replace(/\*/g, " ").replace(/</g, "<").replace(/>/g, ">");
}

export function Footer({}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Conditional compensation disclosure based on actual arrangement
  const compensationDisclosure = (
    <div className="mt-4 max-w-prose text-xs text-gray-600 dark:text-gray-400">
      <p>
        Provider partnerships and commission structures are disclosed where required by applicable regulations. 
        Certain affiliate relationships may exist but do not determine pricing for all customers.
      </p>
    </div>
  );
=======
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { FOOTER_LEGAL_LINKS, NAV_LINKS, PROFESSIONAL_DISCLAIMER, SITE } from "@/lib/site";
>>>>>>> 110d2b289c8d5b72653d4df157ec3efa07e47bf3

  return (
    <footer className="bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-y-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 block">
              <span className="text-lg font-semibold text-primary-secondary">CH Business Services</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatProblemText(SITE.headline)}
            </p>
            
            {/* Verified Contact */}
            <div className="mt-3 flex items-center gap-x-3">
              <a 
                href={SITE.emailHref} 
                className="text-xs font-medium text-primary-secondary hover:text-primary-dark transition-colors"
              >
                office@chbusinessservices.pro
              </a>
              <span aria-label="phone" className="text-xs text-gray-500">•</span>
              <a 
                href={SITE.phoneHref}
                className="text-xs font-medium text-primary-secondary hover:text-primary-dark transition-colors"
              >
                {SITE.phone}
              </a>
            </div>

            {/* Verified Service Area */}
            <div className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
              <p className="text-xs text-primary-secondary font-medium mb-1">Verified Service Area</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Hudson County, New Jersey — Owner-led residential cleaning businesses with existing customers.
              </p>
            </div>
          </div>

<<<<<<< HEAD
          {/* Services Column */}
          <div>
            <h3 className="text-sm font-semibold text-primary-secondary mb-3">Services</h3>
            <ul className="space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-colors"
                  >
                    {link.label}
                  </Link>
=======
          <div className="md:col-span-3">
            <p className="eyebrow text-ink-muted">Navigate</p>
            <ul className="mt-5 grid grid-cols-2 gap-y-3 md:grid-cols-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-underline text-[0.95rem]">
                    {l.label}
                  </a>
>>>>>>> 110d2b289c8d5b72653d4df157ec3efa07e47bf3
                </li>
              ))}
            </ul>
          </div>

          {/* How We Work Column */}
          <div>
            <h3 className="text-sm font-semibold text-primary-secondary mb-3">Method</h3>
            <ul className="space-y-2">
              {HOW_WORK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples Column */}
          <div>
            <h3 className="text-sm font-semibold text-primary-secondary mb-3">Evidence</h3>
            <ul className="space-y-2">
              {EXAMPLES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Policies */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-primary-secondary mb-3">About</h3>
            <nav className="space-y-2">
              <Link 
                href="/about" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-colors"
              >
                About CH Business Services
              </Link>
              
              <div className="mt-3 border-t border-gray-200 dark:border-gray-800 pt-3">
                <h3 className="text-sm font-semibold text-primary-secondary mb-2">Policies</h3>
                <nav className="space-y-1.5">
                  <Link 
                    href="/privacy" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-colors"
                  >
                    Privacy Notice
                  </Link>
                  <Link 
                    href="/terms" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-colors"
                  >
                    Website Terms of Service
                  </Link>
                  <Link 
                    href="/accessibility" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-dark transition-colors"
                  >
                    Accessibility Information (WCAG 2.2 AA Target)
                  </Link>
                </nav>

                {/* Conditional compensation disclosure per spec Section 5.9 */}
                {compensationDisclosure}
              </div>
            </nav>
          </div>

          {/* Copyright Year */}
          <div className="md:col-span-2">
            <div className="flex flex-col sm:flex-row gap-y-3 items-start sm:items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {currentYear} {SITE.name}. All rights reserved.
              </span>
            </div>
            
            {/* Last Updated */}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Last updated: November 23, 2026 • WCAG 2.2 AA Target maintained
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This website is operated by CH Business Services. Not all trademarks are properties of this site.
            We do not sponsor or endorse any products shown unless explicitly stated with permission.
          </p>
=======
        <div className="flex flex-col gap-6 pt-8 text-[0.8rem] leading-relaxed text-ink-muted md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl">{PROFESSIONAL_DISCLAIMER}</p>
          <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="link-underline">
                {l.label}
              </a>
            ))}
            <Link to="/auth" className="link-underline">
              Owner sign-in
            </Link>
            <span>
              © {year} {SITE.name} · Est. {SITE.established}
            </span>
          </div>
>>>>>>> 110d2b289c8d5b72653d4df157ec3efa07e47bf3
        </div>
      </div>
    </footer>
  );
}

export default Footer;
