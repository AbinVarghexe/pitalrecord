'use client'

import { createClient } from '@/lib/supabase/client'
import { Provider } from '@supabase/supabase-js'

export function signInWithGoogle() {
  const supabase = createClient()
  
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}

export function signInWithProvider(provider: Provider) {
  const supabase = createClient()
  
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/'
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
