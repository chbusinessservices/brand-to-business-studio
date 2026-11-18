# CH STUDIO OS - Phase Two Database Migration Guide

## 📋 Overview

This directory contains the complete database infrastructure for **Phase Two: Client Delivery System**. These migrations transform your existing Lovable platform into a multi-tenant architecture with strict isolation between organizations.

---

## 📂 File Structure

```
supabase/
├── migrations/
│   ├── README_MIGRATION.md          ← This file
│   └── 20261118_ch_studio_os_additions.sql    # Main migration script
└── ... (existing Lovable migrations)
```

---

## 🚀 Execution Order (CRITICAL)

**Files must be applied in this sequence:**

### Phase 1: Schema Foundation
1. **`20261118_ch_studio_os_additions.sql`** - Primary migration
   - Creates enum types for RBAC hierarchy
   - Adds multi-tenant organization support flags
   - Implements RLS policies for cross-tenant isolation
   - Creates helper functions for scoped access

### Phase 2: Feature Tables
2. **Test files (if needed later)** - Additional features
   - `00_TEST_ISOLATION_VERIFICATION.sql` - Auto-run tests after schema creation

---

## ✅ Current Status

| File | Purpose | Status | Execution Priority |
|------|---------|--------|-------------------|
| `20261118_ch_studio_os_additions.sql` | Multi-tenant foundation + RBAC | ✅ Created | **Phase 1 - Run FIRST** |
| `00_TEST_ISOLATION_VERIFICATION.sql` | Test suite for isolation | ✅ Created | Phase 2 - After schema |

---

## 🎯 Execution Guide

### Step 1: Apply Primary Migration

#### Method A: Supabase Dashboard (RECOMMENDED)
```bash
# Open file in browser
open /Users/ec/brand-to-business-studio/supabase/migrations/20261118_ch_studio_os_additions.sql

# OR manually copy to Supabase SQL Editor:
cat /Users/ec/brand-to-business-studio/supabase/migrations/20261118_ch_studio_os_additions.sql > supabase_migration.sql
open supabase_migration.sql
```
Then paste into Supabase Dashboard → SQL Editor and click **Run**.

#### Method B: Local CLI (if available)
```bash
cd /Users/ec/brand-to-business-studio
bun run db migrate --field sql ./supabase/migrations/20261118_ch_studio_os_additions.sql
```

### Step 2: Verify Deployment Success

After migration completes, verify the following:

```sql
-- Check that enum types were created
SELECT enumname FROM pg_enum WHERE enums LIKE '%org_role%' 
   OR enums LIKE '%trust_pillar%';

-- Check that RLS is enabled on critical tables
SELECT table_name, row_security_enabled 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('organizations', 'projects', 'tasks')
ORDER BY table_name;

-- Verify CH internal org flag exists
SELECT id, name, slug, is_ch_internal 
FROM public.organizations 
LIMIT 1;
```

Expected results:
- `org_role` enum exists with values: owner, team_member, contractor, client_admin, etc.
- RLS enabled on organizations, projects, and tasks tables
- Organization table has `is_ch_internal` column

### Step 3: Bootstrap Test Users (Optional)

If you don't already have test users in Supabase for isolation testing, run this separate script to create them:

```bash
cat /Users/ec/brand-to-business-studio/supabase/migrations/00_TEST_ISOLATION_VERIFICATION.sql > supabase_test_script.sql
open supabase_test_script.sql  # Opens in browser for copy-paste
```

Paste into Supabase SQL Editor, run. This creates:
- `client-a@agency.com` (role: client_admin)
- `client-b@hospitalitygroup.com` (role: client_admin)
- `contractor@techstack.dev` (role: contractor)
- `admin@chbusinessservices.pro` (role: owner in CH org)

### Step 4: Run Isolation Tests

```bash
cat /Users/ec/brand-to-business-studio/supabase/migrations/00_TEST_ISOLATION_VERIFICATION.sql > supabase_test_script.sql
open supabase_test_script.sql
```

Paste into Supabase SQL Editor and run. Review results above the "SUMMARY" section.

---

## 🔐 Security Requirements (Must Pass)

After deployment, verify these isolation requirements:

### ✓ Test 1: Client A cannot see Client B's data
```sql
SELECT 'Test' as scenario, 
       CASE WHEN COUNT(*) > 0 THEN 'FAIL - Data leak detected' ELSE 'PASS - Isolation working' END as result
FROM projects p
WHERE EXISTS (
  SELECT 1 FROM project_assignments pa 
  WHERE pa.user_id = ANY(ARRAY['client-a@agency.com'::uuid])
    AND EXISTS (SELECT 1 FROM clients c WHERE c.organization_id != p.organization_id)
);
```

### ✓ Test 2: Contractor scope enforcement
```sql
SELECT 'Test' as scenario, 
       CASE WHEN COUNT(*) > 0 THEN 'FAIL - Scope leak' ELSE 'PASS - Contractor isolation' END as result
FROM tasks t
WHERE NOT EXISTS (
  SELECT 1 FROM project_assignments pa 
  WHERE pa.user_id = ANY(ARRAY['contractor@techstack.dev'::uuid])
    AND t.project_id IN (SELECT project_id FROM project_assignments WHERE user_id = ANY(ARRAY['contractor@techstack.dev'::uuid]))
);
```

### ✓ Test 3: Internal notes isolation
```sql
-- Should return ZERO rows if RLS working correctly
SELECT COUNT(*) as internal_notes_access_count
FROM internal_notes 
WHERE EXISTS (SELECT 1 FROM clients WHERE email IN ('client-a@agency.com'::text));
```

**Expected results:**
- Test 1, 2: `result = 'PASS - Isolation working'`
- Test 3: `internal_notes_access_count = 0`

---

## 📊 What Each Migration Creates

### `20261118_ch_studio_os_additions.sql`:
| Feature | SQL Component | Purpose |
|---------|---------------|---------|
| **RBAC Hierarchy** | 4 enum types | Strict role-based access control |
| **Multi-Tenant** | is_ch_internal column | Tenant isolation via organization ID |
| **RLS Policies** | 8+ policies | Automatic cross-tenant data blocking |
| **Scoped Access** | 2 helper functions | Server-side permission checks |
| **Audit Logging** | audit_events table | Immutable event tracking |

### `00_TEST_ISOLATION_VERIFICATION.sql`:
| Test | Verification Target | Expected Status |
|------|---------------------|-----------------|
| Cross-tenant isolation | Client A → Client B project data | ❌ BLOCKED by RLS |
| Contractor scope | Unassigned tasks visibility | ✅ ONLY assigned projects |
| Internal notes | Client role access to internal_notes table | ❌ ZERO rows returned |

---

## ⚠️ Important Notes

1. **Existing Lovable Data Preserved**: The migration is idempotent and safe to run multiple times without losing existing project data.

2. **Order Matters**: Apply `ch_studio_os_additions.sql` first, then any other Phase Two additions.

3. **Supabase Permissions Required**: Must be logged in with an account having permission to execute system-level DDL statements.

4. **Foreign Keys May Need Cleanup**: Existing projects table may have multiple ID references - this migration handles conflicts automatically.

---

## 🎯 Next Steps After Migration

Once `20261118_ch_studio_os_additions.sql` runs successfully:

**Day 3-5**: Frontend RBAC Implementation
- Create `/portal` route with client visibility filtering
- Build `/dashboard` showing owner_prep items to CH staff only
- Implement version-controlled approval workflow in React components

**Day 6+:** Isolation Testing & Deployment
- Run `00_TEST_ISOLATION_VERIFICATION.sql` suite
- Verify all isolation tests pass in Supabase dashboard
- Commit and deploy to GitHub for production use

---

## 📧 Quick Reference Commands

```bash
# Check migration files exist
ls -lh /Users/ec/brand-to-business-studio/supabase/migrations/*.sql

# Open main migration in browser
open /Users/ec/brand-to-business-studio/supabase/migrations/20261118_ch_studio_os_additions.sql

# If using bun CLI for local execution
bun run db migrate --field sql ./supabase/migrations/20261118_ch_studio_os_additions.sql
```
