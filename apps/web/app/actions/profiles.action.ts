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

  const { count: activeProfileCount } = await supabase
    .from('family_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if ((activeProfileCount || 0) >= 10) {
    return { error: 'You have reached the maximum of 10 active family profiles' }
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
  revalidatePath('/dashboard/profiles')
  
  return { data, error: null }
}

export async function updateProfile(profileId: string, formData: FormData) {
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
    .update({
      name,
      dob,
      blood_group: bloodGroup || null,
      allergies,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profiles')
  revalidatePath(`/dashboard/profiles/${profileId}`)
  
  return { data, error: null }
}

export async function deleteProfile(profileId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Soft delete the profile
  const { error } = await supabase
    .from('family_profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', profileId)

  if (error) {
    console.error('Error deleting profile:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profiles')
  
  return { error: null }
}

export async function getProfile(profileId: string) {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('family_profiles')
    .select('*')
    .eq('id', profileId)
    .is('deleted_at', null)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return { error: error.message, data: null }
  }

  return { data: profile, error: null }
}
