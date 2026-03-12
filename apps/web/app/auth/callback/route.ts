import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Use the Host header to construct the correct redirect URL
  // This avoids the 0.0.0.0 issue when Next.js binds to all interfaces
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const redirectUrl = `${protocol}://${host}/dashboard`

  return NextResponse.redirect(redirectUrl)
}
