# 📁 VSCode Configuration (Integrated Browser Edition)

## Overview
Full-featured IDE experience with browser-based native sessions

## Setup

### Install from Browser
```bash
# Open in VSCode browser extension or web version
# Navigate to: https://code.visualstudio.com/
```

### Extensions to Install
1. **Tailwind CSS IntelliSense** - For Tailwind v4 integration
2. **ESLint** - Code linting (eslint-config-prettier, eslint-plugin-react-hooks)
3. **Prettier - Code formatter** (prettier ^3.7.3)
4. **React Developer Tools** - React 19 debugging
5. **TypeScript & React** - Type checking for @tanstack/router v1.170.41
6. **Vite** - Plugin support and dev server integration

## Key Files to Focus On
- `src/lib/site.ts` - Business details, booking URL, marketing copy
- `src/lib/inquiry-schema.ts` - Validation rules, spam/rate-limit rules
- `src/routes/_authenticated/` - Owner dashboard with browser client
- `src/components/site/Logo.tsx` - Logo/Monogram components

## Configuration Files
- `.env` - Committed (public backend URL/publishable key only)
- `vite.config.ts` - Vite 8.3.8 config
- `tsconfig.json` - TypeScript ^5.8.3 settings
- `eslint.config.js` - ESLint ^9.32.0 rules

## Project Rules Integration
| Rule Category | File Location | Status |
|---|---|---|
| Database changes | Ask Lovable | ✅ Configured |
| Generated files | Header detection | ✅ Configured |
| AI Gateway | Lovable gateway only | ✅ Configured |
| Connectors | list_connectors > add_connector | ✅ Configured |
| Secrets | Never in .env or browser code | ✅ Enforced |

## Multi-Model Setup
VSCode will automatically sync with:
- TanStack Router (v1.170.41)
- TanStart Server Components (v1.168.60)
- Supabase client via @supabase/supabase-js ^2.119.0

## Development Workflow
```bash
# Start dev server with Vite
npm run dev

# Build for production
npm run build

# Preview built files
npm run preview

# Test inquiry validation rules
npm run test src/test/inquiry-rules.test.ts

# Format code
npm run format
```
