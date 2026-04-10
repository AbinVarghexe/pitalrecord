import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

function isAllowedRedirectHost(host: string): boolean {
  const normalizedHost = host.trim().toLowerCase()
  if (!normalizedHost) return false

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (siteUrl) {
    try {
      if (new URL(siteUrl).host.toLowerCase() === normalizedHost) {
        return true
      }
    } catch {
      // Ignore invalid NEXT_PUBLIC_SITE_URL and continue with safe defaults.
    }
  }

  if (normalizedHost === 'localhost' || normalizedHost.startsWith('localhost:')) return true
  if (normalizedHost === '127.0.0.1' || normalizedHost.startsWith('127.0.0.1:')) return true
  if (normalizedHost.endsWith('.vercel.app')) return true

  return false
}

async function resolveRedirectOrigin(requestUrl: URL): Promise<string> {
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
  if (forwardedHost && isAllowedRedirectHost(forwardedHost)) {
    const headerProto = requestHeaders.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase()
    const forwardedProto =
      headerProto === 'http' || headerProto === 'https'
        ? headerProto
        : requestUrl.protocol.replace(':', '') || (forwardedHost.includes('localhost') ? 'http' : 'https')
    return `${forwardedProto}://${forwardedHost}`
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

  const origin = await resolveRedirectOrigin(requestUrl)
  const redirectUrl = new URL('/dashboard', origin)

  return NextResponse.redirect(redirectUrl)
}
