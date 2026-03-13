import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  
  // Array of auth routes that logged-in users shouldn't access
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  
  if (isDevelopment && request.nextUrl.pathname === '/') {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  if (isDevelopment && request.nextUrl.pathname.startsWith('/dashboard')) {
    return supabaseResponse
  }

  // If user is logged in and trying to access an auth route, redirect to dashboard
  if (user && isAuthRoute) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    
    // Force HTTPS in production
    if (!dashboardUrl.host.includes('localhost')) {
      dashboardUrl.protocol = 'https:'
    }
    
    return NextResponse.redirect(dashboardUrl)
  }

  // If user is not logged in and trying to access a protected route (dashboard), redirect to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    
    // Force HTTPS in production
    if (!loginUrl.host.includes('localhost')) {
      loginUrl.protocol = 'https:'
    }
    
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
