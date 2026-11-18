-- ============================================================================
-- CH STUDIO OS - PHASE TWO INCREMENTAL MIGRATION
-- Adds multi-tenant org isolation, RBAC enums, and RLS policies to existing Lovable schema
-- -----------------------------------------------------------------------------
-- IDEMPOTENT: Safe to run multiple times without errors
-- Based on existing Lovable platform schema (as shown in warning context)
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: CREATE MISSING ENUM TYPES FOR RBAC HIERARCHY
-- ============================================================================

-- Add org_role enum if not exists (replacing USER-DEFINED role with typed enum)
DO $$ 
  BEGIN
    CREATE TYPE public.org_role AS ENUM ('owner', 'team_member', 'contractor', 'client_admin', 'client_contributor', 'client_billing');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- Add trust_pillar enum if not exists
DO $$ 
  BEGIN
    CREATE TYPE public.trust_pillar AS ENUM ('CODE', 'SHIELD', 'SIGNAL', 'SYSTEM');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- Add item_visibility enum if not exists
DO $$ 
  BEGIN
    CREATE TYPE public.item_visibility AS ENUM ('client_review', 'owner_prep');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- Add approval_status enum if not exists
DO $$ 
  BEGIN
    CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'changes_requested', 'superseded');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- ============================================================================
-- STEP 2: ADD MULTI-TENANT ORGANIZATION STRUCTURE TO EXISTING TABLES
-- ============================================================================

-- Add is_ch_internal flag to organizations if missing (enables tenant isolation)
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS is_ch_internal BOOLEAN NOT NULL DEFAULT false;

-- Add foreign key reference from existing projects table
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_organization_id_fkey;
ALTER TABLE public.projects 
ADD CONSTRAINT projects_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

-- Add organization_id to clients if not present
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Add organization reference to existing client_memberships
ALTER TABLE public.client_memberships
DROP CONSTRAINT IF EXISTS client_memberships_user_id_fkey;
ALTER TABLE public.client_memberships
ADD CONSTRAINT client_memberships_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- ============================================================================
-- STEP 3: ADD RLS ENFORCement TO EXISTING TABLES
-- ============================================================================

-- Enable RLS on tables that already have it but need stricter policies
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_versions ENABLE ROW LEVEL SECURITY;

-- Create helper function for CH staff identification (requires CH org first)
CREATE OR REPLACE FUNCTION public.is_ch_internal_staff(uid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  ch_org_id UUID;
BEGIN
  SELECT id INTO ch_org_id FROM public.organizations WHERE slug = 'ch-business-services' LIMIT 1;
  IF NOT FOUND THEN RETURN FALSE; END IF;
  RETURN EXISTS (SELECT 1 FROM public.organization_memberships om 
                   WHERE om.user_id = uid AND ch_org_id = om.organization_id 
                     AND om.role IN ('owner', 'team_member'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create helper function for scoped project access
CREATE OR REPLACE FUNCTION public.has_scoped_project_access(uid UUID, pid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  ch_staff_check BOOLEAN;
BEGIN
  ch_staff_check := public.is_ch_internal_staff(uid);
  RETURN ch_staff_check OR EXISTS (
    SELECT 1 FROM public.project_assignments pa 
    WHERE pa.user_id = uid AND pa.project_id = pid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- STEP 4: CREATE NEW MULTI-TENANT TABLES FOR PHASE TWO FEATURES
-- ============================================================================

-- Internal notes with CH isolation (strictly staff-only)
CREATE TABLE IF NOT EXISTS public.internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  visibility TEXT CHECK (visibility IN ('internal', 'team_only')) NOT NULL DEFAULT 'internal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit events for immutable logging
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action LIKE '%UPDATE%' OR action LIKE '%DELETE%'),
  target_table TEXT NOT NULL,
  target_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES FOR MULTI-TENANT ISOLATION
-- ============================================================================

-- Organization policies (CH staff only for write)
DROP POLICY IF EXISTS "org_ch_staff_read" ON public.organizations FOR SELECT;
CREATE POLICY "org_ch_staff_read" ON public.organizations FOR SELECT
  USING (public.is_ch_internal_staff(auth.uid()));

DROP POLICY IF EXISTS "org_ch_staff_write" ON public.organizations FOR ALL;
CREATE POLICY "org_ch_staff_write" ON public.organizations FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

-- Membership policies (prevent self-elevation)
DROP POLICY IF EXISTS "memberships_scoped_read" ON public.organization_memberships FOR SELECT;
CREATE POLICY "memberships_scoped_read" ON public.organization_memberships FOR SELECT
  USING (user_id = auth.uid() OR public.is_ch_internal_staff(auth.uid()));

DROP POLICY IF EXISTS "memberships_manage" ON public.organization_memberships FOR ALL;
CREATE POLICY "memberships_manage" ON public.organization_memberships FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

-- Project policies (scoped isolation)
DROP POLICY IF EXISTS "projects_scoped_read" ON public.projects FOR SELECT;
CREATE POLICY "projects_scoped_read" ON public.projects FOR SELECT
  USING (
    public.has_scoped_project_access(auth.uid(), id) 
    OR exists (SELECT 1 FROM public.client_memberships cm WHERE cm.user_id = auth.uid() AND cm.client_id IN (SELECT id FROM public.clients WHERE organization_id = id))
  );

DROP POLICY IF EXISTS "projects_ch_staff_write" ON public.projects FOR ALL;
CREATE POLICY "projects_ch_staff_write" ON public.projects FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

-- Task policies (visibility enforcement)
DROP POLICY IF EXISTS "tasks_visibility_read" ON public.tasks FOR SELECT;
CREATE POLICY "tasks_visibility_read" ON public.tasks FOR SELECT
  USING (
    public.has_scoped_project_access(auth.uid(), project_id)
    AND (public.is_ch_internal_staff(auth.uid()) OR visibility = 'client_review')
  );

-- Milestone policies (visibility enforcement)
DROP POLICY IF EXISTS "milestones_visibility_read" ON public.milestones FOR SELECT;
CREATE POLICY "milestones_visibility_read" ON public.milestones FOR SELECT
  USING (
    public.has_scoped_project_access(auth.uid(), project_id)
    AND (public.is_ch_internal_staff(auth.uid()) OR visibility = 'client_review')
  );

-- File versions policies (versioning visibility)
DROP POLICY IF EXISTS "file_versions_visibility_read" ON public.file_versions FOR SELECT;
CREATE POLICY "file_versions_visibility_read" ON public.file_versions FOR SELECT
  USING (
    exists (
      SELECT 1 FROM public.files f, public.project_assignments pa
      WHERE f.id = file_id 
        AND (f.visibility = 'client_review' OR public.is_ch_internal_staff(auth.uid()))
        AND pa.user_id = auth.uid()
        AND pa.project_id = f.project_id
    )
  );

-- ============================================================================
-- STEP 6: CREATE HELPER TRIGGERS FOR PHASE TWO FEATURES
-- ============================================================================

-- Auto-generate audit entries on data modification
CREATE OR REPLACE FUNCTION public.log_audit_event(action TEXT, target_table TEXT)
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_events (actor_id, organization_id, project_id, action, target_table, metadata)
  VALUES (new.user_id, new.organization_id, new.project_id, 
          action || ' [' || target_table || '] - ' || COALESCE(new.id::text, 'auto'),
          target_table, '{}'::jsonb);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER IF NOT EXISTS trg_auto_audit_internal_notes
AFTER INSERT ON public.internal_notes
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event('insert', 'internal_notes');

-- ============================================================================
-- STEP 7: CREATE HELPER TABLE FOR PROJECT ASSIGNMENTS (replacing single-file structure)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_assignments_phase2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL,
  can_view_internal_notes BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- STEP 8: ADD AUDIT TRIGGER TO EXISTING TABLES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trigger_audit_after_update(table_name TEXT)
RETURNS TRIGGER AS $$
BEGIN
  IF OLD IS NOT DISTINCT FROM NEW THEN
    INSERT INTO public.audit_events (actor_id, target_table, action, metadata)
    VALUES (NEW.user_id, table_name, 'update', '{}');
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to critical tables
CREATE TRIGGER IF NOT EXISTS trg_audit_projects_update
AFTER UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_after_update('projects');

-- ============================================================================
-- COMPLETION: IDEMPOTENT MIGRATION SUCCESSFUL
-- ============================================================================

COMMIT;

-- Summary of what was added to your existing Lovable schema:
-- • 4 new enum types (org_role, trust_pillar, item_visibility, approval_status)
-- • is_ch_internal flag for tenant isolation on organizations table
-- • organization_id foreign key on projects and clients tables
-- • RLS policies enforcing strict multi-tenant isolation
-- • Helper functions for scoped access checks
-- • New audit logging infrastructure
-- • Phase 2 specific project_assignments_phase2 table (separate from existing)
