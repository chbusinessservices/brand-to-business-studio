/**
 * CH Business Services - Client Workspace Main Route
 * 
 * Implements spec Section 8: Authentication, roles and workspace navigation
 * 
 * This is the protected dashboard for authenticated users following the operating platform specification.
 */

import { createFileRoute } from "@tanstack/react-router";
import Link from "next/link";
import { supabaseClient } from "@/integrations/supabase/client";
import type { AuthContext } from "supabase-js-types";

interface AuthContext {}

export const Route = createFileRoute("/_authenticated")({
  HEAD: {
    async handler() {
      return {
        title: "CH Business Services — Client Workspace",
        description: "Manage your business setup, projects, and work progress",
      };
    }
  },

  // Main client workspace (protected by auth)
  GET: {
    async handler({ context }: { context: AuthContext }) {
      // Get current user info from Supabase
      const { data: { session } } = supabaseClient.getSession();
      
      return {
        title: `Dashboard — CH Business Services`,
        content: (
          <div className="flex min-h-screen bg-white dark:bg-gray-900">
            {/* Sidebar Navigation - spec Section 8.1 */}
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <nav className="py-4 px-3">
                <Link href="/_authenticated" className="text-base font-semibold text-primary-secondary mb-6">
                  CH Business Services
                </Link>
                
                <div className="my-4 border-t border-gray-200 dark:border-gray-800"></div>
                
                <ul className="space-y-1">
                  <li><Link href="/_authenticated/overview" className="text-sm font-semibold text-gray-600 hover:text-primary-dark transition-colors">Overview</Link></li>
                  <li><Link href="/_authenticated/projects" className="text-sm font-semibold text-gray-600 hover:text-primary-dark transition-colors">Projects</Link></li>
                  <li><Link href="/_authenticated/approvals" className="text-sm font-semibold text-gray-600 hover:text-primary-dark transition-colors">Approvals Queue</Link></li>
                  <li><Link href="/_authenticated/settings" className="text-sm font-semibold text-gray-600 hover:text-primary-dark transition-colors">Settings</Link></li>
                </ul>
                
                {/* User Info */}
                <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{session?.user.email}</p>
                  <button onClick={() => window.location.href = "/sign-in"} className="mt-3 text-xs text-primary-dark hover:underline">Sign Out</button>
                </div>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 pt-16">
              <h1 className="text-2xl font-bold mb-4">Welcome to CH Business Services</h1>
              
              {/* Overview Section - spec Section 8.1 client workspace */}
              <div className="grid grid-cols-3 gap-4 py-6">
                <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4">
                  <h2 className="text-sm font-semibold text-primary-secondary mb-2">Active Projects</h2>
                  <p className="text-base text-primary-dark">{session?.user.id ? "Loading projects..." : "0"}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4">
                  <h2 className="text-sm font-semibold text-primary-secondary mb-2">Pending Approvals</h2>
                  <p className="text-base text-primary-dark">3</p>
                </div>
                <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4">
                  <h2 className="text-sm font-semibold text-primary-secondary mb-2">Support Requests</h2>
                  <p className="text-base text-primary-dark">1 open</p>
                </div>
              </div>

              {/* Welcome Message */}
              <section className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold text-primary-secondary mb-3">Welcome Back</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This is your workspace for managing business setup, client projects, and work progress. 
                  Everything you need to track from discovery through handoff.
                </p>
              </section>

              {/* Navigation Links per spec Section 8.1 */}
              <div className="grid grid-cols-2 gap-4 py-6">
                <Link href="/_authenticated/overview" className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4 text-sm font-semibold text-gray-700 hover:bg-primary/5 transition-all">
                  Overview & Status
                </Link>
                <Link href="/_authenticated/projects" className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4 text-sm font-semibold text-gray-700 hover:bg-primary/5 transition-all">
                  Projects & Delivery
                </Link>
              </div>

              {/* Current User Info Display */}
              <section className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-6">
                <h3 className="text-base font-semibold text-primary-secondary mb-2">Your Workspace</h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Email: {session?.user.email || "Not set"}
                </p>

                <div className="mt-4 p-3 rounded-lg bg-primary/5">
                  <h4 className="text-sm font-medium text-primary-secondary mb-1">Access Level</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    You have client-level access to your own workspace and approved projects. 
                    Cannot access other clients' data without explicit assignment.
                  </p>
                </div>
              </section>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Link href="/_authenticated/overview" className="rounded-lg bg-primary/5 p-4 text-sm font-semibold text-primary-dark text-center">
                  Overview
                </Link>
                <Link href="/_authenticated/projects" className="rounded-lg bg-primary/5 p-4 text-sm font-semibold text-primary-dark text-center">
                  Projects
                </Link>
                <Link href="/_authenticated/approvals" className="rounded-lg bg-primary/5 p-4 text-sm font-semibold text-primary-dark text-center">
                  Approvals
                </Link>
              </div>

              {/* Disclaimer Section */}
              <div className="mt-8 rounded-lg border-l-4 border-gray-300 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Note: All workspace content is private and protected. Unauthorized access will be logged 
                  and reviewed according to spec Section 9 authorization requirements.
                </p>
              </div>
            </main>
          </div>
        )
      };
    }
  },
});

export default Index;
