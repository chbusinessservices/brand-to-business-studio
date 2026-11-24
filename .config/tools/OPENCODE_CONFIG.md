# 📁 OpenCode Configuration

## Overview
GitHub-based codebase integration for brand-to-business-studio-1 project

## Setup via CLI
```bash
# Install OpenCode CLI (if available)
npm install -g @github/code-cli

# Or use native browser session integration
# Navigate to GitHub web interface with MCP connection
```

## Integration Points

### Repository Structure Mapping
| Project File | GitHub Equivalent | Access Method |
|---|---|---|
| `src/lib/site.ts` | /main/src/lib/site.ts | Direct file access |
| `src/routes/_authenticated/` | /main/src/routes/_authenticated | Authenticated view |
| `supabase/migrations/` | /supabase/migrations/ | Schema viewer |
| `.env` | Private (never public) | .gitignore enforcement |

### Codebase Exploration Commands
```bash
# Direct file inspection (via MCP)
mcp__chrome_devtools.take_snapshot pageId=1

# Repository structure listing
tree -I 'node_modules|.git' src/

# Schema exploration
ls supabase/migrations/
```

## GitHub Integration Rules

| Rule | Enforcement | Consequence |
|---|---|---|
| Force push history | ❌ Never allowed | Sync loss on Lovable |
| Rebase/amend commits | ❌ Forbidden | History rewrite |
| Public secrets sharing | ❌ Violation | Security breach |

### Safe Exploration Commands
```bash
# List MCP resources available for project
list_mcp_resources server=stripe
list_mcp_resources server=xcodebuildmcp

# View specific resources
read_mcp_resource server=stripe uri=ui://widget/balance-summary.html
read_mcp_resource server=xcodebuildmcp uri=xcodebuildmcp://simulators
```

## Multi-Model Integration for OpenCode

### Model Assignment Strategy
| Task Type | Model | Files |
|---|---|---|
| Frontend UI changes | gpt-4-vision | `src/components/*`, `src/styles.css` |
| Backend logic | gpt-4 | `src/lib/*`, `src/routes/*` |
| Database migrations | Code analysis + SQL gen | `supabase/migrations/*.sql` |
| Documentation | GPT-3.5-turbo | README.md, AGENTS.md |

## Configuration Files to Maintain

### `.github/workflows/main.yml`
```yaml
name: Brand Studio CI/CD
on:
  push:
    branches: [main]
jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint Code
        run: npm run lint
      - name: Build
        run: npm run build
```

### `.gitignore` (ensure .env is included)
```
.env
node_modules/
dist/
.pnpm-debug*
# Exclude generated files headers
*/.auto-generated
*/.mcp-output
```

## Browser Integration with MCP Tools
```bash
# List available browser sessions
mcp__chrome_devtools.list_pages

# Take snapshot of current page
mcp__chrome_devtools.take_snapshot pageId=1
mcp__chrome_devtools.take_snapshot pageIdx=0 verbose=true

# Get network requests for debugging
mcp__chrome_devtools.list_network_requests pageId=1
```

## Development Workflow Integration
| Step | Tool | Command |
|---|---|---|
| Code exploration | MCP + OpenCode | `list_mcp_resources` |
| Schema analysis | Supabase MCP | `get_project` with project_id |
| Database queries | Exec SQL | `mcp__supabase.execute_sql` |
| File changes | VSCode in browser | Native session sync |
| Mobile testing | Pi integration | Browser emulation + device test |
