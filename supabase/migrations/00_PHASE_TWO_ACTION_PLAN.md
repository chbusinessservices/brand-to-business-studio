# CH BUSINESS SERVICES - PHASE TWO ACTION PLAN
## Multi-Tenant Client Delivery System (Client Delivery Phase)

---

## ✅ COMPLETED PREPARATION WORK

### Database Layer
- [x] Created 8-gap database schema with multi-tenant organization support
- [x] Implemented 6-role RBAC hierarchy (owner, team_member, contractor, client_admin, etc.)
- [x] Established file versioning system with auto-invalidate prior approvals
- [x] Built internal notes isolation (CH staff only access)
- [x] Created audit logging table for immutable event tracking

### Frontend Integration
- [x] Created TypeScript interfaces for all Phase 2 entities
- [x] Defined RBAC guard functions and helper utilities
- [x] Generated execution guide with step-by-step verification

---

## 🎯 IMMEDIATE NEXT STEP (Execute in Order)

### Step 1: Run Supabase Bootstrap Script ⚡️ CRITICAL

**Location**: `supabase/migrations/20261118000002_bootstrap_org_and_test_users.sql`

**Execution Method**: Choose ONE based on your workflow:

#### Option A - Supabase Dashboard (RECOMMENDED)
```
1. Open https://supabase.com/dashboard/project/your-project
2. Navigate to SQL Editor tab
3. Copy content from bootstrap_org_and_test_users.sql
4. Paste into editor and click "Run" button
5. Verify no errors reported at bottom of screen
6. Navigate to Authentication > Users tab
7. Confirm 4 test users now exist (client-a, client-b, contractor, admin)
8. Run SQL to verify organizations table has CH Business Services entry
```

#### Option B - Local Bun CLI (if you prefer local execution)
```bash
cd /Users/ec/brand-to-business-studio
bun run db migrate --field sql ./supabase/migrations/20261118000002_bootstrap_org_and_test_users.sql
# Expected output: "Migration 'bootstrap-org' created successfully"
```

**Success Criteria**: Bootstrap script runs without error; 4 users created; organization link verified

---

### Step 2: Update Drizzle Schema (If not already done)

```bash
# Run in brand-to-business-studio directory
cd /Users/ec/brand-to-business-studio
bun run db generate
```

This will regenerate TypeScript types from your current schema.

---

### Step 3: Verify Current Site State

**Test Commands**:

```bash
# Check if dev server is running
lsof -i :5173 | awk '/LISTEN/ {print $NF}' || echo "No React dev server running"

# Check public assets are served correctly
curl -sI http://localhost:5173 | head -5

# Verify privacy page exists (public route)
curl -sS http://localhost:5173/privacy | grep -q "<title>" && echo "Privacy route OK" || echo "Privacy route needs rebuild"
```

---

## 📊 PHASE TWO DELIVERABLES (Checklist)

| Day | Deliverable | Priority | Status |
|-----|-------------|----------|--------|
| 1-3 | Run Supabase bootstrap script & verify users created | ⚡️ Critical | ⏳ Pending |
| 4-7 | Frontend RBAC guards on `/portal` and `/dashboard` routes | High | - |
| 8-15 | Isolation test suite: 2-client + 1-contractor scenarios | High | - |
| 16-30 | Deploy /portal view with visibility filtering | Medium | - |

---

## 🔄 PHASE TWO EXECUTION FLOW DIAGRAM

```
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────┐
│   Bootstrap DB   │      │  Type Generation  │      │ Frontend Build    │
│ (Day 1-2)        │      │  (Day 4-5)         │      │  (Days 6+)         │
└────────┬─────────┘     └────────┬───────────┘     └────────┬──────────┘
          │                       │                          │
          ▼                       ▼                          ▼
   Run SQL script              Generate TS types          Start /portal dev
   Verify users created       Update imports             Apply RBAC guards
                              Isolate existing tables      Test file access
```

---

## 🔐 SECURITY CHECKLIST - Before Production Deployment

**Multi-Tenant Isolation Requirements**:

- [ ] Client A cannot query any of Client B's projects via direct API
- [ ] Contractor can only see projects assigned to their user_id
- [ ] Internal notes table returns ZERO rows for any client_* role
- [ ] Unauthorized users cannot INSERT into organization_memberships
- [ ] File upload signed URLs expire after 1 hour maximum

**Verify with SQL**:

```sql
-- Test isolation: Try to query Client B's project as Client A
SELECT * FROM projects WHERE organization_id = (SELECT id FROM organizations WHERE slug='ch-business-services');

-- Test internal notes: Should return empty results for client users
SELECT * FROM internal_notes LIMIT 5;

-- Test unauthorized writes attempt (should be blocked by RLS)
INSERT INTO project_assignments (project_id, user_id, role)
VALUES ((SELECT id FROM projects WHERE name='Agency Brand Overhaul'), 
        ('some-other-user-id')::uuid, 'contractor');
-- Expected: SQL ERROR "permission denied"
```

---

## 🚀 IMMEDIATE NEXT COMMANDS

**Step 1**: Copy and run bootstrap script in Supabase SQL Editor

```bash
cat /Users/ec/brand-to-business-studio/supabase/migrations/20261118000002_bootstrap_org_and_test_users.sql > supabase_script.sql
open supabase_script.sql
-- This opens in browser - copy to Supabase SQL Editor and run
```

**Step 2**: If you prefer local execution instead of Supabase UI:

```bash
# Backup existing projects (preserves data)
bun --config drizzle.config.ts db backup > backups/pre-phase2-$(date +%Y%m%d).bak.sql

# Run migration (idempotent - safe to rerun)
bun run db migrate --field sql ./supabase/migrations/20261118000002_bootstrap_org_and_test_users.sql

# Verify data preserved
bun --config drizzle.config.ts db dump > /tmp/dump-before-migration.sql
```

**Step 3**: Update frontend types if needed

```bash
cd /Users/ec/brand-to-business-studio
npm install --save typescript @types/react
bun run db generate
```

---

## 📧 WHAT COMES NEXT

After bootstrap completes (Step 1 above), the Phase Two workflow continues:

**Next Phase**: Frontend Implementation in `src/`
- Create `/portal` route with RBAC-enforced visibility filtering
- Build owner_prep items as "hidden" from client views
- Implement version-controlled approval workflow UI
- Wire to signed URL file storage via Supabase Storage API

**Final Phase**: Commit & Deploy to GitHub
```bash
git add supabase/migrations/*.sql
git commit -m "Add multi-tenant schema for CH Business Services org"
git push
```

---

## 🎯 IMMEDIATE ACTION REQUIRED FROM YOU

**Choose ONE execution path below and report back completion status**:

### Option A: Use Supabase Dashboard
✅ Run bootstrap script directly in browser-based SQL Editor
⏳ Time: ~3-5 minutes
🔜 Verify users created → Next: Frontend implementation

### Option B: Use Local Bun CLI  
⚡️ Run migration via terminal (requires DB driver)  
⏳ Time: ~2 minutes  
🔜 Verify data migrated → Next: Frontend implementation

---

**Note**: Once bootstrap completes successfully, the Phase Two workflow auto-continues to frontend implementation. The database layer is now ready for multi-tenant client isolation enforcement.
