import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { 
  IconArrowLeft, 
  IconEdit, 
  IconDroplet, 
  IconCalendar, 
  IconAlertCircle,
  IconPrescription,
  IconKey,
  IconPlus
} from '@tabler/icons-react'
import { ProfilePrescriptions } from './profile-prescriptions'
import { ProfileAccessKeys } from './profile-access-keys'
import { DeleteProfileButton } from './delete-profile-button'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('family_profiles')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !profile) {
    notFound()
  }

  const age = new Date().getFullYear() - new Date(profile.dob).getFullYear()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/profiles">
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-muted-foreground">Profile Details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/profiles/${id}/edit`}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeleteProfileButton profileId={id} profileName={profile.name} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="text-2xl">
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-muted-foreground">{age} years old</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {profile.blood_group && (
                  <Badge variant="outline" className="gap-1">
                    <IconDroplet className="h-3 w-3" />
                    {profile.blood_group}
                  </Badge>
                )}
                <Badge variant="secondary" className="gap-1">
                  <IconCalendar className="h-3 w-3" />
                  {new Date(profile.dob).toLocaleDateString()}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {profile.allergies && profile.allergies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <IconAlertCircle className="h-4 w-4 text-orange-500" />
                    Allergies
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {profile.allergies.map((allergy: string, index: number) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.notes && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Medical Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {profile.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="prescriptions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prescriptions" className="gap-2">
                <IconPrescription className="h-4 w-4" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="access" className="gap-2">
                <IconKey className="h-4 w-4" />
                Access Keys
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prescriptions" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Prescriptions</CardTitle>
                    <CardDescription>Medical documents for this profile</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/prescriptions/upload?profile=${id}`}>
                      <IconPlus className="mr-2 h-4 w-4" />
                      Upload
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <ProfilePrescriptions profileId={id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Doctor Access Keys</CardTitle>
                    <CardDescription>Temporary access for healthcare providers</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/access?profile=${id}`}>
                      <IconPlus className="mr-2 h-4 w-4" />
                      Generate Key
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <ProfileAccessKeys profileId={id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
