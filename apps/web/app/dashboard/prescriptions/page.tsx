import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { IconPlus, IconPrescription, IconArrowRight, IconCalendar, IconBuilding } from '@tabler/icons-react'
import type { Prescription, FamilyProfile } from '@/lib/supabase/types'

export default async function PrescriptionsPage() {
  const supabase = await createClient()
  
  // Fetch all prescriptions with profile info
  const { data: prescriptions, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      family_profiles (
        id,
        name
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // Fetch profiles for the filter
  const { data: profiles } = await supabase
    .from('family_profiles')
    .select('id, name')
    .is('deleted_at', null)

  if (error) {
    console.error('Error fetching prescriptions:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">
            View and manage all uploaded medical prescriptions.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/prescriptions/upload">
            <IconPlus className="mr-2 h-4 w-4" />
            Upload Prescription
          </Link>
        </Button>
      </div>

      {(!prescriptions || prescriptions.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <IconPrescription className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No prescriptions yet</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-sm">
              Upload your first prescription to start building your medical history.
            </p>
            {profiles && profiles.length > 0 ? (
              <Button asChild>
                <Link href="/dashboard/prescriptions/upload">
                  <IconPlus className="mr-2 h-4 w-4" />
                  Upload First Prescription
                </Link>
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  You need to create a profile first.
                </p>
                <Button asChild variant="outline">
                  <Link href="/dashboard/profiles/new">Create Profile</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription: Prescription & { family_profiles: Pick<FamilyProfile, 'id' | 'name'> }) => (
            <Link 
              key={prescription.id} 
              href={`/dashboard/prescriptions/${prescription.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <IconPrescription className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {prescription.hospital_name || 'Prescription'}
                        </h3>
                        <Badge variant="secondary" className="shrink-0">
                          {prescription.family_profiles?.name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="h-3.5 w-3.5" />
                          {prescription.visit_date 
                            ? new Date(prescription.visit_date).toLocaleDateString()
                            : new Date(prescription.created_at).toLocaleDateString()}
                        </span>
                        {prescription.attending_doctor && (
                          <span className="truncate">
                            Dr. {prescription.attending_doctor}
                          </span>
                        )}
                      </div>
                      {prescription.diagnosis && prescription.diagnosis.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {prescription.diagnosis.slice(0, 3).map((diagnosis, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {diagnosis}
                            </Badge>
                          ))}
                          {prescription.diagnosis.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{prescription.diagnosis.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {prescription.ai_confidence !== null && (
                        <Badge 
                          variant={prescription.ai_confidence > 0.8 ? 'default' : prescription.ai_confidence > 0.5 ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {Math.round(prescription.ai_confidence * 100)}% AI
                        </Badge>
                      )}
                      <IconArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
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
