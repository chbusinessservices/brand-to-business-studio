# CH STUDIO OS PHASE 2 EXECUTION GUIDE
## Client Delivery System with Multi-Tenant Isolation

---

## ✅ COMPLETED PREPARATION (Day 0)

### Database Layer Setup
- [x] Supabase multi-tenant schema created with Deny-by-Default RLS policies
- [x] CH Business Services organization bootstrap SQL ready
- [x] Drizzle schema types generated for frontend integration
- [x] TypeScript interfaces defined for React components

---

## 📋 PHASE 2 EXECUTION SEQUENCE (Days 1-30)

### Day 1: Bootstrap & Test Users Creation

**Step 1.1 - Run Supabase Bootstrap Script**

```bash
# Option A: Direct SQL in Supabase UI
# Open: https://supabase.com/dashboard > SQL Editor
# Run the content of: supabase/migrations/20261118000002_bootstrap_org_and_test_users.sql

# OR

# Option B: Bun CLI Execution (if db driver installed)
cd /Users/ec/brand-to-business-studio
bun --config drizzle.config.ts db migrate --field sql ./supabase/migrations/20261118000002_bootstrap_org_and_test_users.sql
```

**Step 1.2 - Verify User Creation in Supabase Dashboard**

Navigate to: **Authentication > Users**
Confirm test users exist:
- `client-a@agency.com` → Role: `client_admin` (Agency project)
- `client-b@hospitalitygroup.com` → Role: `client_admin` (Hospitality project)  
- `contractor@techstack.dev` → Role: `contractor` (assigned to projects)

**Step 1.3 - Verify Organization Assignment**

Navigate to: **Authentication > Organization**
Confirm CH internal organization exists (is_ch_internal = true) with admin ownership linked.

---

### Day 2: Frontend Type Integration

**Step 2.1 - Update Supabase Client**

```bash
# Generate types from your actual Supabase schema
cd /Users/ec/brand-to-business-studio
bun run db generate
```

**Step 2.2 - Import Phase 2 Types**

Update `src/lib/supabase.ts` or `src/types/index.ts`:

```typescript
import * as phases2 from './phases2';

// Usage example in client component:
const { data } = await supabase.rpc('projects_with_assignments', { 
  uid: auth.user?.id,
  pid: project.id
});
```

**Step 2.3 - Create RBAC Guard Hooks**

Create `src/hooks/useRbac.ts`:

```typescript
import { isCHStaff } from '@/types/phases2';

export function useMultiTenantRBAC() {
  const isAdmin = isCHAuth();
  
  // Client-only component wrapper
  if (!isAdmin) return null;
  
  return <ClientOnlyComponent />;
}
```

---

### Day 3: Isolation Tests & Verification

**Step 3.1 - Run Integration Test Suite**

```bash
# Create test scenarios for isolation verification
cd /Users/ec/brand-to-business-studio
bun test --test-name-pattern=Phase2IsolationTests
```

Test Matrix:
| Test | Scenario | Expected Result |
|------|----------|-----------------|
| Client A Isolation | Client A queries Client B project | ❌ FAIL (should return empty) |
| Contractor Scope | Contractor views unassigned projects | ✅ PASS (returns only assigned) |
| Internal Notes Access | Non-CH staff queries internal_notes | ❌ FAIL (zero results) |
| Role Self-Elevation | User attempts `INSERT INTO memberships` | ❌ FAIL (RLS blocks) |

**Step 3.2 - Manual Isolation Verification**

Open Supabase > Authentication:
1. Switch user to `client-a@agency.com`
2. Query project `Agency Brand Overhaul` with client_admin role
3. Verify they see ONLY their own milestone files (visibility = 'client_review')
4. Confirm Contractor 1 cannot see any unassigned tasks

---

## 🚀 FRONTEND IMPLEMENTATION PRIORITY

### First Implementation: Public Site Safety Layer

**File:** `src/components/PublicSiteGuard.tsx`

```typescript
export function PublicSiteGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      path="/portal" 
      allowPaths={['/']} 
      // Blocks access to /portal for unauthenticated users
    >
      {children}
    </ProtectedRoute>
  );
}
```

### Second Implementation: Client Portal View

**File:** `src/components/ClientPortal.tsx`

```typescript
export default function ClientPortal() {
  // Enforce RBAC at component level
  const { data, error } = useSupabaseQuery({
    query: 'projects_for_user',
    params: { uid: supabase.auth.user().id },
    columns: ['active_pillars', 'status']
  });

  if (!data) return <LoadingSpinner />;
  
  return (
    <div className="portal-view">
      {/* Only show client_review visibility items */}
      {data.filter(item => 
        hasClientReviewPermission(item.visibility)
      ).map(project => (
        <MilestoneCard key={project.id} {...project} />
      ))}
    </div>
  );
}
```

### Third Implementation: Owner Prep Dashboard

**File:** `src/components/OwnerDashboard.tsx`

```typescript
export default function OwnerDashboard() {
  // Filter for owner_prep items only
  const [ownerPrepItems, setOwnerPrepItems] = useState([]);
  
  useEffect(() => {
    fetchOwnerPrepFiles();
  }, []);
  
  return (
    <div className="dashboard-view">
      {/* Only CH staff can see owner_prep items */}
      {ownerPrepItems.filter(item => 
        !hasClientReviewPermission(item.visibility)
      ).map(item => (
        <InternalTaskList key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## 📊 COMMIT CHECKLIST & TRACKING

| Phase | Milestone | Status | Notes |
|-------|-----------|--------|-------|
| Day 1-3 | DB Schema Migration | ✅ Done | Run bootstrap script |
| Day 4-7 | Multi-Tenant RBAC Policies | ⏳ Pending | Apply RLS policies in frontend |
| Day 8-15 | Isolation Test Suite | ⏳ Pending | Verify 2-client + 1-contractor isolation |
| Day 16-30 | Frontend Portal Integration | ⏳ Pending | Deploy /portal view |

---

## 🔐 SECURITY POLICY ENFORCEMENT RULES

**When building frontend components:**

1. **NEVER trust client-side role checks alone** - All access must be enforced at RLS database level first
2. **Always validate via RPC before rendering** - Use `supabase.rpc()` to verify permissions server-side
3. **Never expose project UUIDs publicly** - Project IDs are tenant-scoped and can leak cross-org data
4. **File URLs must have short-lived tokens** - Never use public storage paths; always generate signed URLs
5. **Internal notes are invisible by design** - No `client_admin` role can ever query `internal_notes` table

---

## 📝 NEXT IMMEDIATE ACTION

**RIGHT NOW**: Execute the bootstrap script in Supabase SQL Editor

```sql
-- Copy content from: supabase/migrations/20261118000002_bootstrap_org_and_test_users.sql
-- Run in: Supabase Dashboard > SQL Editor
-- Expected result: CH organization + 4 test users created; projects assigned
-- Verification: Navigate to Auth > Users and Organizations tabs
```

Once bootstrap completes successfully, the next phase is frontend implementation.
