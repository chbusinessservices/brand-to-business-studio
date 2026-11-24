# 📁 Multi-Agent System Configuration

## Overview
Multi-agent orchestration for brand-to-business-studio-1 project development

## Agent Architecture

### Core Agents (Spawning Strategy)

| Agent Name | Role | Priority | Model | Workspace |
|---|---|---|---|---|
| code-analyst | Analyze project structure and dependencies | High | gpt-4 | `/Users/ec/brand-to-business-studio-1` |
| ui-developer | Handle React/Tailwind components | High | gpt-4-vision | `src/components/*`, `styles.css` |
| backend-engineer | Server routes, Supabase integration | Medium | gpt-4 | `src/lib/*`, `src/routes/*` |
| devops-specialist | Build configs, CI/CD, deployment | High | gpt-4-turbo | `.github/*`, package.json |
| test-manager | Test setup, Vitest configurations | Medium | gpt-4 | `src/test/*`, `vitest.config.ts` |

### Agent Spawning Commands

```bash
# Initial agent spawning
antigravity spawn --name code-analyst --model gpt-4
antigravity spawn --name ui-developer --model gpt-4-vision
antigravity spawn --name backend-engineer --model gpt-4
antigrativity spawn --name devops-specialist --model gpt-4-turbo

# Create agent pool for ongoing work
antigravity pool --name brand-studio-dev --agents code-analyst,ui-developer,backend-engineer

# Monitor agents
antigravity list --all

# Wait for completion
antigravity wait --target agent-id
```

## Agent Work Distribution Strategy

### Phase 1: Codebase Analysis (Parallel)
```bash
antigravity spawn \
  --agent code-analyst \
  --task "Analyze project structure from AGENTS.md and directory listing" \
  --priority high \
  --timeout 300s \
  --workspace /Users/ec/brand-to-business-studio-1

antigrativity spawn \
  --agent db-analyst \
  --task "Review Supabase schema from migrations/*.sql files" \
  --priority medium \
  --timeout 200s \
  --supabase-project-id hyxiosvwldrdilqildrs
```

### Phase 2: Rule Application
Apply project rules to all agents:
- Database changes → ask Lovable MCP
- Generated files → detect and avoid modification
- AI Gateway → use lovable-gateway for model calls
- Connectors → use list_connectors, add_connector (dashboard link)
- Secrets → never commit sensitive values

## Multi-Agent Workflow Pattern

```bash
# Agent orchestration loop
while true; do
  # Spawn new agents as needed
  antigravity spawn --task "next task"
  
  # Wait for completion
  antigrativity wait --target agent-id
  
  # Update status
  echo "Phase complete: $(date)" >> .agent-status.log
done
```

### Agent Communication Protocol
1. **Primary Coordinator**: This system (main agent)
2. **Specialized Agents**: Spawned per-domain needs
3. **Communication Channels**: 
   - Direct send_input to agents
   - File-based status updates
   - Shared MCP context

## Rule-Based Agent Permissions
```json
{
  "rules": {
    "database_schema_changes": {
      "action": "require_lovable_mcp",
      "description": "Never modify supabase/migrations directly"
    },
    "auto_generated_files": {
      "action": "detect_and_avoid_modification",
      "patterns": [".mcp-output/", ".lovable/"]
    },
    "ai_gateway_calls": {
      "action": "direct_via_lovable_api",
      "endpoint": "https://lovable-gateway.api.endpoint"
    }
  }
}
```

## Agent Status Monitoring
```bash
# Check all agent activities
antigravity list --verbose --all

# Monitor active tasks
watch -n 30 "antigrativity get-status --agent-id"
```

### Cleanup Strategy
```bash
# Close inactive agents after timeout
antigravity close_agent agent-id
antigrativity wait_agent --target agent-id --timeout 60s
```
