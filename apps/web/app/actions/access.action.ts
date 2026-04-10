'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  ALLOWED_ACCESS_DURATIONS,
  generateRawAccessKey,
  hashAccessKey,
  isAllowedAccessDuration,
  resolveAccessExpiry,
} from '@/lib/security/doctor-access'

export async function generateDoctorAccessKey(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized', key: null }
  }

  const profileId = formData.get('profileId') as string
  const scope = formData.get('scope') as 'read' | 'read_write'
  const rawDuration = formData.get('duration')
  if (rawDuration === null) {
    return { error: 'Missing required fields', key: null }
  }
  const durationHours = Number(rawDuration)

  if (!profileId || !scope || Number.isNaN(durationHours)) {
    return { error: 'Missing required fields', key: null }
  }

  if (!['read', 'read_write'].includes(scope)) {
    return { error: 'Invalid access scope', key: null }
  }

  if (!isAllowedAccessDuration(durationHours)) {
    const formattedDurations = ALLOWED_ACCESS_DURATIONS.map((duration) =>
      duration < 1 ? `${duration * 60} minutes` : `${duration} hour${duration > 1 ? 's' : ''}`
    ).join(', ')
    return {
      error: `Duration must be one of: ${formattedDurations}`,
      key: null,
    }
  }

  const rawKey = generateRawAccessKey()
  const tokenHash = hashAccessKey(rawKey)
  const expiresAt = resolveAccessExpiry(durationHours)

  const { error } = await supabase.from('doctor_access_keys').insert({
    profile_id: profileId,
    token_hash: tokenHash,
    scope,
    expires_at: expiresAt,
    revoked: false,
  })

  if (error) {
    console.error('Error generating access key:', error)
    return { error: 'Failed to generate access key', key: null }
  }

  revalidatePath('/dashboard/access')
  return { error: null, key: rawKey }
}

export async function revokeDoctorAccessKey(keyId: string) {
  const supabase = await createClient()

  const { data: key } = await supabase
    .from('doctor_access_keys')
    .select('profile_id')
    .eq('id', keyId)
    .single()

  const { error } = await supabase
    .from('doctor_access_keys')
    .update({
      revoked: true,
      revoked_at: new Date().toISOString(),
    })
    .eq('id', keyId)

  if (error) {
    return { error: 'Failed to revoke key' }
  }

  await supabase.from('access_logs').insert({
    access_key_id: keyId,
    action: 'key_revoked',
    ip_address: '127.0.0.1',
    user_agent: 'patient-dashboard',
  })

  revalidatePath('/dashboard/access')
  if (key?.profile_id) {
    revalidatePath(`/dashboard/profiles/${key.profile_id}`)
  }
  return { error: null }
}

export async function validateDoctorAccessKey(rawKey: string) {
  const supabase = await createClient()

  if (!rawKey || rawKey.length < 32) {
    return { error: 'Invalid access key format', sessionId: null }
  }

  const tokenHash = hashAccessKey(rawKey)

  const { data: key, error } = await supabase
    .from('doctor_access_keys')
    .select('*')
    .eq('token_hash', tokenHash)
    .eq('revoked', false)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (error || !key) {
    return { error: 'Invalid or expired access key', sessionId: null }
  }

  await supabase.from('access_logs').insert({
    access_key_id: key.id,
    action: 'key_used',
    ip_address: '127.0.0.1',
    user_agent: 'doctor-access-portal',
  })

  return { error: null, sessionId: key.id }
}
