# Secrets Guide (Vercel Deployment)

This repository deploys with Vercel. Configure the following GitHub Actions secrets.

## Required Secrets

| Secret Name | Source | Purpose |
| --- | --- | --- |
| `VERCEL_TOKEN` | Vercel Account Settings -> Tokens | Authorize Vercel CLI deploys |
| `VERCEL_ORG_ID` | Vercel Project Settings | Identify Vercel org/team |
| `VERCEL_PROJECT_ID` | Vercel Project Settings | Identify Vercel project |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings -> API | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings -> API | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Your production domain | Canonical URL for auth redirects |

## Where to Set Secrets

GitHub: `Repository -> Settings -> Secrets and variables -> Actions`

## Also Set in Vercel

In the Vercel dashboard, configure these environment variables (Preview + Production):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

## OAuth Reminder

Ensure OAuth redirect URLs include your Vercel URL(s):

- `https://your-domain.com/auth/callback`
- `https://<project>.vercel.app/auth/callback`
