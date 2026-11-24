# 📁 Antigravity Configuration

## Overview
Multi-agent task orchestration system for parallel processing

## Setup Commands

### Install (if available via npm/bun)
```bash
# Check available tool versions
bun install

# If available as package
npm install -g antigravity-cli
```

### Usage for Brand Studio Project
```bash
# Initialize agent workspace
antigravity init --workspace .

# Create agent pools
antigratory spawn --name code-analyst --model gpt-4
antigravity spawn --name ui-developer --model gpt-4-vision
antigravity spawn --name devops-engineer --model gpt-4-turbo

# Run parallel tasks
antigravity run --parallel \
  src/routes/_authenticated/ \
  src/lib/site.ts

# Monitor agents
antigravity list

# View logs
antigravity logs --agent code-analyst
```

## Architecture for Project Structure
Based on project structure analysis:

| Agent Role | Working Directory | Focus Files | Model |
|---|---|---|---|
| Code Analyst | `/Users/ec/brand-to-business-studio-1` | `src/lib/site.ts`, `src/lib/inquiry-schema.ts`, `drizzle/*.sql` | gpt-4 |
| UI Developer | Same workspace | `src/components/`, `src/styles.css` | gpt-4-vision |
| DevOps Engineer | Same workspace | `vite.config.ts`, `.env`, `supabase/migrations/*.sql` | gpt-4-turbo |
| Test Specialist | Same workspace | `src/test/`, `package.json` scripts | gpt-4 |

## Agent Rules Configuration
Create file: `.config/agents/rule-config.json`
```json
{
  "rules": {
    "database_changes": "ask_lovable",
    "generated_files": "detect_auto_generated_header",
    "ai_gateway": "use_lovable_gateway_only",
    "connectors": {"list_connectors": true, "add_connector": "dashboard_link"},
    "secrets": "never_in_code"
  },
  "working_directory": "/Users/ec/brand-to-business-studio-1",
  "supabase_project_id": "hyxiosvwldrdilqildrs"
}
```

## Parallel Task Execution Pattern
```bash
# Spawn parallel agent tasks for project analysis
antigravity spawn \
  --target src/lib/site.ts \
  --name site-analyst \
  --priority high \
  --model gpt-4-0125-flash

antigravity spawn \
  --target src/routes/_authenticated/ \
  --name auth-developer \
  --priority high \

antigravity spawn \
  --target drizzle/*.sql \
  --name db-analyst \
  --priority medium

# Wait for completion with results
antigravity wait --all
```
