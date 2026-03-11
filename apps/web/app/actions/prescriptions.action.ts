'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadPrescription(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const profileId = formData.get('profileId') as string
  const file = formData.get('file') as File

  if (!profileId || !file) {
    return { error: 'Profile ID and File are required' }
  }

  // 1. Upload to Supabase Storage
  // Make a unique filename to avoid collisions
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${profileId}/${Date.now()}.${fileExt}`

  const { data: storageData, error: storageError } = await supabase
    .storage
    .from('prescriptions')
    .upload(fileName, file)

  if (storageError) {
    console.error('Error uploading file:', storageError)
    return { error: 'Failed to upload document' }
  }

  // 2. Insert record into prescriptions table
  const { data: prescription, error: dbError } = await supabase
    .from('prescriptions')
    .insert({
      profile_id: profileId,
      file_url: storageData.path,
    })
    .select()
    .single()

  if (dbError) {
    console.error('Error saving prescription record:', dbError)
    return { error: 'Failed to create prescription record' }
  }

  // 3. Trigger AI Background Job (We will implement this next)
  // await triggerAI OCR(prescription.id, storageData.path)

  revalidatePath('/dashboard')
  revalidatePath(`/profiles/${profileId}`)

  return { data: prescription, error: null }
}

export async function deletePrescription(id: string) {
  const supabase = await createClient()
  
  // Soft delete
  const { error } = await supabase
    .from('prescriptions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { error: 'Failed to delete prescription' }
  }

  revalidatePath('/dashboard')
  return { error: null }
}
