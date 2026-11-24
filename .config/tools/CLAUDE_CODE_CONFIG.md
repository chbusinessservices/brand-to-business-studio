# 📁 Claude Code Configuration

## Overview
Terminal-based AI coding companion with 1.3B+ free tokens

## Setup Commands

### Installation
```bash
brew install claude-code@0
```

### Usage for Brand Studio Project
```bash
# Basic code generation
claude-code /Users/ec/brand-to-business-studio-1 src/lib/site.ts

# Terminal mode
claude-code --terminal

# File-specific
claude-code src/components/site/Logo.tsx

# Agent mode (for async tasks)
claude-code agent "Analyze project structure"
```

## Project-Specific Rules
- Working directory: `/Users/ec/brand-to-business-studio-1`
- Focus areas: `src/lib/site.ts`, `src/lib/inquiry-schema.ts`, `src/routes/_authenticated/`
- Avoid: Rewriting published git history (AGENTS.md rule)
- Use Lovable gateway for model calls
- Keep `LOVABLE_API_KEY` out of browser code

## Token Budget
- Free tier: 1.3B+ tokens
- Usage tracking via Supabase project ID: `hyxiosvwldrdilqildrs`
