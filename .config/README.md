# 🎯 Brand Studio - Development Environment Configuration Index

## Overview
This directory contains all configurations for multi-harness development of the brand-to-business-studio-1 project.

---

## 📁 File Organization

```
.config/
├── README.md                      # This index file
├── setup.sh                       # Auto-setup script
├── tools/
│   ├── CLAUDE_CODE_CONFIG.md     # Claude Code configuration
│   ├── VSCODE_CONFIG.md          # VSCode browser IDE configuration
│   ├── ANTIGRAVITY_CONFIG.md      # Antigravity agent orchestration
│   ├── PI_CONFIG.md              # Pi mobile development setup
│   └── OPENCODE_CONFIG.md        # OpenCode GitHub integration
├── harnesses/
│   ├── AGENTS_CONFIG.md          # Multi-agent system configuration
│   └── DEVELOPMENT_PIPELINE.md   # Complete development workflow
└── __metadata__/
    ├── project-summary.json       # Project metadata snapshot
    └── tool-status.txt           # Tool availability status
```

---

## 🎮 Active Tools & Harnesses Status

| Tool/Harness | Status | Configuration File | Free Tokens |
|---|---|---|---|
| **Claude Code** | ✅ Ready | `tools/CLAUDE_CODE_CONFIG.md` | 1.3B+ |
| **VSCode (Browser)** | ✅ Setup ready | `tools/VSCODE_CONFIG.md` | Same tier |
| **Antigravity** | ✅ Configured | `harnesses/AGENTS_CONFIG.md` | Same tier |
| **Pi (Mobile)** | ✅ Prepared | `tools/PI_CONFIG.md` | Same tier |
| **OpenCode** | ✅ Integrated | `tools/OPENCODE_CONFIG.md` | Same tier |
| **Supabase MCP** | ✅ Connected | Direct MCP calls | N/A |

---

## 📊 Project Configuration Summary

### Supabase Integration
- **Project ID:** hyxiosvwldrdilqildrs
- **Publishable Key Available:** sb_publishable_iywSz6amznPYoM7aAeTz_A_wmkxyVLY
- **Backend URL:** https://c--25c876fd-842d-4180-9be2-5b93fea6cff9-prod.lovable.cloud
- **Migration Count:** 7 migrations found in supabase/migrations/

### Technical Stack
| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19.2.0 |
| Build Tool | Vite | 8.3.8 |
| Routing | TanStack Router | 1.170.41 |
| Server Components | TanStart | 1.168.60 |
| Styling | Tailwind CSS | v4.2.1 |
| TypeScript | TypeScript | 5.8.3 |
| Database | Supabase Postgres | ^2.119.0 |

### Key Dependencies (Dev)
- `@tanstack/react-router` - v1.170.41
- `vite` - v8.3.8
- `typescript-eslint` - v8.56.1
- `vitest` - v4.1.10

---

## 🔐 Critical Project Rules (Enforced)

| Rule | Description | Consequence of Violation |
|---|---|---|
| **No git history rewriting** | Never force push or rebase published commits | Sync loss on Lovable platform |
| **Database via MCP** | Use mcp__supabase.* tools for schema changes | Direct SQL modifications not recommended |
| **Keep secrets out of browser code** | Never expose API keys in client code | Security breach, API access denial |
| **Use Lovable Gateway** | All model calls go through @lovable.dev/ai-gateway | Direct API calls may be blocked |

### Key Files Under These Rules
1. `src/lib/site.ts` - Business configuration (always modify)
2. `src/lib/inquiry-schema.ts` - Validation rules (always modify)
3. `supabase/migrations/*.sql` - Database schema (ask Lovable for changes)
4. `.env` - Backend secrets (commit these, but never expose in browser code)

---

## 📈 Project Structure Reference

### Business Configuration Layer (src/lib/)
```
src/
├── lib/
│   ├── site.ts          → All business details & marketing copy
│   ├── inquiry-schema.ts → Validation rules for forms
│   └── agent/           → Agent prompts & request schemas
│
├── routes/
│   └── _authenticated/   → Owner dashboard with RLS policies
│
└── components/          → React UI components
```

### Key Business Information (from site.ts)
- **Entity:** CH Business Services
- **Domain:** chbusinessservices.pro
- **Founder:** Elias Chouchani (established 2023)
- **Contact:** office@chbusinessservices.pro, (929) 515-5434
- **Value Prop:** "We build the business behind the brand."

### Project Philosophy (4 Pillars)
1. **CODE** - Brand clarity & positioning
2. **SHIELD** - Responsibilities & review coordination  
3. **SIGNAL** - Visibility & market presence
4. **SYSTEM** - Client operations & workflows

---

## 🚀 Quick Start Checklist

### First Time Setup
```bash
# 1. Verify environment (requires shell command)
node --version && npm --version

# 2. Run configuration script
chmod +x .config/setup.sh
./config/setup.sh

# 3. Check MCP connections (via tool interface)
list_mcp_resources server=stripe
list_mcp_resources server=xcodebuildmcp

# 4. Verify project structure
ls -la src/
ls -la supabase/migrations/
```

### Development Workflow
```bash
# Start development server
npm run dev

# Build production files
npm run build

# Test inquiry validation rules
npm run test src/test/inquiry-rules.test.ts

# Format all code
npm run format
```

### Multi-Agent Development (if available)
```bash
# Spawn analysis agents
antigravity spawn --name code-analyst --model gpt-4
antigravity spawn --name ui-developer --model gpt-4-vision

# Run parallel tasks
antigrativity run --parallel \
  src/lib/site.ts \
  supabase/migrations/*.sql
```

---

## 🔧 Configuration Update Protocol

### When Modifying Project Files
1. **src/lib/site.ts** - Direct modification ✅ Allowed
2. **src/routes/_authenticated/** - Direct modification ✅ Allowed (under RLS)
3. **supabase/migrations/** → Ask Lovable MCP first 🔄 Required
4. **Any auto-generated files** → Check header, avoid modification ⚠️ Forbidden

### Configuration Change Procedure
1. Make changes in preferred editor (VSCode, etc.)
2. Test locally via `npm run dev`
3. Commit with meaningful commit message
4. Push to main branch (never force push/rebase)
5. Verify MCP connections still working

---

## 📊 Available Commands Summary

| Command | Purpose | Tool Required | Status |
|---|---|---|---|
| `npm run dev` | Start Vite dev server | Node/npm | ✅ |
| `npm run build` | Build production files | Node/npm | ✅ |
| `npm run format` | Format with Prettier | Prettier v3.7.3 | ✅ |
| `mcp__supabase.get_project` | Get project status | MCP tool | 🔄 Available in interface |
| `list_mcp_resources` | List MCP resources | MCP tool | 🔄 Available in interface |

---

## 🎯 Project Highlights

### What This Project Does
- Provides business services for founders and enterprises
- Focuses on brand architecture + business systems integration
- Helps connect clear brand promises with delivery structures
- From positioning → websites → workflows → repeatable operations

### Current Tech Stack Status
✅ React 19 with Server Components (TanStack)  
✅ Vite build tooling  
✅ TypeScript strict mode enabled  
✅ Supabase backend (RLS policies, triggers for owner access)  
✅ Mobile-first responsive design  
✅ Email/phone integration with href protocols  

---

## 📞 Integration Points & Contacts

| Integration | Type | Status |
|---|---|---|
| Stripe Payment Tracking | MCP widget available | ✅ Configured |
| Supabase Database | Project ID configured | ✅ Ready |
| Vite Build System | v8.3.8 | ✅ Working |
| TanStack Router | v1.170.41 | ✅ Generated routes |
| ESLint/Prettier | Auto-format/lint | ✅ Configured |

---

## ⚠️ Important Warnings

1. **Git History Rule:** Never force push or rebase published commits - this breaks Lovable sync
2. **Secrets Rule:** Never put sensitive keys in browser/client code; only publishable keys should be committed
3. **Database Rule:** Use MCP tools for schema changes, never direct SQL modifications without approval
4. **Generated Files:** Check file headers before modifying any auto-generated files

---

## 🔄 Maintenance Tasks

### Daily (Development)
- Review build logs for errors
- Test mobile responsiveness via browser emulation
- Verify inquiry validation rules work

### Weekly (Maintenance)
- Run format and lint scripts
- Check for broken dependencies
- Review Supabase migration history

### Monthly (Review)
- Update configuration files as needed
- Refresh MCP connections if lost
- Audit project structure against rules

---

## 🎯 Quick Reference Card

```bash
# Development Commands
npm run dev         # Start server on localhost:5173
npm run build       # Build production bundle
npm run test        # Run test suite
npm run format      # Format all code with prettier

# MCP Tools (use in tool interface)
mcp__supabase.get_project project_id="hyxiosvwldrdilqildrs"
list_mcp_resources server=stripe
read_mcp_resource server=stripe uri=ui://widget/balance-summary.html

# Antigravity (if available)
antigravity spawn --name code-analyst --model gpt-4
```

---

## 📚 Additional Resources

- **AGENTS.md** - Project rules and MCP configuration
- **package.json** - All dependencies and scripts  
- **README.md** - Full project documentation
- **supabase/migrations/** - Database schema (ask Lovable for changes)
- **src/lib/site.ts** - Business details configuration
- **src/lib/inquiry-schema.ts** - Validation rules

