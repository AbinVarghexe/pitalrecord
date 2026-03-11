'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type AuthState = {
  error?: string | null
} | null

export async function loginWithEmail(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard') // Or whichever route serves as the authenticated home
}

export async function registerWithEmail(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!email || !password || !firstName || !lastName) {
    return { error: 'All fields are required' }
  }

  const supabase = await createClient()

  // Note: the `handle_new_user` Postgres trigger automatically adds them to public.users
  // We can also pass metadata if needed. Supabase has disabled email confirmation locally by default.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  })

  // Since email confirmation is off, the user might be logged in immediately.
  if (error) {
    return { error: error.message }
  }

  // Update their profile name if needed (Wait for trigger to finish, or handle via trigger itself)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('users').update({ 
      // Add custom metadata columns if added later, right now user just has role, mfa.
    }).eq('id', user.id);
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
