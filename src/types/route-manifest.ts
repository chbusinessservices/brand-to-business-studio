/**
 * Route Manifest - CH Business Services Operating Platform Specification v2.0
 * Reference: Comprehensive 6,400-word specification (Version 2.0)
 * 
 * All routes must align with the architecture defined in Section 3 and route map.
 */

import type { PublicRoute } from "@/lib/server-route-types";

export const ROUTE_MANIFEST = [
  // P1 PUBLIC ROUTES
  {
    id: "home",
    path: "/",
    template: "homepage",
    phase: "P1",
    purpose: "Explain promise, focus, choices, proof and next step",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "services-index",
    path: "/services",
    template: "service_index",
    phase: "P1",
    purpose: "Choose a relevant scoped offer",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "services-cleaning-business-setup",
    path: "/services/cleaning-business-setup",
    template: "service_detail",
    phase: "P1",
    purpose: "Primary proposed full scoped setup",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "services-websites-inquiry",
    path: "/services/websites-inquiry",
    template: "service_detail",
    phase: "P1",
    purpose: "Focused website and inquiry implementation",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "services-client-journey-systems",
    path: "/services/client-journey-systems",
    template: "service_detail",
    phase: "P1",
    purpose: "Bounded operational handoff improvement",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "how-we-work",
    path: "/how-we-work",
    template: "method",
    phase: "P1",
    purpose: "Explain Trust OS, delivery and accountability",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "examples-index",
    path: "/examples",
    template: "evidence_index",
    phase: "P1",
    purpose: "Separate samples, internal work and client evidence",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "examples-sample-client-handoff",
    path: "/examples/sample-client-handoff",
    template: "evidence_detail",
    phase: "P1",
    purpose: "Clearly labeled fictional/CH illustrative artifact",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "about",
    path: "/about",
    template: "about",
    phase: "P1",
    purpose: "Actual experience, operating principles and limits",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "business-backup-check",
    path: "/business-backup-check",
    template: "self_check",
    phase: "P1",
    purpose: "Ungated useful reflection, no validated scoring",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "contact",
    path: "/contact",
    template: "contact",
    phase: "P1",
    purpose: "Working low-data request flow",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "privacy",
    path: "/privacy",
    template: "policy",
    phase: "P1",
    purpose: "Accurately explain actual processing",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "terms",
    path: "/terms",
    template: "policy",
    phase: "P1",
    purpose: "Appropriate website-use terms, not substitute for service agreement",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },
  {
    id: "accessibility",
    path: "/accessibility",
    template: "policy",
    phase: "P1",
    purpose: "Actual accessibility work, contact and known limitations",
    indexing: "index_if_published",
    release_gate: "Approved copy, working links, accessibility and functional tests"
  },

  // P2 ROUTES (Auth & Client Workspace)
  {
    id: "access-gateway",
    path: "/access",
    template: "auth",
    phase: "P2",
    purpose: "Secure entry, session recovery and role-based routing",
    indexing: "noindex",
    release_gate: "Verified auth, safe redirects, enumeration defenses"
  },
  {
    id: "sign-in",
    path: "/auth/sign-in",
    template: "auth",
    phase: "P2",
    purpose: "Secure entry, session recovery and role-based routing",
    indexing: "noindex",
    release_gate: "Verified auth, safe redirects"
  },
  {
    id: "sign-up",
    path: "/auth/sign-up",
    template: "auth",
    phase: "P2",
    purpose: "Secure entry with invitation handling",
    indexing: "noindex",
    release_gate: "Verified auth, safe redirects"
  },

  // P3 PROVIDER WORKSPACE (Conditional)
  {
    id: "for-providers",
    path: "/for-providers",
    template: "provider_info",
    phase: "P3",
    purpose: "Explain selective provider participation and application",
    indexing: "index_if_published",
    release_gate: "Specific offer/evidence/workflow approved"
  },

  // P4+ ROUTES (Conditional)
  {
    id: "provider-application",
    path: "/provider-application",
    template: "provider_form",
    phase: "P2_OR_LATER",
    purpose: "Collect minimal relevant provider proposal",
    indexing: "index_if_published",
    release_gate: "Specific offer/evidence/workflow approved"
  },

  // SYSTEM ROUTES - request-received error states
  {
    id: "request-received",
    path: "/request-received",
    template: "system_state",
    phase: "P1_AS_NEEDED",
    purpose: "Show exact state without exposing private details",
    indexing: "noindex",
    release_gate: "Use only if actual verified workflow requires route"
  },
  {
    id: "request-error",
    path: "/request-error",
    template: "system_state",
    phase: "P1_AS_NEEDED",
    purpose: "Show exact state without exposing private details",
    indexing: "noindex",
    release_gate: "Use only if actual verified workflow requires route"
  },
  {
    id: "booking-return",
    path: "/booking-return",
    template: "system_state",
    phase: "P1_AS_NEEDED",
    purpose: "Show exact state without exposing private details",
    indexing: "noindex",
    release_gate: "Use only if actual verified workflow requires route"
  },

  // INTERNAL ROUTES (Permission-scoped)
  {
    id: "ops-dashboard",
    path: "/ops",
    template: "operations_overview",
    phase: "P2_TO_P4",
    purpose: "Exceptions first dashboard",
    indexing: "noindex",
    release_gate: "Least-privilege action/field permissions"
  },
  {
    id: "ops-leads",
    path: "/ops/leads",
    template: "operations",
    phase: "P2_TO_P4",
    purpose: "Leads and contact requests",
    indexing: "noindex",
    release_gate: "Least-privilege action/field permissions"
  },

  // CONDITIONAL ROUTES - must not be implemented until review
  {
    id: "resources-index",
    path: "/resources",
    template: "resource_index",
    phase: "P2_OR_LATER",
    purpose: "Browse genuinely available helpful content",
    indexing: "index_if_published",
    release_gate: "Specific offer/evidence/workflow approved and operational"
  },
  {
    id: "resources-slug",
    path: "/resources/:slug",
    template: "article",
    phase: "P2_OR_LATER",
    purpose: "Read an approved owned article",
    indexing: "index_if_published",
    release_gate: "Specific offer/evidence/workflow approved and operational"
  },

  // P4+ TRANSACTIONAL ROUTES - NOT IMPLEMENTED UNTIL P4 APPROVAL
  {
    id: "checkout",
    path: "/checkout/:order_token",
    template: "commerce",
    phase: "P4_OPTIONAL",
    purpose: "Approved checkout with secure payment processing",
    indexing: "noindex",
    release_gate: "Product ready, terms/tax/refund/seller/payment tests"
  },

  // PUBLIC PAGES (Already implemented in index.tsx but should have proper export)
  {
    id: "homepage-sections",
    path: "/components/sections",
    template: "homepage_components",
    phase: "P1",
    purpose: "All homepage sections must implement exact spec layout"
  },

  // CONDITIONAL PROVIDER ROUTES
  {
    id: "for-providers-disclosure",
    path: "/providers-disclosure",
    template: "policy",
    phase: "P2_OR_LATER",
    purpose: "Provider & compensation disclosure",
    indexing: "index_if_published"
  }
] as const;

export type RouteEntry = typeof ROUTE_MANIFEST[number];
export type PublicRoute = Exclude<RouteEntry, { template: "commerce" | "operations_overview" }>;
