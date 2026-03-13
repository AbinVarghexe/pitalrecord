'use server'

import { createClient } from '@/lib/supabase/server'
import { DEMO_PROFILES, DEMO_PRESCRIPTIONS } from '../mock-data'
import { revalidatePath } from 'next/cache'

export async function seedDemoData() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('You must be logged in to seed demo data.')
  }

  // 1. Check if profiles already exist
  const { data: existingProfiles } = await supabase
    .from('family_profiles')
    .select('id, name')
    .eq('user_id', user.id)

  if (existingProfiles && existingProfiles.length > 0) {
    console.log('User already has profiles. Skipping seeding to prevent duplicates.')
    return { success: false, message: 'Demo data already exists.' }
  }

  try {
    // 2. Insert Profiles
    const profileInserts = DEMO_PROFILES.map((p) => ({
      ...p,
      user_id: user.id,
    }))

    const { data: insertedProfiles, error: profileError } = await supabase
      .from('family_profiles')
      .insert(profileInserts)
      .select('id, name')

    if (profileError) throw profileError
    if (!insertedProfiles) throw new Error('Failed to insert profiles')

    const profileMap = new Map(insertedProfiles.map((p) => [p.name, p.id]))

    // 3. Insert Prescriptions & Medicines
    for (const rx of DEMO_PRESCRIPTIONS) {
      const profileId = profileMap.get(rx.profileName)
      if (!profileId) continue

      // Insert Prescription
      const { data: insertedRx, error: rxError } = await supabase
        .from('prescriptions')
        .insert({
          profile_id: profileId,
          visit_date: rx.visit_date,
          hospital_name: rx.hospital_name,
          attending_doctor: rx.attending_doctor,
          diagnosis: rx.diagnosis,
          notes: rx.notes,
          file_url: 'https://images.unsplash.com/photo-1550505393-5c46f1a0911a?q=80&w=2070&auto=format&fit=crop', // Demo placeholder
          ai_confidence: 0.95,
        })
        .select('id')
        .single()

      if (rxError) throw rxError

      // Insert Medicines for this prescription
      const medicineInserts = rx.medicines.map((m) => ({
        ...m,
        prescription_id: insertedRx.id,
      }))

      const { error: medError } = await supabase.from('medicines').insert(medicineInserts)
      if (medError) throw medError
    }

    revalidatePath('/dashboard')
    return { success: true, message: 'Demo data seeded successfully!' }
  } catch (err: any) {
    console.error('Error seeding demo data:', err)
    return { success: false, message: err.message || 'Failed to seed demo data.' }
  }
}
