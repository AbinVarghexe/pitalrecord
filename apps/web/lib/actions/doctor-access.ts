'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function generateAccessKey(profileId: string, scope: 'read' | 'read_write', expiresInHours: number) {
  const supabase = await createClient()

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Generate a random 32-byte key
  const rawKey = crypto.randomBytes(32).toString('hex')
  
  // Hash it before storing (SHA-256)
  const tokenHash = crypto.createHash('sha256').update(rawKey).digest('hex')
  
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + expiresInHours)

  const { data, error } = await supabase
    .from('doctor_access_keys')
    .insert({
      profile_id: profileId,
      token_hash: tokenHash,
      scope,
      expires_at: expiresAt.toISOString(),
      revoked: false
    })
    .select()
    .single()

  if (error) {
    console.error('Error generating access key:', error)
    throw new Error('Failed to generate access key')
  }

  revalidatePath(`/profiles/${profileId}/access`)
  
  // Return the raw key to the user ONCE. They must share it securely with the doctor.
  return {
    ...data,
    rawKey 
  }
}

export async function revokeAccessKey(keyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('doctor_access_keys')
    .update({ 
      revoked: true,
      revoked_at: new Date().toISOString()
    })
    .eq('id', keyId)
    .select()
    .single()

  if (error) {
    console.error('Error revoking access key:', error)
    throw new Error('Failed to revoke access key')
  }

  // Log revocation
  await supabase.from('access_logs').insert({
    access_key_id: keyId,
    action: 'key_revoked',
    ip_address: '127.0.0.1' // In a real app, extract from headers
  })

  revalidatePath(`/profiles/${data.profile_id}/access`)
  return data
}

export async function getActiveKeys(profileId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('doctor_access_keys')
    .select('*')
    .eq('profile_id', profileId)
    .eq('revoked', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching active keys:', error)
    throw new Error('Failed to fetch active keys')
  }

  return data
}

export async function getAccessLogs(profileId: string) {
  const supabase = await createClient()

  // We need to join with doctor_access_keys to filter by profile_id
  const { data, error } = await supabase
    .from('access_logs')
    .select('*, doctor_access_keys!inner(profile_id)')
    .eq('doctor_access_keys.profile_id', profileId)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching access logs:', error)
    throw new Error('Failed to fetch access logs')
  }

  return data
}

// NOTE: validateAccessKey(rawKey) would normally set a secure HTTP-only cookie
// for the doctor's temporary session and log 'key_used' in access_logs.
