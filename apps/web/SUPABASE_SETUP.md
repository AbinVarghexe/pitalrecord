# Supabase Authentication Setup

## 🔧 Google OAuth Configuration

To enable Google authentication without email verification, follow these steps:

### 1. Set up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: PitalRecord
   - User support email: Your email
   - Developer contact: Your email
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: PitalRecord
   - Authorized redirect URIs:
     - `https://jkakhqtanjdonbrliqui.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
7. Copy the **Client ID** and **Client Secret**

### 2. Configure Google Provider in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/jkakhqtanjdonbrliqui)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click on it
4. Enable the Google provider:
   - Toggle "Enable Sign in with Google" to ON
   - Paste your **Client ID**
   - Paste your **Client Secret**
   - Click **Save**

### 3. Disable Email Verification

To disable email confirmation requirements:

1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth** section
3. **UNCHECK** "Enable email confirmations"
4. Click **Save**

Alternatively, you can run this SQL in the SQL Editor:

\`\`\`sql
-- Disable email confirmation requirement
UPDATE auth.config 
SET enable_signup = true;

-- Optional: Auto-confirm all existing unconfirmed users
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
\`\`\`

### 4. Configure Auth Settings

In your Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - Site URL: `http://localhost:3000` (for development)
   - Add production URL later: `https://yourdomain.com`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

### 5. Optional: Configure Session Settings

1. Go to **Authentication** → **Settings**
2. Adjust session settings as needed:
   - JWT expiry: Default is 3600 seconds (1 hour)
   - Refresh token rotation: Enabled (recommended)

## 🚀 Testing Authentication

Start your development server:

\`\`\`bash
pnpm dev
\`\`\`

The Google sign-in button should now work without requiring email verification!

## 📝 Important Notes

- Email verification is disabled, so users can sign in immediately after authenticating with Google
- Make sure to add production URLs to both Google Cloud Console and Supabase Dashboard before deploying
- The auth callback route is set up at \`/auth/callback\`
- User session is automatically managed by the middleware

## 🔐 Security Considerations

When disabling email verification:
- Users can access the app immediately after OAuth login
- Ensure you have proper authorization checks in place
- Consider implementing rate limiting for auth endpoints
- Monitor for suspicious sign-up patterns

## 🎯 Next Steps

1. Complete the Google OAuth setup in Google Cloud Console
2. Add credentials to Supabase Dashboard
3. Disable email verification in Supabase Auth settings
4. Test the authentication flow
5. Add protected routes as needed
