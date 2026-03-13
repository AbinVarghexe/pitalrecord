import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Badge } from '@workspace/ui/components/badge'
import { Separator } from '@workspace/ui/components/separator'
import { IconSettings, IconUser, IconShield, IconDownload, IconTrash, IconUsers, IconFiles, IconClock } from '@tabler/icons-react'
import { ThemeToggle } from './theme-toggle'
import { AccessLogsCard } from './access-logs-card'

export const metadata: Metadata = {
  title: 'Settings - PitalRecord',
  description: 'Manage your account settings',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { count: profileCount } = await supabase
    .from('family_profiles').select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: prescriptionCount } = await supabase
    .from('prescriptions')
    .select('*, family_profiles!inner(user_id)', { count: 'exact', head: true })
    .eq('family_profiles.user_id', user.id)

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0]
  const initials = user.email?.charAt(0).toUpperCase() ?? 'U'
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—'

  const accountStats = [
    { value: profileCount ?? 0, label: 'Family Profiles', icon: IconUsers },
    { value: prescriptionCount ?? 0, label: 'Prescriptions', icon: IconFiles },
    { value: memberSince, label: 'Member Since', icon: IconClock },
  ]

  return (
    <div className="p-8 md:p-12 space-y-10 max-w-5xl mx-auto">
      {/* ── Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">System</span>
        </div>
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight leading-none flex items-center gap-3">
          <IconSettings className="h-9 w-9 text-blue-600" />
          <span className="font-serif italic font-medium">Settings</span>
        </h1>
        <div className="w-12 h-0.5 rounded-full bg-blue-500 opacity-70" />
        <p className="text-[13px] font-medium text-slate-400">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Info */}
        <Card className="lg:col-span-2 bg-white border-slate-100 rounded-[2rem] shadow-sm">
          <CardHeader className="pb-3 px-7 pt-7">
            <div className="flex items-center gap-2 mb-1">
              <IconUser className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Account</span>
            </div>
            <p className="text-[12px] text-slate-400 font-medium">Your account information and statistics</p>
          </CardHeader>
          <CardContent className="px-7 pb-7 space-y-6">
            {/* User summary */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-2xl">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="rounded-2xl bg-blue-50 text-blue-600 text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">{displayName}</h3>
                <p className="text-[12px] text-slate-400 font-medium">{user.email}</p>
                <Badge variant="secondary" className="mt-1.5 rounded-full text-[10px] font-bold">
                  {user.app_metadata?.provider || 'Email'} Account
                </Badge>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {accountStats.map((stat, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                  <stat.icon className="h-4 w-4 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-white border-slate-100 rounded-[2rem] shadow-sm">
          <CardHeader className="px-7 pt-7 pb-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Appearance</div>
            <p className="text-[12px] text-slate-400 font-medium">Customize how PitalRecord looks</p>
          </CardHeader>
          <CardContent className="px-7 pb-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-slate-900">Theme</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Light or dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Access Logs */}
        <div className="lg:col-span-2">
          <AccessLogsCard />
        </div>

        {/* Security & Data */}
        <Card className="bg-white border-slate-100 rounded-[2rem] shadow-sm">
          <CardHeader className="px-7 pt-7 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <IconShield className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Security & Data</span>
            </div>
            <p className="text-[12px] text-slate-400 font-medium">Manage your security and data</p>
          </CardHeader>
          <CardContent className="px-7 pb-7 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <IconDownload className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="font-semibold text-sm text-slate-900">Export Data</p>
                  <p className="text-[11px] text-slate-400 font-medium">Download all your records</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-xl text-[11px] font-bold" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <IconTrash className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-semibold text-sm text-red-700">Delete Account</p>
                  <p className="text-[11px] text-red-500/80 font-medium">Permanently delete all data</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="w-full rounded-xl text-[11px] font-bold" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
