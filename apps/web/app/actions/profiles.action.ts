'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfiles() {
  const supabase = await createClient()

  // RLS ensures we only get profiles for the logged-in user
  const { data: profiles, error } = await supabase
    .from('family_profiles')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching profiles:', error)
    return { error: error.message, data: null }
  }

  return { data: profiles, error: null }
}

export async function createProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const dob = formData.get('dob') as string
  const bloodGroup = formData.get('bloodGroup') as string | null
  const allergiesInput = formData.get('allergies') as string | null
  const notes = formData.get('notes') as string | null

  if (!name || !dob) {
    return { error: 'Name and Date of Birth are required' }
  }

  const allergies = allergiesInput 
    ? allergiesInput.split(',').map(a => a.trim()).filter(Boolean) 
    : []

  const { data, error } = await supabase
    .from('family_profiles')
    .insert({
      user_id: user.id,
      name,
      dob,
      blood_group: bloodGroup,
      allergies,
      notes,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/profiles')
  
  return { data, error: null }
}
