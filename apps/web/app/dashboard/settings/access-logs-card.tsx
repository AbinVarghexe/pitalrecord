import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { IconHistory, IconEye, IconLogin, IconLogout, IconKey } from '@tabler/icons-react'

export async function AccessLogsCard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get profile IDs for this user
  const { data: profiles } = await supabase
    .from('family_profiles')
    .select('id')
    .eq('user_id', user.id)

  if (!profiles || profiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconHistory className="h-5 w-5" />
            Recent Access Logs
          </CardTitle>
          <CardDescription>Recent access to your records by doctors</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No access logs yet
          </p>
        </CardContent>
      </Card>
    )
  }

  const profileIds = profiles.map(p => p.id)

  // Get recent access logs for keys associated with user's profiles
  const { data: logs } = await supabase
    .from('access_logs')
    .select(`
      *,
      doctor_access_keys!inner(
        id,
        scope,
        profile_id,
        family_profiles(name)
      )
    `)
    .in('doctor_access_keys.profile_id', profileIds)
    .order('created_at', { ascending: false })
    .limit(10)

  const actionIcons: Record<string, typeof IconEye> = {
    session_started: IconLogin,
    viewed_profile: IconEye,
    session_ended: IconLogout,
  }

  const actionLabels: Record<string, string> = {
    session_started: 'Session Started',
    viewed_profile: 'Viewed Profile',
    session_ended: 'Session Ended',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconHistory className="h-5 w-5" />
          Recent Access Logs
        </CardTitle>
        <CardDescription>Recent access to your records by doctors</CardDescription>
      </CardHeader>
      <CardContent>
        {!logs || logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No access logs yet
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const Icon = actionIcons[log.action] || IconKey
              const profile = log.doctor_access_keys?.family_profiles

              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {actionLabels[log.action] || log.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.name || 'Unknown Profile'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {log.doctor_access_keys?.scope === 'read_write' ? 'R/W' : 'Read'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
