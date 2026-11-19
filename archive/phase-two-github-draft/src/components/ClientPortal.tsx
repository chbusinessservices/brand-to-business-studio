/**
 * CH STUDIO OS - Client Portal Component
 * Enforces multi-tenant isolation at the React component level
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type TrustPillar = "CODE" | "SHIELD" | "SIGNAL" | "SYSTEM";

interface PillarCardProps {
  pillar: TrustPillar;
  title: string;
  status?: "pending" | "in_progress" | "completed";
  milestones: any[];
}

/**
 * Status badge mapping for pillars
 */
const PILLAR_STATUS_BADGES: Record<TrustPillar, string> = {
  CODE: "Brand Strategy",
  SHIELD: "Scope & Boundaries",
  SIGNAL: "Market Presence",
  SYSTEM: "Delivery Operations",
};

/**
 * Render Client Portal - only shows client_review visible items
 */
export default function ClientPortal() {
  const [projects, setProjects] = useState<any[]>([]);
  const currentUserId = auth.user()?.id || "";
  
  useEffect(() => {
    if (!currentUserId) return;
    
    fetchProjectsForUser().then(setProjects).catch(console.error);
  }, [currentUserId]);

  /**
   * Fetch user's projects - only client_admin roles can see clients' projects
   */
  async function fetchProjectsForUser() {
    try {
      const userId = currentUserId;
      const result = await supabase.rpc("projects_for_current_user", { 
        uid: userId,
        visibility: "client_review",
      });

      return result || [];
    } catch (error) {
      console.error("Failed to fetch user projects:", error);
      return [];
    }
  }

  /**
   * Get status color for pillar
   */
  function getStatusColor(status: string): string {
    switch (status) {
      case "pending": return "text-orange-500";
      case "in_progress": return "text-green-500";
      case "completed": return "text-emerald-600";
    }
  }

  /**
   * Render milestone cards
   */
  function renderMilestones(pillar: TrustPillar): any[] {
    if (projects.length === 0 || !projects) return [];
    
    // Filter by pillar visibility - only show client_review items
    const filtered = projects.filter(p => p.active_pillars.includes(pillar));

    return filtered.map((project) => ({
      id: project.id,
      title: PILLAR_STATUS_BADGES[pillar],
      status: "pending",
    }));
  }

  /**
   * Main render - only show client_review visible items
   */
  return (
    <div className="space-y-6">
      {/* Header with user info and access level */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">My Client Portal</h1>
        <p className="text-sm text-gray-500 mt-1">
          Active Projects: {projects?.length || 0} | Access Level: Client Review
        </p>
      </div>

      {/* Render each project's milestones */}
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold">{project.name}</h2>
          <p className="text-gray-600">{project.objective}</p>
          
          {/* Render milestone cards */}
          {renderMilestones("CODE").map((milestone) => (
            <div key={milestone.id} className="mb-4">
              <h3 className={`font-medium ${getStatusColor(milestone.status)}`}>
                {milestone.title}
              </h3>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Start Working
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Alternative simple implementation - direct Supabase query with RBAC
 */
export function useClientProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const userId = auth.user()?.id || "";
  
  useEffect(() => {
    if (!userId) return;
    
    fetchProjectsWithRBAC(userId).then(setProjects);
  }, [userId]);

  return { projects };
}

/**
 * Fetch projects with RBAC filtering (client_review only)
 */
async function fetchProjectsWithRBAC(userId: string): Promise<any[]> {
  try {
    const result = await supabase.rpc("get_projects_with_client_access", { 
      userId,
      visibility: "client_review"
    });
    
    return result || [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default ClientPortal;
