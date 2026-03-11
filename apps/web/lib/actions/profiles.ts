'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

// We will import types once generated
// import { Database } from '../supabase/types'

type ProfileInsert = any // Database['public']['Tables']['family_profiles']['Insert']
type ProfileUpdate = any // Database['public']['Tables']['family_profiles']['Update']

export async function createProfile(data: {
  name: string
  dob: string
  blood_group?: string
  allergies?: string[]
  notes?: string
}) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  // Insert profile
  const { data: profile, error } = await supabase
    .from('family_profiles')
    .insert({
      user_id: user.id,
      name: data.name,
      dob: data.dob,
      blood_group: data.blood_group,
      allergies: data.allergies || [],
      notes: data.notes
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw new Error('Failed to create profile')
  }

  revalidatePath('/profiles')
  return profile
}

export async function getProfiles() {
  const supabase = await createClient()
  
  const { data: profiles, error } = await supabase
    .from('family_profiles')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching profiles:', error)
    throw new Error('Failed to fetch profiles')
  }

  return profiles
}

export async function getProfileById(id: string) {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('family_profiles')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    throw new Error('Failed to fetch profile')
  }

  return profile
}

export async function updateProfile(id: string, data: Partial<ProfileUpdate>) {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('family_profiles')
    .update(data)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('Failed to update profile')
  }

  revalidatePath('/profiles')
  revalidatePath(`/profiles/${id}`)
  return profile
}

export async function deleteProfile(id: string) {
  const supabase = await createClient()
  
  // Soft delete by setting deleted_at
  const { data: profile, error } = await supabase
    .from('family_profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deleting profile:', error)
    throw new Error('Failed to delete profile')
  }

  revalidatePath('/profiles')
  return profile
}
