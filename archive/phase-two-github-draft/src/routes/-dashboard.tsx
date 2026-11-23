/**
 * CH STUDIO OS - Owner Dashboard Route
 * Enforces multi-tenant isolation at the React route level
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardRoute() {
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    fetchOwnerProjects();
  }, []);

  /**
   * Fetch owner-only projects for CH internal staff
   */
  async function fetchOwnerProjects() {
    try {
      const userId = supabase.auth.user()?.id || "";
      
      if (!userId) {
        window.location.href = "/auth/sign-in";
        return;
      }

      // Check if user is CH internal staff (owner or team_member roles)
      const result = await supabase.rpc("is_ch_internal_staff", { 
        uid: userId,
      });

      if (!result || !result[0] || !result[0]) {
        return;
      }

      // Fetch owner_prep items only (hidden from client views)
      const projectsData = await supabase.rpc("get_owner_prepared_items", { 
        uid: userId,
        visibility: "owner_prep",
      });

      setProjects(projectsData ? (projectsData as any[]) : []);
    } catch (error) {
      console.error("Failed to fetch owner projects:", error);
      return;
    }
  }

  /**
   * Check if user is CH internal staff using RBAC function
   */
  function isCHStaff(userId: string): boolean {
    try {
      const result = supabase.rpc("is_ch_internal_staff", { 
        uid: userId,
      });
      
      return result && result[0] && result[0];
    } catch (error) {
      console.error("CH staff check failed:", error);
      return false;
    }
  }

  if (!projects.length || !isCHStaff(projects[0].id)) {
    return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-4">CH Internal Dashboard</h1>
      
      {projects.map((project: any) => (
        <div key={project.id} className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <p className="text-gray-600 mt-1">{project.objective}</p>
          
          {project.milestones.map((milestone: any) => (
            <div key={milestone.id} className="mt-2">
              <h3 className="font-medium">{milestone.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                milestone.status === "pending" ? "bg-red-200" : 
                milestone.status === "in_progress" ? "bg-blue-200" : 
                "bg-green-200"
              }`}>
                {milestone.status}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Component for owner prep visibility filtering
 */
function useOwnerPrepVisibility(
  projectId: string,
  userId: string = supabase.auth.user()?.id || ""
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    supabase.rpc("check_owner_prep_visibility", { 
      projectId: projectId,
      userId: userId || "",
    }).then(setVisible);
  }, [projectId, userId]);

  return visible;
}

export default DashboardRoute;
