import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { IconKey, IconClock } from '@tabler/icons-react'
import { RevokeKeyButton } from './revoke-key-button'
import type { DoctorAccessKey, FamilyProfile } from '@/lib/supabase/types'

interface ActiveAccessKeysProps {
  profiles: FamilyProfile[]
}

export async function ActiveAccessKeys({ profiles }: ActiveAccessKeysProps) {
  const supabase = await createClient()
  
  const { data: keys, error } = await supabase
    .from('doctor_access_keys')
    .select('*')
    .eq('revoked', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    return null
  }

  if (!keys || keys.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Access Keys</CardTitle>
          <CardDescription>Currently active doctor access sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No active access keys
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Access Keys</CardTitle>
        <CardDescription>Currently active doctor access sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {keys.map((key: DoctorAccessKey) => {
            const profile = profiles.find(p => p.id === key.profile_id)
            const expiresAt = new Date(key.expires_at)
            const now = new Date()
            const minutesRemaining = Math.round((expiresAt.getTime() - now.getTime()) / 60000)

            return (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <IconKey className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{profile?.name || 'Unknown Profile'}</p>
                      <Badge variant="default">Active</Badge>
                      <Badge variant={key.scope === 'read_write' ? 'secondary' : 'outline'}>
                        {key.scope === 'read_write' ? 'Read & Write' : 'Read Only'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <IconClock className="h-3 w-3" />
                      {minutesRemaining > 0 
                        ? `Expires in ${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'}`
                        : 'Expiring soon'
                      }
                    </p>
                  </div>
                </div>
                <RevokeKeyButton keyId={key.id} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
