/**
 * CH Studio OS Phase 2 Types - Multi-Tenant Client Delivery System
 * ====================================
 */

import { supabase } from "./client";

export type OrgRole = "owner" | "team_member" | "contractor" | "client_admin" | "client_contributor" | "client_billing";
export type TrustPillar = "CODE" | "SHIELD" | "SIGNAL" | "SYSTEM";
export type ItemVisibility = "client_review" | "owner_prep";
export type ApprovalStatus = "pending" | "approved" | "changes_requested" | "superseded";

export const RBAC_FUNCTIONS = {
  isCHStaff: (uid: string) => supabase.rpc("is_ch_internal_staff", { uid }),
  hasScopedProjectAccess: (uid: string, pid: string) => 
    supabase.rpc("has_scoped_project_access", { uid, pid }),
};

export interface ProjectAssignment {
  id: string;
  projectId: string;
  userId: string;
  role: OrgRole;
  createdAt: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  isCHInternal: boolean;
}

export type ProjectStatus = "onboarding" | "active" | "review" | "completed" | "paused";

export interface ActiveProject {
  id: string;
  name: string;
  objective: string | null;
  status: ProjectStatus;
  activePillars: TrustPillar[];
}

export type VisibilityType = ItemVisibility;

export function hasClientReviewPermission(visibility: VisibilityType): boolean {
  return visibility === "client_review";
}

export function isOwnerPrepItem(visibility: VisibilityType): boolean {
  return visibility === "owner_prep";
}

export interface Milestone {
  id: string;
  pillar: TrustPillar;
  title: string;
  visibility: VisibilityType;
  status: "pending" | "in_progress" | "completed";
  requiresExternalCounsel: boolean;
}

export interface FileAsset {
  id: string;
  title: string;
  currentVersionNumber: number;
  pillar: TrustPillar;
  visibility: VisibilityType;
}

export type ApprovalDecision = 
  | { decision: "approved" }
  | { decision: "changes_requested"; comments: string }
  | { decision: "superseded"; versionCommented?: string };

export interface FileVersionData {
  id: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  versionNumber: number;
  visibility: VisibilityType;
}

// Helper function to check file access
export async function checkFileAccess(fileId: string, projectId: string): Promise<boolean> {
  const [result] = await supabase.rpc("get_file_access", { fileId, projectId });
  return result === true;
}

export interface ApprovalDecisionData {
  id: string;
  decision: ApprovalDecision["decision"];
  decidedBy: string;
  disclaimerAcknowledged: boolean;
}
