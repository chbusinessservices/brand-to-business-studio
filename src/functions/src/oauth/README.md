# OAuth Server Functions

This folder contains server-side functions for handling Google OAuth authentication in BrandToBusinessStudio.

## Files Overview

| File | Purpose |
|------|---------|
| `index.ts` | Main OAuth handler with CORS support |
| `session.ts` | Session management and user verification |
| `google-auth.ts` | Google-specific auth flow handling |

## Environment Variables (Required)

Set these in **Netlify Site Settings → Environment Variables**:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=sb_publishable_XXXXX
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_REDIRECT_URI=https://chbusinessservices.pro/auth/sign-in?provider=google
GOOGLE_CALLBACK_URL=https://chbusinessservices.pro/auth/callback
AUTH_SERVICE_ROLE=your-supabase-service-role-key
```

## OAuth Configuration Steps

### 1. Set Up Supabase Auth Provider

1. Go to: `supabase.com/dashboard/YOUR_PROJECT/auth/providers`
2. Click **Add provider** → Select **Google (Gmail)**
3. Enable **OpenID Connect** for Google
4. Note the auto-generated credentials

### 2. Configure Google Cloud Console

1. Visit: [Google Cloud OAuth Setup](https://console.cloud.google.com/apis/credentials)
2. Create new OAuth consent screen (App name: `BrandToBusinessStudio`)
3. Add your app to authorized JavaScript origins: `https://chbusinessservices.pro`
4. Add redirect URIs: `https://chbusinessservices.pro/auth/callback`
5. Authorize scopes: `openid email profile https://www.googleapis.com/auth/user.info.profile`

### 3. Deploy Configuration

- Variables are deployed automatically via Netlify's CI/CD pipeline
- Functions code is compiled and deployed to `.netlify/functions-internal` directory

## Usage Example

```typescript
// src/components/chat/GoogleLoginWidget.tsx
const handleGoogleLogin = () => {
  window.location.href = "/auth/sign-in?provider=google";
};
```

## Testing

1. Set up environment variables in Netlify → Environment Variables tab
2. Clear cache and deploy: `netlify deploy --prod`
3. Visit `/auth/sign-in?provider=google` on production domain
4. Complete Google OAuth flow
5. Verify session at `/oauth/session` returns user data

## Security Notes

- Never expose `AUTH_SERVICE_ROLE` in client code or build output
- Use Supabase's built-in auth handlers (more secure than custom OAuth)
- Enable session security settings in Supabase Dashboard

## Related Files

- `netlify.toml` - Netlify routing configuration
- `.env.example` - Environment variable template
- `docs/AUTH_SETUP.md` - Complete authentication setup guide
