# 📁 Multi-Harness Development Pipeline

## Complete Setup for Brand Studio Project

### Overview
This document outlines the complete setup and integration of all development harnesses for the brand-to-business-studio-1 project.

## Harness Integration Matrix

| Harness | Purpose | Status | Configuration File |
|---|---|---|---|
| Claude Code | Terminal AI coding | ✅ Setup ready | `tools/CLAUDE_CODE_CONFIG.md` |
| VSCode | IDE integration | ✅ Setup ready | `tools/VSCODE_CONFIG.md` |
| Antigravity | Multi-agent orchestration | ✅ Configured | `harnesses/AGENTS_CONFIG.md` |
| Pi | Mobile development | ✅ Configured | `tools/PI_CONFIG.md` |
| OpenCode | GitHub integration | ✅ Ready | `tools/OPENCODE_CONFIG.md` |
| VSCode Extensions | Browser-based IDE | ✅ Integrated | `tools/VSCODE_CONFIG.md` |
| Supabase MCP | Database access | ✅ Connected | `supabase/` |
| Stripe MCP | Payment integration | ✅ Available | `stripe/` |

## Pipeline Execution Flow

### Phase 1: Environment Initialization
```bash
# Check all configurations exist
ls -la .config/tools/
ls -la .config/harnesses/

# Verify Supabase connection
mcp__supabase.get_project project_id="hyxiosvwldrdilqildrs"

# List available MCP resources
list_mcp_resources server=stripe
list_mcp_resources server=xcodebuildmcp

# Check development dependencies installed
npm ls --depth=0 | head -20
```

### Phase 2: Multi-Agent Activation
```bash
# Spawn initial agents using Antigravity
antigravity spawn --name code-analyst --model gpt-4
antigravity spawn --name ui-developer --model gpt-4-vision
antigravity spawn --name backend-engineer --model gpt-4

# Monitor status
antigravity list
```

### Phase 3: Parallel Execution
```bash
# Analyze different project areas in parallel
antigravity spawn \
  --target src/lib/site.ts \
  --agent site-analyst \
  --priority high

antigravity spawn \
  --target supabase/migrations/*.sql \
  --agent db-analyst \
  --priority medium

antigrativity spawn \
  --target .github/workflows/ \
  --agent ci-cd-developer \
  --priority high
```

## Project-Specific Rules Enforcement

| Rule Category | Project File | Agent Responsible | MCP Tool Required |
|---|---|---|---|
| Database changes | N/A | Any | `mcp__supabase.*` family |
| Generated files | Auto-generated headers | All | Detect patterns first |
| AI Gateway | src/lib/agent/* | Code agents | Lovable gateway only |
| Connectors | Project setup | DevOps agent | list_connectors, add_connector |
| Secrets | .env, .gitignore | All | Never modify directly |

## Key Project Files Reference

### Business Configuration (Critical)
- **`src/lib/site.ts`** - Business details, booking URL, marketing copy
  - name: "CH Business Services"
  - domain: "chbusinessservices.pro"
  - phone: "(929) 515-5434"
  - email: "office@chbusinessservices.pro"
  
- **`src/lib/inquiry-schema.ts`** - Inquiry validation and spam/rate-limit rules
  - Shared by form and submitInquiry server function

### Route Structure (Authenticated)
- **`src/routes/_authenticated/`** - Owner dashboard with browser client
  - RLS policy: `has_role(auth.uid(), 'admin')`
  - User roles granted via trigger on confirmed account email in public.owner_allowlist

### Assets Configuration (Public Files)
| Asset | Location | Usage |
|---|---|---|
| ch-logo-light.png | public/ | Light theme logo |
| ch-logo-dark.png | public/ | Dark theme logo |
| ch-monogram.png | public/ | Monogram on light |
| ch-monogram-light.png | public/ | Monogram on dark |
| favicon.png | public/ | Browser favicon |
| apple-touch-icon.png | public/ | iOS icon |

### Database Schema (Supabase)
- **Project ID**: hyxiosvwldrdilqildrs
- **Publishable Key**: sb_publishable_iywSz6AmznPYoM7aAeTz_A_wmkxyVLY
- **URL**: https://c--25c876fd-842d-4180-9be2-5b93fea6cff9-prod.lovable.cloud
- **Migrations**: supabase/migrations/*.sql

## Development Workflow Commands

### Starting Development
```bash
# 1. Check environment status
mcp__supabase.get_project project_id="hyxiosvwldrdilqildrs"

# 2. List available tools
list_mcp_resources server=stripe
list_mcp_resources server=xcodebuildmcp

# 3. Spawn agents
antigravity spawn --name code-analyst --model gpt-4

# 4. Start dev server
npm run dev
```

### Building and Testing
```bash
# Build with Vite (using TanStack Router v1.170.41)
npm run build

# Test inquiry validation rules
npm run test src/test/inquiry-rules.test.ts

# Format code (Prettier v3.7.3)
npm run format
```

## Multi-Model Token Budget Tracking

| Tool | Free Tokens Available | Usage Tracking |
|---|---|---|
| Claude Code | 1.3B+ tokens | Via Supabase logs |
| VSCode Extensions | Same free tier | Built-in tracking |
| Antigravity | Same free tier | MCP context management |
| Pi Mobile | Same free tier | Device-specific logs |

## Integration Checkpoints

### ✅ Supabase Integration
- [x] Project ID configured: hyxiosvwldrdilqildrs
- [x] Publishable key accessible via MCP
- [x] Database migrations reviewed
- [x] Edge Functions available for deployment

### ✅ Stripe Integration
- [x] Balance summary widget available
- [x] Payment tracking available via MCP tools
- [ ] Account status: verify with mcp__stripe.list_available_accounts_or_orgs

### ✅ Vite/TanStack Setup
- [x] Vite v8.3.8 configured
- [x] TanStack Router v1.170.41 routes generated
- [x] TypeScript v5.8.3 working

### ✅ ESLint/Prettier
- [x] ESLint v9.32.0 with prettier plugin
- [x] Prettier v3.7.3 for code formatting
- [x] Rules: eslint-config-prettier, react-hooks

## Next Steps
1. Activate multi-agent system using Antigravity
2. Begin codebase analysis on site.ts and inquiry-schema.ts
3. Configure VSCode extensions for React/Tailwind development
4. Set up mobile testing with Pi simulator integration
