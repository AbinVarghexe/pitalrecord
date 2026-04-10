'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { validatePrescriptionUpload } from '@/lib/validation/prescriptions'
import { triggerPrescriptionAIProcessing } from '@/lib/ai/prescription-pipeline'
import type { Database } from '@/lib/supabase/types'

export async function uploadPrescription(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const profileId = formData.get('profileId') as string
  const file = formData.get('file') as File

  if (!profileId) {
    return { error: 'Profile ID is required' }
  }

  const fileValidation = validatePrescriptionUpload(file)
  if (!fileValidation.ok) {
    return { error: fileValidation.error }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${profileId}/${Date.now()}.${fileExt}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('prescriptions')
    .upload(fileName, file)

  if (storageError) {
    console.error('Error uploading file:', storageError)
    return { error: 'Failed to upload document' }
  }

  const insertPayload: Database['public']['Tables']['prescriptions']['Insert'] = {
    profile_id: profileId,
    file_url: storageData.path,
    raw_text: 'Extraction pending...',
    extraction_status: 'processing',
  }

  const { data: prescription, error: dbError } = await supabase
    .from('prescriptions')
    .insert(insertPayload)
    .select()
    .single()

  if (dbError) {
    console.error('Error saving prescription record:', dbError)
    const { error: cleanupError } = await supabase.storage
      .from('prescriptions')
      .remove([storageData.path])
    if (cleanupError) {
      console.error('Failed to cleanup uploaded file after DB failure:', cleanupError)
    }
    return { error: 'Failed to create prescription record' }
  }

  triggerPrescriptionAIProcessing({
    prescriptionId: prescription.id,
    fileUrl: storageData.path,
  }).catch(async (error) => {
    console.error('AI processing trigger failed:', error)
    await supabase
      .from('prescriptions')
      .update({
        extraction_status: 'failed',
        extraction_data: {
          error: error instanceof Error ? error.message : String(error),
          context: 'triggerPrescriptionAIProcessing',
        },
      })
      .eq('id', prescription.id)
  })

  revalidatePath('/dashboard')
  revalidatePath(`/profiles/${profileId}`)

  return { data: prescription, error: null, extractionStatus: 'processing' as const }
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

export async function reviewPrescription(
  id: string,
  input: {
    visitDate?: string | null
    hospitalName?: string | null
    attendingDoctor?: string | null
    diagnosis?: string[] | null
    followUpDate?: string | null
    medicines?: Array<{
      name: string
      dosage?: string | null
      frequency?: string | null
      duration?: string | null
      instructions?: string | null
    }>
  }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: existingPrescription } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('id', id)
    .single()

  if (!existingPrescription) {
    return { error: 'Prescription not found' }
  }

  const { data: existingVersions } = await supabase
    .from('prescription_versions')
    .select('version_number')
    .eq('prescription_id', id)
    .order('version_number', { ascending: false })
    .limit(1)

  const nextVersion = (existingVersions?.[0]?.version_number ?? 0) + 1

  await supabase.from('prescription_versions').insert({
    prescription_id: id,
    version_number: nextVersion,
    changed_by: user.id,
    snapshot: existingPrescription,
  })

  const { error: updateError } = await supabase
    .from('prescriptions')
    .update({
      visit_date: input.visitDate || null,
      hospital_name: input.hospitalName || null,
      attending_doctor: input.attendingDoctor || null,
      diagnosis: input.diagnosis || [],
      follow_up_date: input.followUpDate || null,
      extraction_status: 'completed',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    console.error('Error reviewing prescription:', updateError)
    return { error: 'Failed to review prescription' }
  }

  if (input.medicines) {
    await supabase.from('medicines').delete().eq('prescription_id', id)
    const validMeds = input.medicines.filter((med) => med.name?.trim())
    if (validMeds.length > 0) {
      await supabase.from('medicines').insert(
        validMeds.map((med) => ({
          prescription_id: id,
          name: med.name.trim(),
          dosage: med.dosage || null,
          frequency: med.frequency || null,
          duration: med.duration || null,
          instructions: med.instructions || null,
        }))
      )
    }
  }

  revalidatePath(`/dashboard/prescriptions/${id}`)
  revalidatePath('/dashboard/prescriptions')
  revalidatePath('/dashboard/timeline')

  return { error: null }
}

export async function getPrescriptionVersions(prescriptionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('prescription_versions')
    .select('*')
    .eq('prescription_id', prescriptionId)
    .order('version_number', { ascending: false })

  if (error) {
    return { data: null, error: 'Failed to fetch versions' }
  }

  return { data, error: null }
}
