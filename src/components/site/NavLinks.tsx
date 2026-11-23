/**
 * CH Business Services - Navigation Links Component
 * 
 * Implements spec Section 3.1: Public navigation structure
 * 
 * Desktop: CH logo/home | Services | How We Work | Examples | About | primary action CTA
 * Mobile: Accessible menu button, primary contact action; drawer trap focus appropriately
 */

import Link from "next/link";

// Navigation links per spec Section 3.1
export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#method", label: "Method" },
  { href: "#how-it-works", label: "How We Work" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export function NavLinks() {
  return (
    <nav className="flex items-center gap-x-6 py-4">
      {/* Navigation links */}
      {NAV_LINKS.map((link) => (
        <Link 
          key={link.href} 
          href={`#${link.href}`} 
          className="text-sm font-semibold text-primary-secondary hover:text-primary-dark transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default NavLinks;
