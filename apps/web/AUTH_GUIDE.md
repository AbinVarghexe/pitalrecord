# Authentication Guide

## 📚 Overview

This project uses **Supabase** for authentication with **Google OAuth**. Email verification has been disabled for a seamless sign-in experience.

## 🎯 Features

- ✅ Google OAuth sign-in
- ✅ No email verification required
- ✅ Automatic session management
- ✅ Server and client-side authentication
- ✅ Protected routes support
- ✅ User context throughout the app

## 🚀 Quick Start

### 1. Environment Setup

The environment variables are already configured in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jkakhqtanjdonbrliqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Complete Supabase Configuration

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Set up Google OAuth credentials
- Configure Supabase authentication
- Disable email verification

### 3. Start Development

```bash
pnpm dev
```

Visit http://localhost:3000 to see the authentication in action!

## 📁 Project Structure

```
apps/web/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── page.tsx                  # Home page with auth UI
├── components/
│   ├── auth-provider.tsx         # Auth context provider
│   ├── google-sign-in-button.tsx # Google sign-in component
│   └── user-nav.tsx              # User navigation component
├── lib/
│   ├── auth/
│   │   └── actions.ts            # Auth helper functions
│   └── supabase/
│       ├── client.ts             # Browser client
│       ├── server.ts             # Server client
│       └── middleware.ts         # Session management
└── middleware.ts                 # Next.js middleware
```

## 🔧 Usage Examples

### Client Component (Sign In)

```tsx
'use client'

import { GoogleSignInButton } from '@/components/google-sign-in-button'

export default function LoginPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <GoogleSignInButton />
    </div>
  )
}
```

### Using Auth Context

```tsx
'use client'

import { useAuth } from '@/components/auth-provider'

export default function ProfilePage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <h1>Welcome {user.email}</h1>
    </div>
  )
}
```

### Server Component (Protected Page)

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only authenticated users can see this</p>
    </div>
  )
}
```

### Auth Actions

```tsx
import { signInWithGoogle, signOut, getUser } from '@/lib/auth/actions'

// Sign in with Google
await signInWithGoogle()

// Sign out
await signOut()

// Get current user
const user = await getUser()
```

## 🛡️ Security Features

- **Automatic Session Refresh**: Middleware handles session refreshing
- **Server-Side Auth**: Secure user validation on the server
- **Protected Routes**: Easy to implement with server components
- **Cookie-Based Sessions**: Secure HTTP-only cookies

## 🎨 Customization

### Add More OAuth Providers

Edit `lib/auth/actions.ts`:

```tsx
export function signInWithGitHub() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}
```

### Custom Redirect After Sign In

Edit `app/auth/callback/route.ts`:

```tsx
// Redirect to dashboard after sign in
return NextResponse.redirect(`${origin}/dashboard`)
```

### Style the Sign-In Button

The `GoogleSignInButton` component uses the Button from your UI package. Customize it in `components/google-sign-in-button.tsx`.

## 🔍 Troubleshooting

### "Invalid OAuth credentials"
- Ensure Google OAuth is configured correctly in Supabase Dashboard
- Check that redirect URIs match in Google Cloud Console

### User not persisting after refresh
- Verify middleware is running (check `middleware.ts`)
- Check browser cookies are enabled

### "Email not confirmed" error
- Ensure email verification is disabled in Supabase Dashboard
- Check Authentication → Settings → Email Auth

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google OAuth Setup](https://console.cloud.google.com/)

## 🤝 Support

For issues or questions:
1. Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide
2. Review Supabase Dashboard logs
3. Check browser console for errors
