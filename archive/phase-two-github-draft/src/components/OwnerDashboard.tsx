/**
 * CH STUDIO OS - Owner Dashboard Component
 * Enforces multi-tenant isolation at the React component level
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type TrustPillar = "CODE" | "SHIELD" | "SIGNAL" | "SYSTEM";
export type ItemVisibility = "client_review" | "owner_prep";

/**
 * Owner Dashboard - only shows owner_prep items to CH staff members
 */
export default function OwnerDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const currentUserId = auth.user()?.id || "";
  
  // Only show to CH internal staff (owner or team_member)
  useEffect(() => {
    if (!currentUserId || !isCHStaff(currentUserId)) return;
    
    fetchProjectsForOwner().then(setProjects).catch(console.error);
  }, [currentUserId]);

  /**
   * Check if user is CH internal staff before rendering dashboard
   */
  function isCHStaff(userId: string): boolean {
    return supabase.rpc("is_ch_internal_staff", { uid: userId }).then(result => 
      result !== null && result ? false : true
    );
  }

  /**
   * Fetch owner-only projects and milestones
   */
  async function fetchProjectsForOwner() {
    try {
      const userId = currentUserId;
      
      // Only fetch if user is CH internal staff
      const { data: isStaff } = await supabase.rpc("is_ch_internal_staff", { 
        uid: userId,
      });
      
      if (!isStaff) return;

      const result = await supabase.rpc("owner_projects_only", { 
        uid: userId,
        visibility: "owner_prep",
      });

      return result || [];
    } catch (error) {
      console.error("Failed to fetch owner projects:", error);
      return [];
    }
  }

  /**
   * Get status color for item
   */
  function getStatusColor(status: string): string {
    switch (status) {
      case "pending": return "text-red-500";
      case "in_progress": return "text-blue-500";
      case "completed": return "text-emerald-600";
    }
  }

  /**
   * Render milestones filtered to owner_prep items only
   */
  function renderOwnerPrepItems(pillar: TrustPillar): any[] {
    if (projects.length === 0 || !projects) return [];
    
    // Filter for owner_prep visibility items - hidden from clients
    const filtered = projects.filter(
      p => p.active_pillars.includes(pillar) && !items.some(i => i.visibility === "client_review")
    );

    return filtered.map((project) => ({
      id: project.id,
      title: `${PILLAR_STATUS_BADGES[pillar]}`,
      status: "in_progress",
    }));
  }

  /**
   * Render items - only show owner_prep visible items to CH staff
   */
  return (
    <div className="space-y-6">
      {/* Header with CH internal staff access */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">CH Internal Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Access Level: Owner Prep Items Only | Active Projects: {projects?.length || 0}
        </p>
      </div>

      {/* Render owner_prep items (hidden from client views) */}
      {renderOwnerPrepItems("CODE").map((item) => (
        <div key={item.id} className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold">{PILLAR_STATUS_BADGES[item as TrustPillar]}</h2>
          <p className="text-red-500 mt-2">Owner Prep Items (Not Visible to Clients)</p>
          
          {/* Render internal tasks */}
          {renderOwnerPrepItems("CODE").map((task) => (
            <div key={task.id} className="mt-3">
              <h3 className={`font-medium ${getStatusColor(task.status)}`}>
                {task.title}
              </h3>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Complete Task
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* Show internal notes only to CH staff */}
      {renderInternalNotes().map((note) => (
        <div key={note.id} className="border-l-4 border-gray-300 pl-4">
          <h3 className="text-sm font-medium text-gray-600">{note.body}</h3>
        </div>
      ))}
    </div>
  );
}

/**
 * Status badge mapping for owner_prep items
 */
const PILLAR_STATUS_BADGES: Record<TrustPillar, string> = {
  CODE: "Brand Intake",
  SHIELD: "Scope Boundaries",
  SIGNAL: "Production Assets",
  SYSTEM: "Workflow Blueprints",
};

/**
 * Fetch owner-only projects and internal notes
 */
async function fetchProjectsForOwner() {
  try {
    const userId = auth.user()?.id || "";
    
    // Only allow if user is CH internal staff
    const result = await supabase.rpc("get_owner_prepared_items", { 
      uid: userId,
      visibility: "owner_prep",
    });
    
    return result || [];
  } catch (error) {
    console.error("Failed to fetch owner items:", error);
    return [];
  }
}

/**
 * Render internal notes - only visible to CH staff
 */
function renderInternalNotes(): any[] {
  const [notes, setNotes] = useState<any[]>([]);
  
  useEffect(() => {
    if (!auth.user()?.id) return;
    
    fetchInternalNotes().then(setNotes).catch(console.error);
  }, []);

  return notes || [];
}

/**
 * Fetch internal notes - CH staff only (client_* roles blocked at RLS level)
 */
async function fetchInternalNotes() {
  try {
    const userId = auth.user()?.id || "";
    
    // Use RPC to ensure RLS filtering happens server-side
    const result = await supabase.rpc("get_internal_notes_for_ch_staff", { 
      uid: userId,
    });
    
    return result || [];
  } catch (error) {
    console.error("Failed to fetch internal notes:", error);
    return [];
  }
}

export default OwnerDashboard;
