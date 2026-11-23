/**
 * CH Business Services - Supabase Client Integration
 * 
 * Aligns with spec Section 10: Records, schema and authoritative homes
 * 
 * This file provides the browser client for Supabase operations following the operating platform specification.
 */

import { createClient } from "supabase";

// Create Supabase client with proper service role handling
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  {
    // Do NOT include real anon key here - it's environment variable based
    // The spec requires: Keep LOVABLE_API_KEY out of browser code
    auth: {
      refreshToken: false,
      persistSession: false,
    }
  }
);

/** Create admin client for server-side operations (spec Section 10) */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  {
    anonKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    auth: {
      persistSession: false,
    }
  }
);

// Helper for authenticated user session
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  {
    auth: {
      persistSession: true,
    }
  }
);

/** Type-safe Supabase operations following spec Section 10 schema requirements */
export interface SupabaseOperations {
  // Schema-specific operations
  insertInquiry: (data: InquiryData) => Promise<SupabaseResponse>;
  getInquiries: () => Promise<RowForTable<"public", "inquiries">[]>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<SupabaseResponse>;
  // Role-based operations
  canAccessProject: (userId: string | null) => Promise<boolean>;
  getOwnerInfo: (userId: string | null) => Promise<RowForTable<"public", "users"> | null>;
}

type InquiryData = {
  name: string;
  email: string;
  businessName?: string;
  website?: string;
  message: string;
  serviceInterest?: string[];
};

type SupabaseResponse = { data: any; error: Error | null };

type RowForTable<T, K extends keyof T> = T[K] & { id: string };

export type InquiryStatus = "new" | "contacted" | "scheduled" | "completed" | "archived";

export const SCHEMA_ANGLES = {
  inquiries: {
    // Schema fields from spec Section 10
    name: "text",
    email: "text", 
    businessName: "text",
    website: "text",
    message: "text[]",
    serviceInterest: "array(text)",
    status: "text",
    created_at: "timestamp with time zone",
  },
};

export default supabase;
