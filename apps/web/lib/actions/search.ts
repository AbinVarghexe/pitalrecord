'use server'

import { createClient } from '../supabase/server'

export async function getTimeline(profileId: string) {
  const supabase = await createClient()

  const { data: prescriptions, error } = await supabase
    .from('prescriptions')
    .select('*, medicines(*)')
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .order('visit_date', { ascending: false }) // primary sort
    .order('created_at', { ascending: false }) // fallback sort

  if (error) {
    console.error('Error fetching timeline:', error)
    throw new Error('Failed to fetch timeline')
  }

  return prescriptions
}

export async function searchRecords(profileId: string, query: string) {
  const supabase = await createClient()
  
  if (!query || query.trim() === '') {
    return getTimeline(profileId)
  }

  // Supabase full-text search syntax or simple ilike
  // For standard ilike search across important fields
  const { data: prescriptions, error } = await supabase
    .from('prescriptions')
    .select('*, medicines(*)')
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .or(`hospital_name.ilike.%${query}%,attending_doctor.ilike.%${query}%,raw_text.ilike.%${query}%`)
    .order('visit_date', { ascending: false })

  if (error) {
    console.error('Error searching records:', error)
    throw new Error('Failed to search records')
  }

  return prescriptions
}
