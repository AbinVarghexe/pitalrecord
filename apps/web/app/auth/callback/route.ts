import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

async function resolveCanonicalOrigin(requestUrl: URL): Promise<string> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (siteUrl) {
    try {
      return new URL(siteUrl).origin
    } catch {
      // Fall through to runtime-derived origin if NEXT_PUBLIC_SITE_URL is invalid.
    }
  }

  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')
  if (forwardedHost) {
    const forwardedProto =
      requestHeaders.get('x-forwarded-proto') || (forwardedHost.includes('localhost') ? 'http' : 'https')
    return `${forwardedProto}://${forwardedHost}`
  }

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  return requestUrl.origin
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  const origin = await resolveCanonicalOrigin(requestUrl)
  const redirectUrl = new URL('/dashboard', origin)

  return NextResponse.redirect(redirectUrl)
}
