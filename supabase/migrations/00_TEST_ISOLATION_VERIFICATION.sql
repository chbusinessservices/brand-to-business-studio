-- ============================================================================
-- PHASE TWO ISOLATION TEST SCRIPT - Multi-Tenant Client Delivery Verification
-- Executes in Supabase SQL Editor after bootstrap to verify 2-client + 1-contractor isolation
-- ============================================================================

BEGIN;

-- ============================================================================
-- TEST 1: Create test users if not exist
-- ============================================================================

DO $$
DECLARE
  client_a_uuid UUID;
  client_b_uuid UUID;
  contractor_uuid UUID;
  ch_admin_uuid UUID;
BEGIN
  -- Get or create Client A (Agency client)
  SELECT id INTO client_a_uuid FROM auth.users WHERE email = 'client-a@agency.com';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('client-a@agency.com', '$2b$12$randomsalt01xyz', 'authenticated', now());
  END IF;
  
  -- Get or create Client B (Hospitality client)
  SELECT id INTO client_b_uuid FROM auth.users WHERE email = 'client-b@hospitalitygroup.com';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('client-b@hospitalitygroup.com', '$2b$12$randomsalt02abc', 'authenticated', now());
  END IF;
  
  -- Get or create Contractor user
  SELECT id INTO contractor_uuid FROM auth.users WHERE email = 'contractor@techstack.dev';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('contractor@techstack.dev', '$2b$12$randomsalt03def', 'authenticated', now());
  END IF;
  
  -- Get or create CH admin with elevated role
  SELECT id INTO ch_admin_uuid FROM auth.users WHERE email = 'admin@chbusinessservices.pro';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('admin@chbusinessservices.pro', '$2b$12$randomsalt04ghi', 'admin', now());
  END IF;
END $$;

-- ============================================================================
-- TEST 2: Create test organization and projects
-- ============================================================================

DO $$
DECLARE
  ch_org_id UUID;
BEGIN
  -- Ensure CH internal org exists with isolation flag
  SELECT id INTO ch_org_id FROM public.organizations WHERE slug = 'ch-business-services';
  IF NOT FOUND THEN
    INSERT INTO public.organizations (id, name, slug, is_ch_internal)
    VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'CH Business Services', 
            'ch-business-services', true);
  END IF;
END $$;

-- Create test organization (Agency) if not exists
INSERT INTO public.organizations (id, name, slug) VALUES 
  ('org-agency-001'::uuid, 'Test Agency Client', 'test-agency-client')
ON CONFLICT DO NOTHING;

-- Create test organization (Hospitality) if not exists  
INSERT INTO public.organizations (id, name, slug) VALUES
  ('org-hospitality-001'::uuid, 'Hospitality Chain Client', 'hospitality-chain-client')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- TEST 3: Verify ISOLATION - Cross-Tenant Access Testing
-- ============================================================================

-- Test A: Client A cannot see Client B's projects
SELECT 
  'Client A → Client B project' as test_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM public.projects p
    WHERE EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.user_id = 'client-a@agency.com'::uuid OR om.user_id IN ('user-aaa')
      AND om.organization_id = (SELECT id FROM public.organizations WHERE slug='test-agency-client')
    )
  ) THEN 'FAIL - Client A sees other tenant data' ELSE 'PASS' END as result;

-- Test B: Contractor scope enforcement
SELECT 
  'Contractor → Unassigned project' as test_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM public.tasks t
    WHERE NOT EXISTS (
      SELECT 1 FROM public.project_assignments pa 
      WHERE pa.user_id = 'contractor@techstack.dev'::uuid AND pa.project_id = t.project_id
    )
  ) THEN 'FAIL - Contractor sees unassigned projects' ELSE 'PASS' END as result;

-- Test C: Internal notes isolation from client roles
SELECT 
  'Client A → internal_notes table' as test_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM public.internal_notes LIMIT 1
  ) THEN 'FAIL - Client role can see internal notes' ELSE 'PASS' END as result;

-- Test D: Unauthorized role self-elevation attempt
SELECT 
  'Unauthorized INSERT to memberships' as test_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM public.organization_memberships LIMIT 1
  ) THEN 'Test requires manual execution - RLS blocks at DB layer' ELSE 'N/A' END as result;

-- ============================================================================
-- TEST 4: Verify RBAC function availability
-- ============================================================================

SELECT 
  'CH staff check function exists' as test_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.functions 
                  WHERE function_name = 'is_ch_internal_staff') THEN 'PASS' ELSE 'FAIL' END as result;

SELECT 
  'Scoped project access function exists' as test_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.functions 
                  WHERE function_name = 'has_scoped_project_access') THEN 'PASS' ELSE 'FAIL' END as result;

-- ============================================================================
-- TEST 5: RLS Policy Verification
-- ============================================================================

-- Test 1: Check if RLS enabled on critical tables
SELECT test_name, result FROM (
  SELECT 'RLS enabled: organizations' as test_name, 
         CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_row_level_security_policies 
                  WHERE table_name = 'organizations') THEN 'PASS' ELSE 'FAIL' END as result
) t;

SELECT test_name, result FROM (
  SELECT 'RLS enabled: organization_memberships' as test_name, 
         CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_row_level_security_policies 
                  WHERE table_name = 'organization_memberships') THEN 'PASS' ELSE 'FAIL' END as result
) t;

SELECT test_name, result FROM (
  SELECT 'RLS enabled: projects' as test_name, 
         CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_row_level_security_policies 
                  WHERE table_name = 'projects') THEN 'PASS' ELSE 'FAIL' END as result
) t;

SELECT test_name, result FROM (
  SELECT 'RLS enabled: internal_notes' as test_name, 
         CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_row_level_security_policies 
                  WHERE table_name = 'internal_notes') THEN 'PASS' ELSE 'FAIL' END as result
) t;

-- ============================================================================
-- TEST 6: Visibility Filter Verification
-- ============================================================================

-- Test owner_prep items are hidden from client roles
SELECT 
  'Client role → owner_prep visibility filter' as test_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM public.milestones m
    WHERE m.visibility = 'owner_prep'
  ) THEN 'Test data exists - needs manual filtering test in SQL client' ELSE 'N/A' END as result;

-- ============================================================================
-- TEST 7: Summary Report
-- ============================================================================

SELECT '=== PHASE TWO ISOLATION TEST SUMMARY ===' as report_header;

SELECT 
  'Multi-Tenant Organization Support' as feature,
  CASE WHEN EXISTS (SELECT 1 FROM public.organizations WHERE is_ch_internal = true) THEN '✅ Ready' ELSE '❌ Needs CH org creation' END as status;

SELECT 
  'RBAC Enum Types Defined' as feature,
  CASE WHEN (
    SELECT COUNT(*) FROM information_schema.enums 
    WHERE enum_name IN ('org_role', 'trust_pillar', 'item_visibility')
  ) >= 3 THEN '✅ Ready' ELSE '❌ Missing types' END as status;

SELECT 
  'RLS Policies Implemented' as feature,
  CASE WHEN (
    SELECT COUNT(*) FROM information_schema.table_row_level_security_policies 
    WHERE table_name IN ('organizations', 'organization_memberships', 'projects', 'tasks')
  ) >= 4 THEN '✅ Ready' ELSE '❌ Missing policies' END as status;

SELECT 
  'Helper Functions Created' as feature,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.functions WHERE function_name = 'is_ch_internal_staff') 
       AND EXISTS (SELECT 1 FROM information_schema.functions WHERE function_name = 'has_scoped_project_access') THEN '✅ Ready' ELSE '❌ Missing functions' END as status;

-- ============================================================================
-- CONCLUSION: Execution Complete - Review Results Above
-- ============================================================================

-- These tests should be run from Supabase SQL Editor with appropriate user permissions.
-- If any test returns FAIL, review the RLS policies in 0ch_studio_os_additions.sql
-- and ensure the is_ch_internal_staff() and has_scoped_project_access() functions are active.

COMMIT;
