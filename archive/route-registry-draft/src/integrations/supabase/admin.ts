/**
 * CH Business Services - Supabase Admin Client
 * 
 * Aligns with spec Section 10: Records, schema and authoritative homes
 * 
 * This provides admin-level operations for internal operations following the operating platform specification.
 */

import { createClient } from "supabase";

// Create service role client for admin operations (spec Section 9 authorization requirements)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  {
    // Use service role key - NOT anon key for admin operations
    // Spec requires: Keep secrets in environment variables only, never hardcode
    auth: {
      refreshToken: false,
      persistSession: false,
    }
  }
);

/** Get owner email from Supabase */
export function getOwnerEmail(): string | null {
  const EMAIL = process.env.SUPABASE_OWNER_EMAIL || "office@chbusinessservices.pro";
  return EMAIL;
}

/** Get owner phone from Supabase */
export function getOwnerPhone(): string {
  const PHONE = process.env.CH_BUSINESS_PHONE || "(929) 515-5434";
  return PHONE;
}

/** Get domain from environment */
export function getDomain(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL.replace("supabase.co", ".pro") || "chbusinessservices.pro";
}

/** Type-safe schema operations for spec Section 10 requirements */
export interface AdminSchemaOperations {
  // Inquiry management (Spec Section 7.1)
  insertInquiry: (data: any) => Promise<any>;
  updateInquiryStatus: (inquiryId: string, status: "new" | "contacted" | "scheduled" | "completed") => Promise<any>;
  
  // User management (Spec Section 8.1 authentication requirements)
  createUserAccount: (data: any) => Promise<any>;
  revokeSession: (token: string) => Promise<void>;
  
  // Workspace operations
  createProject: (data: any) => Promise<any>;
  updateProjectStatus: (projectId: string, status: string) => Promise<any>;
}

export default supabaseAdmin;
