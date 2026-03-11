import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Badge } from '@workspace/ui/components/badge'
import { Separator } from '@workspace/ui/components/separator'
import { IconSettings, IconUser, IconShield, IconBell, IconPalette, IconDownload, IconTrash } from '@tabler/icons-react'
import { ThemeToggle } from './theme-toggle'
import { AccessLogsCard } from './access-logs-card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Settings - PitalRecord',
  description: 'Manage your account settings',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user stats
  const { count: profileCount } = await supabase
    .from('family_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: prescriptionCount } = await supabase
    .from('prescriptions')
    .select('*, family_profiles!inner(user_id)', { count: 'exact', head: true })
    .eq('family_profiles.user_id', user.id)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <IconSettings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>Your account information and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {user.app_metadata?.provider || 'Email'} Account
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">{profileCount || 0}</div>
                <div className="text-sm text-muted-foreground">Family Profiles</div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">{prescriptionCount || 0}</div>
                <div className="text-sm text-muted-foreground">Prescriptions</div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold">
                  {user.created_at 
                    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : '-'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Member Since</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPalette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how PitalRecord looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">
                    Choose light or dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Access Logs */}
        <div className="lg:col-span-2">
          <AccessLogsCard />
        </div>

        {/* Security & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShield className="h-5 w-5" />
              Security & Data
            </CardTitle>
            <CardDescription>Manage your security and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-2">
                <IconDownload className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-muted-foreground">
                    Download all your records
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50 p-4">
              <div className="flex items-center gap-3 mb-2">
                <IconTrash className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">Delete Account</p>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80">
                    Permanently delete all data
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
