# Roadmap
## Launch-readiness audit (phase one)
- [x] Website tests (layouts, nav, logos, links, booking, form, storage, failure, placeholders, copy, privacy)
- [x] Security tests (anon read, unauthorized dashboard, self-escalation, secrets, backend authz)
- [x] Fix failures
- [x] Remove TEST records
- [x] Publish to lovable.app URL
- [ ] Connect chbusinessservices.pro — blocked: workspace needs a paid plan; owner must remove Netlify site binding + wildcard CNAME first

## Phase two: client delivery (after audit + publish)
- [ ] Inspect schema; design orgs/memberships/project assignments with 6 roles, deny by default
- [ ] Internal workspace (leads, clients, projects, milestones, tasks, input requests, files+versions, reviews, approvals, internal notes, audit log)
- [ ] Client portal (objective, scope/exclusions, contact, phases, milestones, actions, review files, version approvals, deliverables, billing links, handoff)
- [ ] Private file storage with signed URLs and validated uploads
- [ ] Approval records; reapproval on change; not an e-signature
- [ ] Tests: 2 clients + 1 contractor isolation, no internal notes, no self-elevation, unauthorized files fail; stop and report

## Visitor assistant
- [x] Server endpoint for three guide roles with private instructions, limits, allowed sites
- [x] Question panel on home page with summary hand-off to inquiry form; privacy page updated
