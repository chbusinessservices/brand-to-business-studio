# 🚀 Brand Studio - Development Environment Setup Guide

## Project Overview

**Project Name:** brand-to-business-studio-1  
**Working Directory:** `/Users/ec/brand-to-business-studio-1`  
**Supabase Project:** hyxiosvwldrdilqildrs  
**Tech Stack:** React 19, Vite 8.3.8, TanStack Router 1.170.41, TypeScript 5.8.3

---

## 📦 Prerequisites Installation

### Step 1: Install Required Tools

```bash
# Check current versions
node --version
npm --version

# Install development dependencies (if needed)
npm install

# Or use Bun if preferred (project uses bun.lock)
bun install
```

### Step 2: Verify Configuration Files

```bash
# Check critical files exist
ls -la .env
ls -la src/lib/site.ts
ls -la src/lib/inquiry-schema.ts
ls -la supabase/migrations/

# Review .env configuration (these values should remain committed)
cat .env
```

### Step 3: Set Up Development Environment

```bash
# Run the setup script
chmod +x .config/setup.sh
./config/setup.sh
```

---

## 🛠️ Available Development Tools & Harnesses

### 1. Claude Code (Terminal AI Coding)
- **Purpose:** Terminal-based code generation and analysis
- **Free Token Budget:** 1.3B+ tokens
- **Configuration:** `.config/tools/CLAUDE_CODE_CONFIG.md`
- **Usage:**
```bash
# Basic file analysis
claude-code src/lib/site.ts

# Project structure analysis
claude-code --task "Analyze brand studio project structure"
```

### 2. VSCode (Integrated Browser Edition)
- **Purpose:** Full-featured IDE with browser integration
- **Extensions to Install:**
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier - Code formatter
  - React Developer Tools
  - TypeScript & React
- **Configuration:** `.config/tools/VSCODE_CONFIG.md`

### 3. Antigravity (Multi-Agent Orchestration)
- **Purpose:** Parallel task execution with AI agents
- **Configuration:** `.config/harnesses/AGENTS_CONFIG.md`
- **Usage:**
```bash
# Spawn code analysis agent
antigravity spawn --name code-analyst --model gpt-4

# Run parallel tasks
antigravity run --parallel \
  src/lib/site.ts \
  supabase/migrations/*.sql

# Wait for completion
antigrativity wait --target agent-id
```

### 4. Pi (Mobile Development)
- **Purpose:** iOS/macOS mobile testing and development
- **Configuration:** `.config/tools/PI_CONFIG.md`
- **Simulator Commands:**
```bash
# List simulators
xcodebuildmcp list_sims

# Boot simulator
xcodebuildmcp boot_sim

# Build and launch
xcodebuildmcp build_run_sim
```

### 5. OpenCode (GitHub Integration)
- **Purpose:** Codebase exploration via GitHub MCP
- **Configuration:** `.config/tools/OPENCODE_CONFIG.md`
- **MCP Commands:**
```bash
# List resources from Stripe server
list_mcp_resources server=stripe

# View balance summary widget
read_mcp_resource server=stripe uri=ui://widget/balance-summary.html

# Check browser sessions
mcp__chrome_devtools.list_pages
```

### 6. VSCode Extensions (Browser-Based IDE)
- **Purpose:** Browser-based full IDE experience
- **Integration:** Native session sync with actual VSCode
- **Extensions Setup:** See `tools/VSCODE_CONFIG.md`

---

## 📊 Project Structure Reference

### Core Configuration Files
| File | Purpose | Rule Enforcement |
|---|---|---|
| `.env` | Backend config (published keys only) | Never put secrets |
| `tsconfig.json` | TypeScript configuration | Type safety enabled |
| `vite.config.ts` | Vite build config | Build optimization |

### Critical Source Files
```
src/
├── lib/
│   ├── site.ts          → Business details, booking URL, marketing copy
│   ├── inquiry-schema.ts → Validation rules, spam/rate-limit
│   └── agent/           → Agent prompts and request schemas
│
├── routes/
│   └── _authenticated/   → Owner dashboard with RLS policies
│
├── components/          → React components
├── styles.css           → Global styles
└── routeTree.gen.ts     → Generated router tree

supabase/
├── migrations/          → Database schema changes (ask Lovable for edits)
└── config.toml         → Supabase configuration
```

---

## 🔐 Project Rules Enforcement

### Rule Categories

| Category | File Location | Agent Responsible | MCP Tool Required |
|---|---|---|---|
| **Database Changes** | supabase/migrations/ | Any agent | `mcp__supabase.*` |
| **Generated Files** | Header detection | All agents | Detect before modification |
| **AI Gateway** | src/lib/agent/* | Code agents | Lovable gateway only |
| **Connectors** | Project setup | DevOps agent | list_connectors, add_connector |
| **Secrets** | .env, codebase | All agents | Never modify directly |

### Key Constraints

1. **Never rewrite published git history** - Force push or rebase is forbidden per AGENTS.md
2. **Keep secrets out of browser code** - Only commit publishable keys, not API tokens
3. **Use Lovable gateway for model calls** - Don't use other APIs directly
4. **Database requires MCP access** - Use mcp__supabase.* tools for schema changes

---

## 🚀 Development Workflow

### Phase 1: Setup & Environment (One-Time)
```bash
# 1. Install dependencies
npm install

# 2. Run setup script
./config/setup.sh

# 3. Verify configuration
mcp__supabase.get_project project_id="hyxiosvwldrdilqildrs"
list_mcp_resources server=stripe
```

### Phase 2: Codebase Analysis (First Development Session)
```bash
# Analyze key files in parallel using Antigravity
antigravity spawn \
  --target src/lib/site.ts \
  --name site-analyst \
  --model gpt-4

antigrativity spawn \
  --target supabase/migrations/*.sql \
  --agent db-analyst \
  --supabase-project-id hyxiosvwldrdilqildrs

# Wait for analysis completion
antigravity wait --all
```

### Phase 3: Active Development (Ongoing)

#### Backend Development (Rules & Business Logic)
```bash
# Focus on src/lib/inquiry-schema.ts
cat src/lib/inquiry-schema.ts | head -50

# Test inquiry validation
npm run test src/test/inquiry-rules.test.ts
```

#### Frontend Development (UI Components)
```bash
# View site configuration structure
head -80 src/lib/site.ts

# Analyze component directory
ls src/components/

# Review styles
cat src/styles.css | head -100
```

#### Build & Deploy
```bash
# Build for production
npm run build

# Preview built files
npm run preview

# Test with Vitest if changes made
npm run test
```

---

## 📈 Multi-Harness Token Budget Tracking

| Harness/Tool | Free Tokens Available | Usage Location | Status |
|---|---|---|---|
| Claude Code | 1.3B+ | Terminal sessions | ✅ Ready |
| VSCode | Same tier | Browser extensions | ✅ Setup ready |
| Antigravity | Same tier | Agent orchestration | ✅ Configured |
| Pi Mobile | Same tier | Mobile testing | ✅ Prepared |
| OpenCode | Same tier | GitHub integration | ✅ Integrated |

---

## 🔧 Quick Reference Commands

### Common Development Tasks

```bash
# Start development server (Vite with TanStack Router)
npm run dev

# Build production files
npm run build

# Preview built output
npm run preview

# Format all code
npm run format

# Run tests (inquiry validation rules)
npm run test src/test/inquiry-rules.test.ts

# Lint entire codebase
npm run lint

# Check project status via Supabase MCP
mcp__supabase.get_project project_id="hyxiosvwldrdilqildrs"

# List available MCP resources
list_mcp_resources server=stripe
list_mcp_resources server=xcodebuildmcp

# Spawn code analysis agent (if Antigravity available)
antigravity spawn --name code-analyst --model gpt-4
```

---

## 📁 Generated Configuration Files

| File | Purpose | Usage |
|---|---|---|
| `.config/tools/CLAUDE_CODE_CONFIG.md` | Claude Code setup | Terminal AI coding |
| `.config/tools/VSCODE_CONFIG.md` | VSCode setup | IDE integration |
| `.config/tools/ANTIGRAVITY_CONFIG.md` | Antigravity setup | Agent orchestration |
| `.config/tools/PI_CONFIG.md` | Pi mobile setup | Mobile testing |
| `.config/tools/OPENCODE_CONFIG.md` | OpenCode setup | GitHub integration |
| `.config/harnesses/AGENTS_CONFIG.md` | Multi-agent rules | Agent spawning |
| `.config/harnesses/DEVELOPMENT_PIPELINE.md` | Development pipeline | Complete workflow |
| `.config/setup.sh` | Auto-setup script | Environment init |

---

## 🎯 Project-Specific Highlights

### Key Business Information (src/lib/site.ts)
- **Name:** CH Business Services
- **Domain:** chbusinessservices.pro
- **Phone:** (929) 515-5434
- **Email:** office@chbusinessservices.pro
- **Founded:** 2023
- **Founder:** Elias Chouchani
- **Category:** Brand architecture and business systems studio

### Core Philosophy (4 Pillars)
1. **CODE** - Brand clarity and positioning
2. **SHIELD** - Responsibilities and review coordination
3. **SIGNAL** - Websites and market presence visibility
4. **SYSTEM** - Client experience and operations workflows

---

## ⚠️ Important Notes

1. **Never modify auto-generated files** - Check headers in generated files (mcp-output/, etc.)
2. **Use Lovable MCP for database changes** - Don't directly edit migrations without MCP approval
3. **Keep secrets out of browser code** - Only commit publishable keys from .env
4. **Follow TanStack Router patterns** - Routes use @tanstack/react-router v1.170.41

---

## 🚀 Getting Started

```bash
# 1. Setup environment
./config/setup.sh

# 2. Start development server
npm run dev

# 3. Open browser at: http://localhost:5173 (Vite default)

# 4. Test mobile view
mcp__chrome_devtools.emulate --viewport "375x667,mobile"

# 5. Build and test
npm run build && npm run preview
```

---

## 📞 Support & Resources

- **AGENTS.md** - Project rules and Lovable MCP integration
- **package.json** - All development dependencies and scripts
- **README.md** - Full project documentation
- **Supabase** - Database backend (project ID: hyxiosvwldrdilqildrs)

