import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import {
  IconPill,
  IconCalendar,
  IconClock,
  IconAlertCircle,
  IconShieldCheck,
  IconFileText,
} from '@tabler/icons-react'
import type { Prescription, Medicine } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Patient Records - Doctor Access',
  description: 'Viewing patient records via temporary access',
}

interface PageProps {
  params: Promise<{ sessionId: string }>
}

export default async function DoctorSessionPage({ params }: PageProps) {
  const { sessionId } = await params
  const supabase = await createClient()

  const { data: accessKey, error: keyError } = await supabase
    .from('doctor_access_keys')
    .select('*')
    .eq('id', sessionId)
    .eq('revoked', false)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (keyError || !accessKey) {
    redirect('/doctor-access?error=invalid_session')
  }

  const { data: profile, error: profileError } = await supabase
    .from('family_profiles')
    .select('*')
    .eq('id', accessKey.profile_id)
    .is('deleted_at', null)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  const { data: prescriptions } = await supabase
    .from('prescriptions')
    .select('*, medicines(*)')
    .eq('profile_id', profile.id)
    .is('deleted_at', null)
    .order('visit_date', { ascending: false })

  await supabase.from('access_logs').insert({
    access_key_id: accessKey.id,
    action: 'records_viewed',
    ip_address: '127.0.0.1',
    user_agent: 'doctor-access-session',
  })

  const expiresAt = new Date(accessKey.expires_at)
  const now = new Date()
  const minutesRemaining = Math.max(
    0,
    Math.round((expiresAt.getTime() - now.getTime()) / 60000)
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Doctor Access Session</span>
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground"
            >
              {accessKey.scope === 'read_write' ? 'Read & Write' : 'Read Only'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconClock className="h-4 w-4" />
            <span>
              {minutesRemaining > 0
                ? `${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'} remaining`
                : 'Session expiring soon'}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {profile.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {profile.dob
                      ? `${calculateAge(profile.dob)} years old`
                      : 'Age not specified'}
                    {profile.blood_group && ` • Blood Group: ${profile.blood_group}`}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          {profile.allergies?.length > 0 && (
            <CardContent className="pt-0">
              <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50 p-3">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
                  <IconAlertCircle className="h-4 w-4" />
                  Allergies
                </div>
                <div className="flex flex-wrap gap-1">
                  {profile.allergies.map((allergy: string) => (
                    <Badge
                      key={allergy}
                      variant="outline"
                      className="border-red-300 text-red-700 dark:border-red-800 dark:text-red-400"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Prescriptions
            </CardTitle>
            <CardDescription>
              Medical history and prescriptions for this patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!prescriptions || prescriptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No prescriptions on record
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map(
                  (prescription: Prescription & { medicines: Medicine[] }) => (
                    <div key={prescription.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">
                            {prescription.attending_doctor || 'Unknown Doctor'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {prescription.hospital_name || 'Unknown Hospital'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <IconCalendar className="h-3 w-3" />
                            {prescription.visit_date
                              ? new Date(prescription.visit_date).toLocaleDateString()
                              : 'Date not specified'}
                          </div>
                        </div>
                      </div>

                      {prescription.diagnosis && (
                        <div className="mb-3">
                          <span className="text-sm font-medium">Diagnosis: </span>
                          <span className="text-sm text-muted-foreground">
                            {prescription.diagnosis.join(', ')}
                          </span>
                        </div>
                      )}

                      {prescription.medicines && prescription.medicines.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium mb-2 block">
                            Medications:
                          </span>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {prescription.medicines.map((medicine: Medicine) => (
                              <div
                                key={medicine.id}
                                className="rounded bg-muted/50 p-2 text-sm"
                              >
                                <div className="font-medium flex items-center gap-1">
                                  <IconPill className="h-3 w-3" />
                                  {medicine.name}
                                </div>
                                <div className="text-muted-foreground">
                                  {medicine.dosage && `${medicine.dosage} • `}
                                  {medicine.frequency && `${medicine.frequency}`}
                                  {medicine.duration && ` • ${medicine.duration}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    age--
  }
  return age
}
