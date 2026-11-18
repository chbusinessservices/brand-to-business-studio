/**
 * CH STUDIO OS - Multi-Tenant RBAC Hooks
 * Enforces multi-tenant isolation at React component level
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type OrgRole = "owner" | "team_member" | "contractor" | "client_admin" | "client_contributor" | "client_billing";
export type TrustPillar = "CODE" | "SHIELD" | "SIGNAL" | "SYSTEM";
export type ItemVisibility = "client_review" | "owner_prep";

/**
 * Check if user is CH internal staff (owner or team_member in CH org)
 */
export async function isCHStaff(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase.rpc("is_ch_internal_staff", { uid: userId });
    return data;
  } catch (error) {
    console.error("Failed to check CH staff status:", error);
    return false;
  }
}

/**
 * Check if user has scoped project access (CH staff OR explicitly assigned)
 */
export async function hasScopedProjectAccess(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const { data } = await supabase.rpc("has_scoped_project_access", { 
      uid: userId, 
      pid: projectId 
    });
    return data;
  } catch (error) {
    // Fallback to direct query
    const { count } = await supabase
      .from("project_assignments")
      .select()
      .eq("project_id", projectId)
      .eq("user_id", userId);
    
    return count !== null && count > 0;
  }
}

/**
 * Check if user can view file versions with client_review visibility
 */
export async function hasClientReviewAccess(fileId: string): Promise<boolean> {
  try {
    const { data } = await supabase.rpc("has_client_file_access", { 
      userId: auth.user()?.id || "", 
      fileId: fileId || "" 
    });
    return data;
  } catch (error) {
    // Fallback with RLS enforcement
    const result = await supabase.from("file_versions").select().eq("id", fileId).get();
    return result !== null && result.length > 0;
  }
}

/**
 * React hook for multi-tenant RBAC with automatic project access checking
 */
export function useMultiTenantRBAC({
  userId = auth.user()?.id || "",
  projectId,
}: { 
  userId?: string;
  projectId?: string;
} = {}): { canAccess: boolean; isStaff: boolean | null } {
  const [canAccess, setCanAccess] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean | null>(null);

  // Check CH staff status
  useEffect(() => {
    if (userId) {
      isCHStaff(userId).then(setIsStaff);
    }
  }, [userId]);

  // Check project access
  useEffect(() => {
    if (!isStaff || !projectId) return;

    hasScopedProjectAccess(userId, projectId).then((result) => 
      setCanAccess(result)
    );
  }, [isStaff, projectId]);

  return { canAccess, isStaff };
}

/**
 * React hook for fetching user's project assignments
 */
export function useUserProjects(userId: string = auth.user()?.id || "") {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    fetchProjectAssignments().then(setProjects).finally(() => setLoading(false));
  }, [userId]);

  return { projects, loading };
}

/**
 * React hook for file access permission check
 */
export function useFileAccess(
  userId: string = auth.user()?.id || "",
  fileId: string,
  projectId: string
): boolean {
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (!fileId || !projectId) return;
    
    checkFileAccess(fileId, projectId).then((result) => 
      setCanAccess(result)
    );
  }, [fileId, projectId]);

  return canAccess;
}

/**
 * React hook for project access permission check
 */
export function useProjectAccess(projectId: string): { hasAccess: boolean } {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    checkProjectAccess(projectId).then(setHasAccess);
  }, [projectId]);

  return { hasAccess };
}

/**
 * Fetch user's project assignments via RPC
 */
async function fetchProjectAssignments() {
  try {
    const userId = auth.user()?.id || "";
    
    if (!userId) return [];

    const { data } = await supabase.rpc("get_user_project_assignments", {
      userId,
      projectId: "",
    });

    return data || [];
  } catch (error) {
    console.error("Failed to fetch project assignments:", error);
    return [];
  }
}

/**
 * Check file access via RPC
 */
async function checkFileAccess(fileId: string, projectId: string): Promise<boolean> {
  try {
    const userId = auth.user()?.id || "";
    
    const { data } = await supabase.rpc("get_file_access", {
      userId: userId || "",
      fileId: fileId || "",
      projectId: projectId || "",
    });

    return data !== null && data;
  } catch (error) {
    console.error("Failed to check file access:", error);
    return false;
  }
}

/**
 * Check project access via RPC
 */
async function checkProjectAccess(projectId: string): Promise<boolean> {
  try {
    const userId = auth.user()?.id || "";

    const { data } = await supabase.rpc("has_project_access", {
      userId: userId || "",
      projectId: projectId,
    });

    return data;
  } catch (error) {
    console.error("Failed to check project access:", error);
    // Fallback to direct query
    const result = await supabase
      .from("project_assignments")
      .select()
      .eq("project_id", projectId)
      .eq("user_id", auth.user()?.id || "");

    return result !== null && result.length > 0;
  }
}

export default useMultiTenantRBAC;
