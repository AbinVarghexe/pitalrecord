import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Prefer an explicit canonical app URL so redirects stay stable across
  // localhost, LAN IPs, reverse proxies, and production domains.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const origin = siteUrl || requestUrl.origin
  const redirectUrl = new URL('/dashboard', origin)

  return NextResponse.redirect(redirectUrl)
}
