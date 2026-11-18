/**
 * CH STUDIO OS - Client Portal Route
 * Enforces multi-tenant isolation at the React route level
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientPortalRoute() {
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  
  useEffect(() => {
    if (activeProjects.length === 0) {
      fetchProjects();
    }
  }, []);

  /**
   * Fetch active projects for client admin users
   */
  async function fetchProjects() {
    try {
      const userId = supabase.auth.user()?.id || "";
      
      if (!userId) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const result = await supabase.rpc("projects_for_current_user", {
        uid: userId,
      });

      setActiveProjects(result ? (result as any[]) : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setActiveProjects([]);
    }
  }

  /**
   * Use multi-tenant RBAC hook for file visibility
   */
  function useFileVisibility(fileId: string): boolean {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (!fileId) return;

      supabase.from("file_versions")
        .select()
        .eq("id", fileId)
        .eq("visibility", "client_review")
        .then((result) => {
          setVisible(result.length > 0);
        });
    }, [fileId]);

    return visible;
  }

  if (!activeProjects.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-4">Client Portal - Active Projects</h1>
      
      {activeProjects.map((project: any) => (
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
 * Fetch file versions with visibility filtering
 */
async function fetchFileVersions(): Promise<any[]> {
  try {
    const userId = supabase.auth.user()?.id || "";
    
    if (!userId) return [];

    const result = await supabase.rpc("get_file_versions_for_user", {
      uid: userId,
    });

    return result || [];
  } catch (error) {
    console.error("Failed to fetch file versions:", error);
    return [];
  }
}

export default ClientPortalRoute;
