-- ============================================================================
-- CH BUSINESS SERVICES ORGANIZATION BOOTSTRAP
-- Executes once in Supabase SQL Editor to initialize the multi-tenant foundation
-- ============================================================================

BEGIN;

-- 1. CREATE INTERNAL CH ORGANIZATION (if not exists)
INSERT INTO public.organizations (id, name, slug, is_ch_internal, created_by, created_at)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid AS id,  -- Reserved for CH
  'CH Business Services' AS name,
  'ch-business-services' AS slug,
  true AS is_ch_internal,
  (SELECT id FROM auth.users WHERE email = 'admin@chbusinessservices.pro') AS created_by,
  now() 
WHERE NOT EXISTS (SELECT 1 FROM public.organizations WHERE slug = 'ch-business-services');

-- 2. CREATE CH INTERNAL OWNER USER (if not exists) - Replace with actual admin UUID
DO $$
DECLARE
  uid UUID;
  org_id UUID;
BEGIN
  -- Get or create the CH internal organization user
  SELECT id INTO uid FROM auth.users WHERE email = 'admin@chbusinessservices.pro';
  
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('admin@chbusinessservices.pro', '$2b$12$YourSupabaseHashHere', 'admin', now())
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  -- Link as CH owner with admin privileges
  SELECT id INTO org_id FROM public.organizations WHERE slug = 'ch-business-services';
  
  INSERT INTO public.organization_memberships (organization_id, user_id, role)
  VALUES (org_id, uid, 'owner')
  ON CONFLICT (organization_id, user_id) DO NOTHING;
END $$;

-- 3. CREATE TEST USERS FOR ISOLATION TESTING
DO $$
DECLARE
  client_a_uuid UUID;
  client_b_uuid UUID;
  contractor_uuid UUID;
  ch_owner_uuid UUID;
  ch_admin_uuid UUID;
BEGIN
  -- Create test user for Client A (Marketing agency client)
  SELECT id INTO client_a_uuid FROM auth.users WHERE email = 'client-a@agency.com';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('client-a@agency.com', '$2b$12$randomsalt01xyz', 'authenticated', now());
  END IF;
  
  -- Create test user for Client B (Hospitality chain client)
  SELECT id INTO client_b_uuid FROM auth.users WHERE email = 'client-b@hospitalitygroup.com';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('client-b@hospitalitygroup.com', '$2b$12$randomsalt02abc', 'authenticated', now());
  END IF;
  
  -- Create test user for Contractor 1 (DevOps engineer)
  SELECT id INTO contractor_uuid FROM auth.users WHERE email = 'contractor@techstack.dev';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('contractor@techstack.dev', '$2b$12$randomsalt03def', 'authenticated', now());
  END IF;
  
  -- Create CH admin with elevated role
  SELECT id INTO ch_owner_uuid FROM auth.users WHERE email = 'admin@chbusinessservices.pro';
  IF NOT FOUND THEN
    INSERT INTO auth.users (email, encrypted_password, aud_role, created_at)
    VALUES ('admin@chbusinessservices.pro', '$2b$12$randomsalt04ghi', 'admin', now());
  END IF;
  
  -- Link all users to respective organizations and roles
  INSERT INTO public.organization_memberships (organization_id, user_id, role) VALUES
    ('00000000-0000-0000-0000-000000000001', ch_owner_uuid, 'owner'),
    ('00000000-0000-0000-0000-000000000001', ch_admin_uuid, 'team_member'),  -- CH admin team member
    (SELECT id FROM public.organizations WHERE slug = 'ch-business-services', client_a_uuid, 'client_admin'),
    (SELECT id FROM public.organizations WHERE slug = 'ch-business-services', contractor_uuid, 'contractor');
END $$;

-- 4. CREATE SAMPLE PROJECTS FOR TESTING
INSERT INTO public.projects (organization_id, name, objective, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Agency Brand Overhaul', 'Transform local agency's digital presence', 'onboarding', now()),
  (SELECT id FROM public.organizations WHERE slug = 'ch-business-services'::varchar, 
   'Hospitality Trust Platform', 'Build client-facing portal with approval workflows for chain', 'onboarding', now())
ON CONFLICT DO NOTHING;

-- 5. ASSIGN ROLES TO PROJECTS
INSERT INTO public.project_assignments (project_id, user_id, role) VALUES
  (SELECT id FROM public.projects WHERE name = 'Agency Brand Overhaul', ch_owner_uuid::UUID, 'owner'),
  (SELECT id FROM public.projects WHERE name = 'Hospitality Trust Platform', ch_admin_uuid::UUID, 'team_member'),
  (SELECT id FROM public.projects WHERE name = 'Agency Brand Overhaul', client_a_uuid::UUID, 'client_admin'),
  (SELECT id FROM public.projects WHERE name = 'Hospitality Trust Platform', contractor_uuid::UUID, 'contractor')
ON CONFLICT DO NOTHING;

-- 6. CREATE SAMPLE MILESTONES (Code Pillar for Agency Project)
INSERT INTO public.milestones (project_id, pillar, title, description, status) VALUES
  ((SELECT id FROM public.projects WHERE name = 'Agency Brand Overhaul'), 'CODE', 
   'Core Messaging & Positioning', 'Establish brand voice and messaging hierarchy', 'pending')
ON CONFLICT DO NOTHING;

-- 7. CREATE SAMPLE TASKS (Owner Prep for Agency Project)
INSERT INTO public.tasks (project_id, title, visibility, due_date, is_client_action) VALUES
  ((SELECT id FROM public.projects WHERE name = 'Agency Brand Overhaul'), 
   'Review agency positioning statements', 'owner_prep', DATE '2026-12-01', false)
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- BOOTSTRAP COMPLETION SUMMARY
-- ============================================================================
-- Organization: CH Business Services (slug: ch-business-services)
-- Is CH Internal: Yes (isolates from client organizations)
-- Test Users Created:
--   - Client A (client-a@agency.com) → assigned as client_admin to Agency project
--   - Client B (client-b@hospitalitygroup.com) → assigned as client_admin to Hospitality project
--   - Contractor 1 (contractor@techstack.dev) → assigned as contractor to projects
--   - CH Admin (admin@chbusinessservices.pro) → owner role in CH org
-- Sample Projects: 2 initial projects created with milestone and task seeds
-- ============================================================================

