import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { Badge } from '@workspace/ui/components/badge'
import { IconPlus, IconUser, IconDroplet, IconAlertCircle, IconArrowRight } from '@tabler/icons-react'
import type { FamilyProfile } from '@/lib/supabase/types'

export default async function ProfilesPage() {
  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from('family_profiles').select('*')
    .is('deleted_at', null).order('created_at', { ascending: false })

  if (error) console.error('Error fetching profiles:', error)

  return (
    <div className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto">
      {/* ── Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">Registry</span>
          </div>
          <h1 className="text-4xl font-semibold text-slate-900 tracking-tight leading-none">
            Family <span className="font-serif italic font-medium">Profiles</span>
          </h1>
          <div className="w-12 h-0.5 rounded-full bg-blue-500 opacity-70" />
          <p className="text-[13px] font-medium text-slate-400 leading-relaxed">
            Manage profiles for yourself and your family members.
          </p>
        </div>
        <Button asChild className="rounded-2xl bg-black hover:bg-zinc-900 text-white font-semibold shadow-lg shrink-0">
          <Link href="/dashboard/profiles/new">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Profile
          </Link>
        </Button>
      </div>

      {/* ── Content */}
      {(!profiles || profiles.length === 0) ? (
        <Card className="border-dashed border-slate-200 bg-white/60 rounded-[2rem]">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-5">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
              <IconUser className="h-9 w-9 text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-slate-900 mb-1">No profiles yet</h3>
              <p className="text-[12px] text-slate-400 font-medium max-w-xs">
                Create your first family profile to start managing medical records.
              </p>
            </div>
            <Button asChild className="rounded-full px-10 h-11 bg-black hover:bg-zinc-900 text-white font-semibold shadow-lg">
              <Link href="/dashboard/profiles/new">
                <IconPlus className="mr-2 h-4 w-4" />
                Create First Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile: FamilyProfile) => (
            <Link key={profile.id} href={`/dashboard/profiles/${profile.id}`} className="group">
              <Card className="bg-white border-slate-100 rounded-[2rem] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full">
                <CardHeader className="pb-3 pt-6 px-7">
                  <div className="flex items-start justify-between mb-3">
                    <Avatar className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100">
                      <AvatarFallback className="rounded-2xl text-base font-semibold text-blue-600 bg-blue-50">
                        {profile.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {profile.blood_group && (
                      <Badge variant="outline" className="gap-1 rounded-full border-red-200 text-red-600 bg-red-50 text-[10px] font-bold">
                        <IconDroplet className="h-3 w-3" />
                        {profile.blood_group}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{profile.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                    Born {new Date(profile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </CardHeader>
                <CardContent className="pb-6 px-7">
                  {profile.allergies && profile.allergies.length > 0 && (
                    <div className="flex items-start gap-2 text-[11px] text-orange-600 font-medium mb-2">
                      <IconAlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>
                        Allergies: {profile.allergies.slice(0, 3).join(', ')}
                        {profile.allergies.length > 3 && ` +${profile.allergies.length - 3} more`}
                      </span>
                    </div>
                  )}
                  {profile.notes && (
                    <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed">{profile.notes}</p>
                  )}
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                    View Profile <IconArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
