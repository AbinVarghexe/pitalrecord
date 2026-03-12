import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Use a relative redirect so it works correctly behind reverse proxies
  // (avoids http/https protocol mismatches when nginx terminates TLS)
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
