'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

// type PrescriptionInsert = Database['public']['Tables']['prescriptions']['Insert']
// type PrescriptionUpdate = Database['public']['Tables']['prescriptions']['Update']
type PrescriptionUpdate = any

export async function uploadPrescription(profileId: string, formData: FormData) {
  const supabase = await createClient()

  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  // 1. Upload file to Supabase Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${profileId}/${Date.now()}.${fileExt}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('prescriptions')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (uploadError) {
    console.error('Error uploading file:', uploadError)
    throw new Error('Failed to upload prescription file')
  }

  // 2. Insert record into database
  const fileUrl = uploadData.path

  // NOTE: Stub AI OCR extraction here. 
  // Normally, we'd trigger a Bull queue job or call an external service and return the raw text.
  const { data: prescription, error: dbError } = await supabase
    .from('prescriptions')
    .insert({
      profile_id: profileId,
      file_url: fileUrl,
      // Default to null until AI processing updates these
      visit_date: null,
      hospital_name: null,
      attending_doctor: null,
      diagnosis: null,
      raw_text: "Extraction pending...", 
      ai_confidence: null,
    })
    .select()
    .single()

  if (dbError) {
    console.error('Error creating prescription record:', dbError)
    // Attempt to rollback file upload
    await supabase.storage.from('prescriptions').remove([fileUrl])
    throw new Error('Failed to create prescription record')
  }

  revalidatePath(`/profiles/${profileId}`)
  return prescription
}

export async function getPrescriptions(profileId: string) {
  const supabase = await createClient()

  const { data: prescriptions, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching prescriptions:', error)
    throw new Error('Failed to fetch prescriptions')
  }

  return prescriptions
}

export async function getPrescriptionById(id: string) {
  const supabase = await createClient()

  // Fetch prescription with associated medicines
  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .select('*, medicines(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    console.error('Error fetching prescription:', error)
    throw new Error('Failed to fetch prescription')
  }

  return prescription
}

export async function updatePrescription(id: string, data: Partial<PrescriptionUpdate>) {
  const supabase = await createClient()

  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .update(data)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single()

  if (error) {
    console.error('Error updating prescription:', error)
    throw new Error('Failed to update prescription')
  }

  revalidatePath(`/prescriptions/${id}`)
  return prescription
}

export async function deletePrescription(id: string) {
  const supabase = await createClient()
  
  // Soft delete
  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deleting prescription:', error)
    throw new Error('Failed to delete prescription')
  }

  return prescription
}

export async function getPrescriptionFileUrl(filePath: string) {
  const supabase = await createClient()
  
  // We can create a signed URL if we want time-limited access, 
  // or depending on RLS, a publicUrl if public text. 
  // Per SQL schema, 'prescriptions' bucket is private. 
  const { data, error } = await supabase.storage
    .from('prescriptions')
    .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

  if (error) {
    console.error('Error generating signed URL:', error)
    throw new Error('Failed to generate image URL')
  }

  return data.signedUrl
}
