# Google OAuth Authentication Setup Guide

## Overview

BrandToBusinessStudio uses **Google OAuth 2.0** with **Supabase Auth** to allow visitors to sign in and secure inquiries via the "Ask a question" chat widget on `chbusinessservices.pro`.

## Current Architecture

- **Frontend**: Vite + React (with Supabase client)
- **Backend**: Netlify Functions (Edge Functions)
- **Auth Provider**: Supabase Auth with Google OAuth support
- **Routing**: Netlify automatic routing

## Authentication Flow

```mermaid
graph TD
    A[User Clicks Chat Widget] --> B{Has Session?}
    B -->|Yes| C[Show Secure Area]
    B -->|No| D[Redirect to /auth/sign-in]
    D --> E[Google OAuth Provider]
    E --> F[Browser Redirect Callback]
    F --> G[/auth/callback Handler]
    G --> H[Create/Update Supabase User]
    H --> C
```

## Configuration Steps

### Step 1: Set Up Supabase Auth with Google

1. Navigate to **Supabase Dashboard** → `https://your-project.supabase.co`
2. Click **Settings** (left sidebar) → **Authentication** → **Providers** tab
3. Click **Add provider** → Select **Google (Gmail)**
4. Enable **OpenID Connect** for Google:
   - Open the **Settings** tab for this provider
   - Enable "Enable OpenID Connect"
5. Note the credentials Supabase generates (they're auto-generated)

### Step 2: Configure Netlify Environment Variables

In **Netlify Site Settings** → **Environment Variables**:

```bash
# Add these variables (required for production):
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=Your_Publishable_Key_from_supabase_dashboard
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_REDIRECT_URI=https://chbusinessservices.pro/auth/sign-in?provider=google
GOOGLE_CALLBACK_URL=https://chbusinessservices.pro/auth/callback
AUTH_SERVICE_ROLE=your-supabase-service-role-key
```

**Important**: Only commit the publishable key and project ID, never expose `AUTH_SERVICE_ROLE`.

### Step 3: Deploy with Authentication Flow

Your Netlify configuration (`netlify.toml`) should include:

```toml
[[redirects]]
  from = "/auth/sign-in/*"
  to = "/auth/login"
  status = 307

[[redirects]]
  from = "/oauth/complete/google"
  to = "/auth/callback"
  status = 200
```

### Step 4: Test the Flow

1. Visit `https://chbusinessservices.pro/auth/sign-in?provider=google`
2. Complete the Google OAuth flow
3. Verify redirect callback works
4. Test that session persists across page reloads

## Files Modified

| File | Purpose |
|------|---------|
| `.env` | Environment variables (commit-safe only) |
| `netlify.toml` | Netlify routing and function deployment |
| `src/components/ui/google-auth-btn.tsx` | Google login UI component |
| `src/lib/auth/google.ts` | Client-side auth utilities |
| `src/functions/src/oauth/` | Server functions (deployed to Netlify) |

## Security Considerations

1. **Session Management**: Supabase handles session security automatically
2. **API Keys**: Never expose `AUTH_SERVICE_ROLE` in client code
3. **Rate Limiting**: Configure in Supabase Dashboard → Authentication → Configuration
4. **CORS**: Netlify automatically handles CORS for all endpoints (including `/oauth/session`)

## Common Issues & Fixes

### Issue: "Page not found" on /auth/sign-in

**Solution**: Ensure `netlify.toml` has proper redirects configuration and redeploy with cache cleared.

### Issue: OAuth callback fails

**Solution**: Verify redirect URI in Google Cloud Console matches the exact domain, including protocol (https://).

### Issue: "Missing Authorization header"

**Solution**: Check that your Supabase client is properly initialized with the correct publishable key.

## Next Steps

1. Set up Google OAuth in Supabase Dashboard
2. Add environment variables to Netlify
3. Deploy and test authentication flow
4. Update chat widget to use `GoogleAuthButton` component

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Netlify Edge Functions](https://docs.netlify.com/functions/reference/overview/)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/openid-connect/google/openid-connect-setup)
