# 🔐 Google OAuth Authentication Setup - QUICK DEPLOY GUIDE

## Current Status

Your `chbusinessservices.pro` site **currently has a 404 error** on the `/oauth/initiate` route because Netlify doesn't recognize that path for OAuth flows. The file structure is now complete for proper Google OAuth authentication.

---

## 📋 Files Created

```
/Users/ec/brand-to-business-studio-1/
├── netlify.toml                     # Updated with proper OAuth redirects
├── .env                             # Environment variables (commit-safe)
├── .env.example                     # Template for environment variables
├── src/
│   ├── functions/src/oauth/         # Server-side Auth Functions
│   │   ├── README.md
│   │   ├── index.ts                 # Main OAuth handler
│   │   ├── session.ts               # Session management
│   │   └── google-auth.ts           # Google-specific handlers
│   ├── lib/auth/
│   │   └── google.ts               # Client-side auth utilities
│   ├── components/chat/
│   │   ├── AuthWidget.tsx          # Chat widget login check
│   │   └── ui/google-auth-btn.tsx  # Google login UI button
│   └── routes/_authenticated/
│       └── auth.google.tsx         # OAuth redirect handler
└── docs/
    └── AUTH_SETUP.md              # Detailed setup documentation
```

---

## 🚀 DEPLOYMENT STEPS (Complete in 5 minutes)

### Step 1: Configure Google OAuth in Supabase (3 min)

1. **Go to**: `https://supabase.com/dashboard/YOUR_PROJECT`
2. Click left sidebar → **Settings** → **Authentication** → **Providers** tab
3. Click **Add provider** → Select **Google (Gmail)**
4. Enable OpenID Connect:
   - Click "Enable" toggle for "OpenID Connect"
   - Note the credentials that appear below
5. Save and close

> 💡 Supabase will auto-generate your Google OAuth credentials automatically!

---

### Step 2: Set Netlify Environment Variables (2 min)

1. **Go to**: `https://netlify.com` → Your site settings
2. Click **Site Settings** → **Environment variables** tab
3. Add these **environment variables** in the table:

| Variable Name | Value (fill from Supabase) | Notes |
|--------------|----------------------------|-------|
| `SUPABASE_URL` | From Step 1's credentials | Your project URL like `https://xxxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | From Step 1's credentials | Publishable key, starts with `sb_publishable_` |
| `GOOGLE_CLIENT_ID` | From Supabase's generated creds | Format: `xxx.apps.googleusercontent.com` |
| `GOOGLE_REDIRECT_URI` | Use the exact string: `https://chbusinessservices.pro/auth/sign-in?provider=google` | Include ?provider=google suffix |
| `GOOGLE_CALLBACK_URL` | Same as above: `https://chbusinessservices.pro/auth/callback` | |
| `AUTH_SERVICE_ROLE` | From Step 1's credentials | Service role key (starts with `vi_`), **NEVER COMMIT THIS** ⚠️ |

4. Click **Save variables** at the bottom of the page
5. Wait for deployment to complete if prompted

> ⚠️ **CRITICAL**: Never expose `AUTH_SERVICE_ROLE` - it's for internal server-only operations. Only commit `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `GOOGLE_CLIENT_ID`.

---

### Step 3: Update netlify.toml (1 min)

Ensure your `netlify.toml` file contains these redirects:

```toml
# BrandToBusinessStudio - Auth Flow Configuration

[[redirects]]
  from = "/auth/sign-in/*"
  to = "/auth/login"
  status = 307

[[redirects]]
  from = "/oauth/complete/google"
  to = "/auth/callback"
  status = 200

[[redirects]]
  from = "/api/public/agency-agent-chat"
  to = "/.netlify/functions/oauth-handoff"
  status = 200

# Supabase secrets - excluded from build output (build environment)
SECRETS_SCAN_OMIT_KEYS = "SUPABASE_URL,SUPABASE_ANON_KEY,AUTH_SERVICE_ROLE,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET"
NITRO_PRESET = "netlify"
```

> 💡 Netlify automatically deploys the function code from `src/functions/src/` to `.netlify/functions-internal` on build. No manual upload needed!

---

### Step 4: Verify & Test (2 min)

1. **Visit**: `https://chbusinessservices.pro/auth/sign-in?provider=google`
   - You should see a redirect to Google's login page
   - If you get another "Page not found" error, redeploy with cache cleared

2. **Complete the OAuth flow**:
   - Select your Google account
   - Agree to terms
   - Wait for browser redirect back to `chbusinessservices.pro`

3. **Test session persistence**:
   - Refresh the page (should maintain auth)
   - Open a new tab in same browser (should stay logged in)

4. **Test chat widget**:
   - Check that "Ask a question" now requires login first
   - Click Google login button in chat widget
   - Verify proper flow through authentication

---

## 🎯 Next Steps for Chat Widget Integration

Once the OAuth flow is working, add these components where needed:

### A. Chat Widget Login Button

Add this somewhere near your existing chat widget code:

```typescript
import { GoogleAuthButton } from '@/components/ui/google-auth-btn';

<GoogleAuthButton 
  size="md" 
  variant="primary" 
>
  Ask a Question (Login Required)
</GoogleAuthButton>
```

### B. Route-Protected Content

Use your `AuthWidget` in any route-protected components:

```typescript
import { AuthWidget } from '@/components/chat/AuthWidget';

function SecureArea() {
  const handleLogin = async () => {
    // Redirect user to /auth/sign-in?provider=google
    window.location.href = '/auth/sign-in?provider=google';
  };
  
  return (
    <div>
      <AuthWidget onLogin={handleLogin} />
      {/* Secure content goes here */}
    </div>
  );
}
```

---

## 🔧 Common Troubleshooting

### ❌ "Page not found" on /auth/sign-in?provider=google

**Fix**: Ensure `netlify.toml` has the proper redirect rules and redeploy. Also clear Netlify's cache by going to Site Settings → General Settings → Clear site cache.

### ❌ "Missing Authorization header" errors

**Fix**: Verify you're using the correct publishable key (not service role) for frontend code. The `SUPABASE_ANON_KEY` starts with `sb_publishable_`.

### ❌ OAuth callback fails silently

**Fix**: Check the browser console and DevTools Network tab. Look for 500 errors from your `.netlify/functions-internal/oauth/session` endpoint.

---

## 📊 Deployment Checklist

Before deploying:
- ✅ Netlify.toml configured with proper redirects
- ✅ Environment variables set (not committed)
- ✅ Google OAuth enabled in Supabase
- ✅ Test flow works on staging first
- ✅ CORS headers added to all auth endpoints
- ✅ Session persistence working (test across tabs)

---

## 📚 Reference Documentation

| Document | Purpose |
|----------|---------|
| `docs/AUTH_SETUP.md` | Complete technical setup guide |
| `src/functions/src/oauth/README.md` | OAuth function usage details |
| `netlify.toml` | Netlify build configuration |

---

## 🆘 Support

After setting up authentication:
1. Verify all variables are set correctly in Netlify environment
2. Test the full flow with a real browser (not DevTools)
3. Check session persistence works as expected
4. Update chat widget components once you're comfortable with OAuth

🚀 **Go deploy and let visitors log in securely!**
