import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { Badge } from '@workspace/ui/components/badge'
import { IconPlus, IconUser, IconDroplet, IconAlertCircle } from '@tabler/icons-react'
import type { FamilyProfile } from '@/lib/supabase/types'

export default async function ProfilesPage() {
  const supabase = await createClient()
  
  const { data: profiles, error } = await supabase
    .from('family_profiles')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching profiles:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Profiles</h1>
          <p className="text-muted-foreground">
            Manage profiles for yourself and your family members.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/profiles/new">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Profile
          </Link>
        </Button>
      </div>

      {(!profiles || profiles.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <IconUser className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No profiles yet</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-sm">
              Create your first family profile to start managing medical records.
            </p>
            <Button asChild>
              <Link href="/dashboard/profiles/new">
                <IconPlus className="mr-2 h-4 w-4" />
                Create First Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile: FamilyProfile) => (
            <Link key={profile.id} href={`/dashboard/profiles/${profile.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg">
                        {profile.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {profile.blood_group && (
                      <Badge variant="outline" className="gap-1">
                        <IconDroplet className="h-3 w-3" />
                        {profile.blood_group}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-3">{profile.name}</CardTitle>
                  <CardDescription>
                    Born {new Date(profile.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.allergies && profile.allergies.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <IconAlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>
                        Allergies: {profile.allergies.slice(0, 3).join(', ')}
                        {profile.allergies.length > 3 && ` +${profile.allergies.length - 3} more`}
                      </span>
                    </div>
                  )}
                  {profile.notes && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {profile.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
