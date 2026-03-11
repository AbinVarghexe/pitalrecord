'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Creates a SHA-256 hash of a string
 * Polyfill for edge environments where crypto might not be globally available in the same way
 */
async function hashToken(token: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateDoctorAccessKey(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized', key: null }
  }

  const profileId = formData.get('profileId') as string
  const scope = formData.get('scope') as 'read' | 'read_write'
  const durationHours = parseInt(formData.get('duration') as string || '1', 10)

  if (!profileId || !scope || isNaN(durationHours)) {
    return { error: 'Missing required fields', key: null }
  }

  // Generate a random access key
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const rawKey = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Hash it for storage
  const tokenHash = await hashToken(rawKey);

  // Calculate expiration
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + durationHours);

  // Store the hashed key
  const { error } = await supabase
    .from('doctor_access_keys')
    .insert({
      profile_id: profileId,
      token_hash: tokenHash,
      scope: scope,
      expires_at: expiresAt.toISOString(),
      revoked: false
    });

  if (error) {
    console.error('Error generating access key:', error)
    return { error: 'Failed to generate access key', key: null }
  }

  // Revalidate the page so the user can see their new active key
  revalidatePath('/dashboard/access')

  // Return the RAW key to the user (this is the ONLY time they will see it!)
  return { error: null, key: rawKey }
}

export async function revokeDoctorAccessKey(keyId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('doctor_access_keys')
    .update({
      revoked: true,
      revoked_at: new Date().toISOString()
    })
    .eq('id', keyId)

  if (error) {
    return { error: 'Failed to revoke key' }
  }

  revalidatePath('/dashboard/access')
  return { error: null }
}

export async function validateDoctorAccessKey(rawKey: string) {
  const supabase = await createClient()
  
  if (!rawKey || rawKey.length < 32) {
    return { error: 'Invalid access key format', sessionId: null }
  }

  // Hash the provided key
  const tokenHash = await hashToken(rawKey)

  // Look for matching, valid key
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

  // Log the access
  await supabase.from('access_logs').insert({
    key_id: key.id,
    action: 'session_started',
    ip_address: null, // Would need to get from request in middleware
    user_agent: null
  })

  // Return the key ID as the session identifier
  return { error: null, sessionId: key.id }
}
