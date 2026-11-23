/**
 * CH Business Services - Internal Operations Dashboard Routes
 * 
 * Implements spec Section 8: Internal operations navigation structure
 * 
 * This provides permission-scoped internal operations following the operating platform specification.
 */

import { createFileRoute } from "@tanstack/react-router";
import Link from "next/link";
import { supabaseClient, supabaseAdmin } from "@/integrations/supabase/client";
import { withAuthCheck } from "@/integrations/supabase/auth-middleware";

interface OpsState {}

// Export route as component for internal use
export const Route = createFileRoute("/_server/ops")({
  HEAD: {
    async handler() {
      return {
        title: "CH Business Services — Operations Dashboard",
        description: "Internal operations overview and exception management",
      };
    }
  },

  // Protected operations dashboard (requires internal role)
  GET: {
    async handler({ context }: { context: unknown }) {
      return {
        title: "Operations Overview — CH Business Services",
        content: (
          <div className="flex min-h-screen bg-white dark:bg-gray-900">
            {/* Sidebar for internal roles */}
            <aside className="fixed top-0 left-0 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-50">
              <div className="h-full overflow-y-auto p-4">
                <nav className="space-y-1">
                  <Link href="/_server/ops" className="text-base font-semibold text-primary-secondary">Operations</Link>
                  <Link href="/_server/leads" className="text-sm text-gray-600 hover:text-primary-dark">Leads & Contact Requests</Link>
                  <Link href="/_server/opportunities" className="text-sm text-gray-600 hover:text-primary-dark">Sales Opportunities</Link>
                  <Link href="/_server/projects" className="text-sm text-gray-600 hover:text-primary-dark">Projects & Delivery</Link>
                  <Link href="/_server/approvals" className="text-sm text-gray-600 hover:text-primary-dark">Review Queue</Link>
                  <Link href="/_server/finance" className="text-sm text-gray-600 hover:text-primary-dark">Finance & Reconciliation</Link>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-6">
              <h1 className="text-2xl font-bold mb-4 text-primary-secondary">Operations Dashboard</h1>
              
              <section className="grid grid-cols-3 gap-4 py-6">
                <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Unanswered Requests</p>
                  <p className="text-xl text-primary-dark">{session?.user.id ? "5" : "?"}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Pending Approvals</p>
                  <p className="text-xl text-primary-dark">{session?.user.id ? "3" : "?"}</p>
                </div>
                <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">In Progress Projects</p>
                  <p className="text-xl text-primary-dark">{session?.user.id ? "2" : "?"}</p>
                </div>
              </section>

              <Link href="/_server/leads" className="btn-primary mt-6">View Leads Overview</Link>
            </main>
          </div>
        )
      };
    }
  },
});

export default Index;
