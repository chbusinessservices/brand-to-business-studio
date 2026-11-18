-- ============================================================================
-- CH STUDIO OS — PHASE TWO MULTI-TENANT SCHEMA & RBAC
-- Executive Summary: Resolves multi-tenant isolation, 6-role RBAC hierarchy,
-- versioning, approval workflow, internal notes isolation, and audit logging
-- -----------------------------------------------------------------------------
-- Safe to run in Supabase SQL Editor or via bun db push --schema=phase2
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: SAFE ENUM TYPE CREATION (With duplicate handling for idempotency)
-- ============================================================================

DO $$ 
  BEGIN
    CREATE TYPE public.org_role AS ENUM ('owner', 'team_member', 'contractor', 'client_admin', 'client_contributor', 'client_billing');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

DO $$ 
  BEGIN
    CREATE TYPE public.trust_pillar AS ENUM ('CODE', 'SHIELD', 'SIGNAL', 'SYSTEM');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

DO $$ 
  BEGIN
    CREATE TYPE public.item_visibility AS ENUM ('client_review', 'owner_prep');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

DO $$ 
  BEGIN
    CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'changes_requested', 'superseded');
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- ============================================================================
-- STEP 2: MULTI-TENANT ORGANIZATIONS & MEMBERSHIPS (Gap 1 & 3)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_ch_internal BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- ============================================================================
-- STEP 3: PROJECTS & ASSIGNMENTS (Gap 2 & 3)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective TEXT,
  scope_summary TEXT,
  exclusions TEXT,
  active_pillars public.trust_pillar[] NOT NULL DEFAULT ARRAY['CODE', 'SHIELD', 'SIGNAL', 'SYSTEM'],
  status TEXT NOT NULL DEFAULT 'onboarding',
  billing_url TEXT,
  handoff_notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- STEP 4: MILESTONES & TASKS (Gap 4)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  pillar public.trust_pillar NOT NULL,
  visibility public.item_visibility NOT NULL DEFAULT 'client_review',
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  requires_external_counsel BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  visibility public.item_visibility NOT NULL DEFAULT 'owner_prep',
  title TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_client_action BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================================================
-- STEP 5: FILE VERSIONING SYSTEM (Gap 5)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  pillar public.trust_pillar NOT NULL,
  visibility public.item_visibility NOT NULL DEFAULT 'client_review',
  title TEXT NOT NULL,
  current_version_number INT NOT NULL DEFAULT 1,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pillar public.trust_pillar DEFAULT 'SYSTEM',
  visibility public.item_visibility NOT NULL DEFAULT 'client_review',
  UNIQUE(file_id, version_number)
);

-- ============================================================================
-- STEP 6: VERSION-LOCKED REVIEW & APPROVAL WORKFLOW (Gap 6)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.review_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_version_id UUID NOT NULL REFERENCES public.file_versions(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.approval_status NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.approval_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_request_id UUID NOT NULL REFERENCES public.review_requests(id) ON DELETE CASCADE,
  file_version_id UUID NOT NULL REFERENCES public.file_versions(id) ON DELETE CASCADE,
  decided_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  decision public.approval_status NOT NULL,
  comments TEXT,
  disclaimer_acknowledged BOOLEAN NOT NULL DEFAULT true,
  version_commented TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-invalidate prior approvals when new file version is uploaded
CREATE OR REPLACE FUNCTION public.invalidate_prior_approvals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.review_requests
  SET status = 'superseded'
  WHERE project_id = NEW.project_id
    AND file_version_id <> NEW.id
    AND status IN ('pending', 'approved');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_invalidate_prior_approvals ON public.file_versions;
CREATE TRIGGER trg_invalidate_prior_approvals
AFTER INSERT ON public.file_versions
FOR EACH ROW EXECUTE FUNCTION public.invalidate_prior_approvals();

-- ============================================================================
-- STEP 7: ISOLATED INTERNAL NOTES (Gap 7)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  visibility TEXT CHECK (visibility IN ('internal', 'team_only')) NOT NULL DEFAULT 'internal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- STEP 8: IMMUTABLE AUDIT LOGGING (Gap 8)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action LIKE '%UPDATE%' OR action LIKE '%DELETE%'),
  target_table TEXT NOT NULL,
  target_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1
);

-- ============================================================================
-- STEP 9: SECURITY HELPERS & RLS ENFORCEMENT
-- ============================================================================

-- Helper function for CH internal staff (owner + team_member roles in CH's org only)
CREATE OR REPLACE FUNCTION public.is_ch_internal_staff(uid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  ch_org_id UUID;
BEGIN
  SELECT id INTO ch_org_id 
  FROM public.organizations 
  WHERE slug = 'ch-business-services' LIMIT 1;
  
  IF NOT FOUND THEN
    -- No CH org exists yet, return false
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM public.organization_memberships om
    JOIN public.organizations o ON o.id = ch_org_id
    WHERE om.user_id = uid 
      AND o.is_ch_internal = true
      AND om.role IN ('owner', 'team_member')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function for org manager within specific org
CREATE OR REPLACE FUNCTION public.is_org_manager(uid UUID, org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  ch_staff_check BOOLEAN;
BEGIN
  ch_staff_check := public.is_ch_internal_staff(uid);
  RETURN ch_staff_check OR EXISTS (
    SELECT 1 
    FROM public.organization_memberships om
    WHERE om.user_id = uid 
      AND om.organization_id = org_id
      AND om.role IN ('owner', 'team_member', 'client_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function for scoped project access
CREATE OR REPLACE FUNCTION public.has_scoped_project_access(uid UUID, pid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_ch_internal_staff(uid) OR EXISTS (
    SELECT 1 
    FROM public.project_assignments pa
    WHERE pa.user_id = uid AND pa.project_id = pid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Organization Policies: Restrict access to CH staff or org members
CREATE POLICY "org_ch_staff_read" ON public.organizations FOR SELECT
  USING (public.is_ch_internal_staff(auth.uid()));

CREATE POLICY "org_ch_staff_write" ON public.organizations FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

CREATE POLICY "org_membership_read" ON public.organization_memberships FOR SELECT
  USING (user_id = auth.uid() OR public.is_ch_internal_staff(auth.uid()));

CREATE POLICY "org_membership_manage" ON public.organization_memberships FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

-- Project Policies: Scoped by organization + project assignment
CREATE POLICY "projects_scoped_read" ON public.projects FOR SELECT
  USING (
    public.has_scoped_project_access(auth.uid(), id) 
    OR exists (SELECT 1 FROM public.organization_memberships om WHERE om.user_id = auth.uid() AND om.organization_id = id)
  );

CREATE POLICY "projects_ch_staff_write" ON public.projects FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

CREATE POLICY "assignments_read" ON public.project_assignments FOR SELECT
  USING (user_id = auth.uid() OR public.is_ch_internal_staff(auth.uid()));

CREATE POLICY "assignments_manage" ON public.project_assignments FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

-- Milestones, Tasks, Files: Client review visible; owner_prep isolated from clients
CREATE POLICY "milestones_scoped_read" ON public.milestones FOR SELECT
  USING (
    public.has_scoped_project_access(auth.uid(), project_id)
    AND (public.is_ch_internal_staff(auth.uid()) OR visibility = 'client_review')
  );

CREATE POLICY "tasks_scoped_read" ON public.tasks FOR SELECT
  USING (
    public.has_scoped_project_access(auth.uid(), project_id)
    AND (public.is_ch_internal_staff(auth.uid()) OR visibility = 'client_review')
  );

CREATE POLICY "files_scoped_read" ON public.files FOR SELECT
  USING (
    public.has_scoped_project_access(auth.uid(), project_id)
    AND (public.is_ch_internal_staff(auth.uid()) OR visibility = 'client_review')
  );

CREATE POLICY "file_versions_scoped_read" ON public.file_versions FOR SELECT
  USING (
    exists (
      SELECT 1 FROM public.files f
      WHERE f.id = file_id 
        AND public.has_scoped_project_access(auth.uid(), f.project_id)
        AND (f.visibility = 'client_review' OR public.is_ch_internal_staff(auth.uid()))
    )
  );

-- Approval Decisions: Only assigned admin or CH staff can write; others read only
CREATE POLICY "review_requests_read" ON public.review_requests FOR SELECT
  USING (public.has_scoped_project_access(auth.uid(), project_id));

CREATE POLICY "review_requests_write" ON public.review_requests FOR INSERT
  WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "approval_decisions_read" ON public.approval_decisions FOR SELECT
  USING (
    exists (
      SELECT 1 FROM public.review_requests rr
      WHERE rr.id = review_request_id 
        AND public.has_scoped_project_access(auth.uid(), rr.project_id)
    )
  );

CREATE POLICY "approval_decisions_write" ON public.approval_decisions FOR INSERT
  WITH CHECK (
    decided_by = auth.uid() 
    AND (public.is_ch_internal_staff(auth.uid()) 
         OR EXISTS (
           SELECT 1 FROM public.review_requests rr
           JOIN public.project_assignments pa ON pa.project_id = rr.project_id
           WHERE rr.id = review_request_id 
             AND pa.user_id = auth.uid() 
             AND pa.role = 'client_admin'
         )
    )
  );

-- Internal Notes: Strictly CH staff only (zero client access)
CREATE POLICY "internal_notes_staff_only" ON public.internal_notes FOR ALL
  USING (public.is_ch_internal_staff(auth.uid()));

-- Audit Events: Append-only by authenticated users; read by CH staff only
CREATE POLICY "audit_events_insert" ON public.audit_events FOR INSERT
  WITH CHECK (actor_id = auth.uid());

CREATE POLICY "audit_events_read" ON public.audit_events FOR SELECT
  USING (public.is_ch_internal_staff(auth.uid()));

COMMIT;

