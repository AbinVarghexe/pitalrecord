import { createClient } from '@/lib/supabase/server'
import { Badge } from '@workspace/ui/components/badge'
import { IconKey, IconClock } from '@tabler/icons-react'
import { RevokeKeyButton } from './revoke-key-button'
import type { DoctorAccessKey } from '@/lib/supabase/types'

interface ProfileAccessKeysProps {
  profileId: string
}

export async function ProfileAccessKeys({ profileId }: ProfileAccessKeysProps) {
  const supabase = await createClient()
  
  const { data: keys, error } = await supabase
    .from('doctor_access_keys')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load access keys
      </div>
    )
  }

  if (!keys || keys.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No access keys generated yet
      </div>
    )
  }

  const now = new Date()

  return (
    <div className="space-y-2">
      {keys.map((key: DoctorAccessKey) => {
        const expiresAt = new Date(key.expires_at)
        const isExpired = expiresAt < now
        const isRevoked = key.revoked
        const isActive = !isExpired && !isRevoked

        return (
          <div
            key={key.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded flex items-center justify-center ${
                isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
              }`}>
                <IconKey className={`h-5 w-5 ${
                  isActive ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {key.scope === 'read_write' ? 'Read & Write' : 'Read Only'}
                  </p>
                  {isActive && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                  {isRevoked && (
                    <Badge variant="secondary" className="text-xs">Revoked</Badge>
                  )}
                  {isExpired && !isRevoked && (
                    <Badge variant="outline" className="text-xs">Expired</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconClock className="h-3 w-3" />
                  {isActive 
                    ? `Expires ${expiresAt.toLocaleString()}`
                    : isRevoked 
                      ? `Revoked ${key.revoked_at ? new Date(key.revoked_at).toLocaleString() : ''}`
                      : `Expired ${expiresAt.toLocaleString()}`
                  }
                </p>
              </div>
            </div>
            {isActive && <RevokeKeyButton keyId={key.id} />}
          </div>
        )
      })}
    </div>
  )
}
