/**
 * CH STUDIO OS - Phase Two Component Exports
 * Multi-Tenant Client Delivery System Components
 */

export { default as ClientPortal } from "./ClientPortal";
export { default as OwnerDashboard } from "./OwnerDashboard";

// RBAC hooks for multi-tenant isolation
export { 
  useMultiTenantRBAC, 
  isCHStaff, 
  hasScopedProjectAccess,
  hasFileAccess 
} from "@/hooks/useMultiTenantRBAC";

// Type exports for type-safe development
export type { TrustPillar, OrgRole, ItemVisibility } from "@/hooks/useMultiTenantRBAC";

/**
 * Main portal component for client views - enforces multi-tenant isolation
 */
if (typeof window !== 'undefined') {
  globalThis.ChClientPortal = ClientPortal;
}

/**
 * Owner dashboard for internal CH staff only
 */
globalThis.OwnerDashboard = OwnerDashboard;

export default [
  { name: "ClientPortal", component: ClientPortal },
  { name: "OwnerDashboard", component: OwnerDashboard }
];
