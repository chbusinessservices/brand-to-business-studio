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

<<<<<<< HEAD
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
=======
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="link-underline py-1 text-[0.92rem] text-foreground/80 transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex h-10 px-5">
            <a href="/contact">Request a Clarity Call</a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="!size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm border-l p-0 [&>button]:hidden">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-[4.5rem] items-center justify-between border-b px-5">
                <Logo variant="onLight" height={34} />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Close menu">
                    <X className="!size-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav aria-label="Mobile" className="px-5 py-4">
                <ul>
                  {NAV_LINKS.map((l, i) => (
                    <li key={l.href} className="border-b">
                      <SheetClose asChild>
                        <a
                          href={l.href}
                          className="flex items-baseline gap-4 py-4 text-xl font-medium"
                        >
                          <span className="eyebrow text-muted-foreground">0{i + 1}</span>
                          {l.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <SheetClose asChild>
                  <Button asChild size="xl" className="mt-8 w-full">
                    <a href="/contact">Request a Free 15-Minute Clarity Call</a>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
>>>>>>> 110d2b289c8d5b72653d4df157ec3efa07e47bf3
      </div>
    </header>
  );
}

export default Header;
