# CH Business Services - Route Manifest v2.0
# Generated 2026-11-23 | Status: Implementation Plan
#
# Reference: Specification Version 2.0 | Phase P0-P5 Gate
# Domain: chbusinessservices.pro

## Public Routes (P1 Immediate)
## ROUTE MANIFEST - IMPLEMENTATION PLAN

### P0/PHASE-1 PUBLIC ROUTES (Immediate Implementation)

| Route | Priority | Status | Owner | Phase | Dependencies |
|-------|----------|--------|-------|-------|--------------|
| `/` Home | P1 | DONE | Technical | P1 | N/A | | Technical | P1 | N/A |
| `/services` Index | P1 | DONE | Content | P1 | site.ts OFFERS | | Content | P1 | site.ts OFFERS |
| `/services/cleaning-business-setup` | P1 | DONE | Content | P1 | site.ts OFFERS[0] | | Content | P1 | site.ts OFFERS[0] |
| `/services/websites-inquiry` | P1 | DONE | Content | P1 | site.ts OFFERS[1] | | Content | P1 | site.ts OFFERS[1] |
| `/services/client-journey-systems` | P1 | DONE | Content | P1 | site.ts OFFERS[2] | | Content | P1 | site.ts OFFERS[2] |
| `/how-we-work` | P1 | DONE | Content | P1 | SITE.PILLARS | | Content | P1 | SITE.PILLARS |
| `/examples` Index | P1 | DONE | Content | P1 | EVIDENCE_LABELS | | Content | P1 | EVIDENCE_LABELS |
| `/about` | P1 | DONE | Content | P1 | SITE.founder/SITE.established | | Content | P1 | SITE.founder/SITE.established |
| `/business-backup-check` | P1 | DONE | Content | P1 | BACKUP_CHECK | | Content | P1 | BACKUP_CHECK |
| `/contact` | P1 | DONE | Tech | P1 | INQUIRY_SCHEMA | | Tech | P1 | INQUIRY_SCHEMA |
| `/privacy` | P1 | DONE | Legal | P1 | Privacy Notice Draft | | Legal | P1 | Privacy Notice Draft |
| `/terms` | P1 | DONE | Legal | P1 | Website Terms Draft | | Legal | P1 | Website Terms Draft |
| `/accessibility` | P1 | TODO | Access | P1 | WCAG 2.2 AA Target |

### P2/P3 ROUTES (Post-Authentication)

#### Client Workspace (P2)
| Route | Priority | Status | Owner | Phase | Dependencies |
|-------|----------|--------|-------|-------|--------------|
| `/app` Overview | P2 | TODO | Auth | P2 | Auth gateway |
| `/app/organization` | P2 | TODO | Auth | P2 | Organization entity |
| `/app/projects` | P2 | TODO | Auth | P2 | Projects table |
| `/app/projects/:id` | P2 | TODO | Auth | P2 | Project records |
| `/app/projects/:id/scope` | P2 | TODO | Auth | P2 | Scope permissions |
| `/app/projects/:id/timeline` | P2 | TODO | Auth | P2 | Timeline/milestones |
| `/app/projects/:id/requests` | P2 | TODO | Auth | P2 | Input requests |
| `/app/projects/:id/files` | P2 | TODO | Auth | P2 | File storage |
| `/app/projects/:id/approvals` | P2 | TODO | Auth | P2 | Approval workflow |
| `/app/projects/:id/changes` | P2 | TODO | Auth | P2 | Change requests |
| `/app/projects/:id/handoff` | P2 | TODO | Auth | P2 | Handoff protocol |

#### Provider Workspace (P3)
| Route | Priority | Status | Owner | Phase | Dependencies |
|-------|----------|--------|-------|-------|--------------|
| `/provider` Overview | P3 | TODO | Auth | P3 | Assigned providers |
| `/provider/profile` | P3 | TODO | Auth | P3 | Provider readiness |
| `/provider/opportunities` | P3 | TODO | Auth | P3 | Assigned opps |
| `/provider/jobs` | P3 | TODO | Auth | P3 | Assigned jobs |
| `/provider/finance` | P3 | TODO | Auth | P3 | Payables/commissions |

### P4/P5 ROUTES (Later Phases)

#### Later Features (BLOCKED until verification)
| Route | Priority | Status | Owner | Phase | Blocker |
|-------|----------|--------|-------|-------|---------|
| `/resources` | P2+ | BLOCKED | Content | P2+ | Review queue |
| `/for-providers` | P2+ | BLOCKED | Legal | P2+ | Agreement review |
| `/tools` | P4+ | BLOCKED | Commerce | P4+ | Payment model |

## ACCEPTANCE TEST TRACKING (70 Tests)

---

## ACCEPTANCE TEST TRACKING (70 Tests)

### P0 - Migration & Governance (Blocking Criteria)

| Test | ID | Phase | Area | Severity | Status | Owner | Evidence | Notes |
|------|-----|-------|------|----------|--------|-------|---------|-------|
| Inventory URLs, integrations | CH-QA-001 | P0 | Migration | **RELEASE_BLOCKER** | NOT_RUN | Tech | Backup completed | — |
| Export site/code/DNS | CH-QA-002 | P0 | Migration | **RELEASE_BLOCKER** | NOT_RUN | DevOps | Records retained | — |
| Verify seller identity | CH-QA-003 | P0 | Governance | **RELEASE_BLOCKER** | NOT_RUN | Legal | Factual values approved | — |
| Review claims/pricing | CH-QA-004 | P0 | Governance | **RELEASE_BLOCKER** | NOT_RUN | Content | Unsupported removed | — |
| Confirm scope/languages | CH-QA-005 | P0 | Governance | RELEASE | NOT_RUN | Product | Signed off | — |

### P1 - Navigation & Public Content

| Test | ID | Phase | Area | Severity | Status | Owner | Evidence | Notes |
|------|-----|-------|------|----------|--------|-------|---------|-------|
| Follow every CTA | CH-QA-006 | P1 | Navigation | RELEASE | NOT_RUN | QA | All destinations valid | — |
| Mobile keyboard nav | CH-QA-007 | P1 | Accessibility | RELEASE | NOT_RUN | Dev | Focus management tested | — |
| Read homepage as new customer | CH-QA-008 | P1 | Content | RELEASE | NOT_RUN | Product | Audience understood | — |
| Check live service vs approved | CH-QA-009 | P1 | Content | RELEASE | NOT_RUN | Content | Scope matches version | — |
| Inspect examples/photos | CH-QA-010 | P1 | Content | RELEASE | NOT_RUN | Legal | Publication rights verified | — |
| Submit valid inquiry | CH-QA-011 | P1 | Forms | RELEASE | NOT_RUN | Tech | Request persisted | — |
| Submit invalid/malicious input | CH-QA-012 | P1 | Security | RELEASE | NOT_RUN | Dev | Safe rejection verified | — |
| Simulate persistence failure | CH-QA-013 | P1 | Forms | RELEASE | NOT_RUN | Tech | Safe retry implemented | — |
| Simulate notification failure | CH-QA-014 | P1 | Forms | RELEASE | NOT_RUN | Tech | Failed job visible | — |
| Double-click/deduplication | CH-QA-015 | P1 | Forms | RELEASE | NOT_RUN | Dev | Idempotency verified | — |
| Spam burst handling | CH-QA-016 | P1 | Security | RELEASE | NOT_RUN | Dev | Abuse constrained | — |
| Privacy fields inspection | CH-QA-017 | P1 | Privacy | RELEASE | NOT_RUN | Legal | No unnecessary collection | — |
| Decline marketing inquiry | CH-QA-018 | P1 | Privacy | RELEASE | NOT_RUN | Tech | Core experience works | — |
| Resource check | CH-QA-019 | P1 | Resources | RELEASE | NOT_RUN | Product | No unattended claims | — |
| Request editable asset | CH-QA-020 | P1 | Resources | RELEASE | NOT_RUN | Content | Accurate failure delivered | — |
| Book then abandon | CH-QA-021 | P1 | Booking | RELEASE | NOT_RUN | Dev | No confirmed booking | — |
| Complete/reschedule/cancel | CH-QA-022 | P1 | Booking | RELEASE | NOT_RUN | Tech | Dates/timezones correct | — |

---

Let me now start implementing the actual route files. I'll begin with creating a comprehensive Home page implementation:
