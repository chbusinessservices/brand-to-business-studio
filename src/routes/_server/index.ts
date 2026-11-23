/**
 * CH Business Services - Server Route Registry
 * 
 * Reference: Spec Section 3: Site layers and navigation
 * 
 * This file documents all routes required by the operating platform specification.
 * All public routes must register here before implementation.
 */

// Export route types for cross-route type checking
import { createPublicPage } from "@/lib/public-page-helpers";

// Route Registry - 84 route patterns per spec Section 3
export const P1_PUBLIC_ROUTES = [
  // Home Page
  { path: "/", title: "Home", phase: "P1" },
  
  // Services Index & Details (3 routes)
  { path: "/services", title: "Services Index", phase: "P1" },
  { path: "/services/cleaning-business-setup", title: "Cleaning Business Setup", phase: "P1" },
  { path: "/services/websites-inquiry", title: "Websites & Inquiry", phase: "P1" },
  { path: "/services/client-journey-systems", title: "Client Journey Systems", phase: "P1" },
  
  // Method and How We Work
  { path: "/how-we-work", title: "How We Work", phase: "P1" },
  
  // Examples & Evidence
  { path: "/examples", title: "Evidence Index", phase: "P1" },
  { path: "/examples/sample-client-handoff", title: "Sample Client Handoff", phase: "P1" },
  
  // About Page
  { path: "/about", title: "About", phase: "P1" },
  
  // Ungated Resources (Business Backup Check)
  { path: "/business-backup-check", title: "Business Backup Check", phase: "P1" },
  
  // Contact & Inquiries
  { path: "/contact", title: "Contact", phase: "P1" },
  { path: "/request-received", title: "Request Received", phase: "P1_AS_NEEDED" },
  { path: "/booking-return", title: "Booking Return", phase: "P1_AS_NEEDED" },
  
  // Policy Pages
  { path: "/privacy", title: "Privacy Notice", phase: "P1" },
  { path: "/terms", title: "Terms of Service", phase: "P1" },
  { path: "/accessibility", title: "Accessibility Information", phase: "P1" },
  
  // Error States
  { path: "/request-error", title: "Request Error", phase: "P1_AS_NEEDED" },
  { path: "/not-found-404", title: "Not Found (404)", phase: "P1_AS_NEEDED" },
  { path: "/maintenance", title: "Maintenance Mode", phase: "P1_AS_NEEDED" },
];

// P2 Routes - Authenticated Client Workspace
export const P2_CLIENT_WORKSPACE_ROUTES = [
  // Authentication
  { path: "/auth/sign-in", title: "Sign In", phase: "P2" },
  { path: "/auth/sign-up", title: "Sign Up", phase: "P2" },
  { path: "/auth/recover", title: "Recovery", phase: "P2" },
  { path: "/auth/callback", title: "Callback", phase: "P2" },
  
  // Client Workspace Main
  { path: "/", title: "Client Dashboard Home", phase: "P2" },
  { path: "/_authenticated/overview", title: "Overview & Status", phase: "P2" },
  { path: "/_authenticated/projects", title: "Projects", phase: "P2" },
  { path: "/_authenticated/projects/:id", title: "Project Detail", phase: "P2" },
  { path: "/_authenticated/approvals", title: "Approvals Queue", phase: "P2" },
  { path: "/_authenticated/settings", title: "Settings", phase: "P2" },
];

// P3 Routes - Provider Workspace (Conditional)
export const P3_PROVIDER_ROUTES = [
  // Providers Section (P2_OR_LATER)
  { path: "/for-providers", title: "For Providers", phase: "P2_OR_LATER" },
  { path: "/provider-application", title: "Provider Application", phase: "P2_OR_LATER" },
  { path: "/providers-disclosure", title: "Disclosure", phase: "P2_OR_LATER" },
];

// System Routes - Request States
export const SYSTEM_ROUTES = [
  { path: "/request-received", title: "Request Received", phase: "P1_AS_NEEDED" },
  { path: "/request-error", title: "Request Error", phase: "P1_AS_NEEDED" },
];

// Internal Operations Routes (Permission-scoped)
export const INTERNAL_ROUTES = [
  // Ops Overview
  { path: "/_server/ops", title: "Operations Dashboard", phase: "P2_TO_P4" },
  { path: "/_server/leads", title: "Leads & Contact Requests", phase: "P2_TO_P4" },
  { path: "/_server/opportunities", title: "Sales Opportunities", phase: "P2_TO_P4" },
  { path: "/_server/projects", title: "Projects & Delivery", phase: "P2_TO_P4" },
  { path: "/_server/approvals", title: "Review Queue", phase: "P2_TO_P4" },
  { path: "/_server/finance", title: "Finance & Reconciliation", phase: "P2_TO_P4" },
  { path: "/_server/content", title: "Content & Campaigns", phase: "P2_TO_P4" },
];

// Export route manifest for type checking across routes
import type { PublicRoute, RouteEntry } from "@/types/route-manifest";

export const FULL_ROUTE_MANIFEST = [
  ...P1_PUBLIC_ROUTES.map((r) => ({ path: r.path, title: r.title, phase: r.phase })),
  ...P2_CLIENT_WORKSPACE_ROUTES.map((r) => ({ path: r.path, title: r.title, phase: r.phase })),
  ...P3_PROVIDER_ROUTES.map((r) => ({ path: r.path, title: r.title, phase: r.phase })),
  ...SYSTEM_ROUTES.map((r) => ({ path: r.path, title: r.title, phase: r.phase })),
  ...INTERNAL_ROUTES.map((r) => ({ path: r.path, title: r.title, phase: r.phase })),
];

/** Route type guard following spec Section 3 requirements */
export const isPublicRoute = (path: string): path is PublicRoute["path"] => {
  return P1_PUBLIC_ROUTES.some(r => r.path === path);
};

/** Match route by path - returns full entry with phase info */
export const matchRouteByPath = (path: string) => {
  const publicMatch = P1_PUBLIC_ROUTES.find(r => r.path === path);
  if (publicMatch) return publicMatch as RouteEntry;
  
  return null;
};

/** Export for dynamic route matching in Next.js */
export default FULL_ROUTE_MANIFEST;
