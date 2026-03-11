'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { updateProfile, getProfile } from '@/app/actions/profiles.action'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react'
import type { FamilyProfile } from '@/lib/supabase/types'
import { use } from 'react'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProfilePage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<FamilyProfile | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const result = await getProfile(id)
      if (result.data) {
        setProfile(result.data)
      } else {
        setError(result.error || 'Profile not found')
      }
      setIsLoadingProfile(false)
    }
    loadProfile()
  }, [id])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    const result = await updateProfile(id, formData)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/profiles/${id}`)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground mb-4">{error || 'The requested profile could not be found.'}</p>
        <Button asChild>
          <Link href="/dashboard/profiles">Back to Profiles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/profiles/${id}`}>
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update information for {profile.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update the profile details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                required
                disabled={isLoading}
                defaultValue={profile.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                required
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
                defaultValue={profile.dob}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select name="bloodGroup" disabled={isLoading} defaultValue={profile.blood_group || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                name="allergies"
                placeholder="Enter allergies separated by commas (e.g., Penicillin, Peanuts)"
                disabled={isLoading}
                defaultValue={profile.allergies?.join(', ') || ''}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple allergies with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Medical Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any chronic conditions, ongoing medications, or other important medical notes..."
                rows={4}
                disabled={isLoading}
                defaultValue={profile.notes || ''}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" asChild disabled={isLoading}>
                <Link href={`/dashboard/profiles/${id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
