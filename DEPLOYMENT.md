# Vercel Deployment Guide

This guide explains how to deploy PitalRecord with Vercel using the repository CI/CD workflow.

## Architecture Overview

```
GitHub (source) -> GitHub Actions (CI) -> Vercel (hosting)
```

## Prerequisites

1. A Vercel account.
2. A Vercel project connected to this repository.
3. Supabase project credentials.

## Required GitHub Secrets

Add these in **Settings -> Secrets and variables -> Actions**:

| Secret Name | Description |
| --- | --- |
| `VERCEL_TOKEN` | Vercel personal/team token |
| `VERCEL_ORG_ID` | Vercel team/user org id |
| `VERCEL_PROJECT_ID` | Vercel project id |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL (for auth redirects) |

## CI/CD Behavior

- Pull requests to `main`/`master`: run lint, typecheck, tests, build, then deploy a Vercel preview.
- Pushes to `main`/`master`: run lint, typecheck, tests, build, then deploy production to Vercel.
- Manual run (`workflow_dispatch`): deploy production to Vercel.

## Vercel Environment Variables

Configure these in your Vercel project for Preview and Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (set to your production domain, e.g. `https://your-domain.com`)

## Notes

- Keep OAuth callback URLs in Supabase and provider settings aligned with your Vercel domain:
  - `https://your-domain.com/auth/callback`
  - `https://<project>.vercel.app/auth/callback` (optional fallback)
