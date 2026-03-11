import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { IconTimeline, IconSearch, IconCalendar, IconPill, IconUser, IconStethoscope, IconFileText } from '@tabler/icons-react'
import Link from 'next/link'
import { TimelineSearch } from './timeline-search'
import type { Prescription, Medicine, FamilyProfile } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Medical Timeline - PitalRecord',
  description: 'View and search your medical history',
}

interface SearchParams {
  q?: string
  profile?: string
  from?: string
  to?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function TimelinePage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get all profiles
  const { data: profiles } = await supabase
    .from('family_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  // Build prescription query
  let query = supabase
    .from('prescriptions')
    .select('*, medicines(*), family_profiles!inner(id, name, user_id)')
    .eq('family_profiles.user_id', user.id)
    .order('visit_date', { ascending: false })

  // Apply filters
  if (params.profile) {
    query = query.eq('profile_id', params.profile)
  }
  if (params.from) {
    query = query.gte('visit_date', params.from)
  }
  if (params.to) {
    query = query.lte('visit_date', params.to)
  }
  if (params.q) {
    // Search in doctor name, hospital name, diagnosis, and notes
    query = query.or(`attending_doctor.ilike.%${params.q}%,hospital_name.ilike.%${params.q}%,diagnosis.ilike.%${params.q}%,raw_text.ilike.%${params.q}%`)
  }

  const { data: prescriptions } = await query

  // Group prescriptions by year and month for timeline view
  const groupedPrescriptions = groupByDate(prescriptions || [])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <IconTimeline className="h-8 w-8" />
          Medical Timeline
        </h1>
        <p className="text-muted-foreground mt-1">
          View and search through your medical history
        </p>
      </div>

      {/* Search & Filter */}
      <TimelineSearch profiles={profiles || []} searchParams={params} />

      {/* Results Summary */}
      {(params.q || params.profile || params.from || params.to) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconSearch className="h-4 w-4" />
          Found {prescriptions?.length || 0} records
          {params.q && <Badge variant="secondary">Search: {params.q}</Badge>}
          {params.profile && profiles && (
            <Badge variant="secondary">
              Profile: {profiles.find(p => p.id === params.profile)?.name}
            </Badge>
          )}
        </div>
      )}

      {/* Timeline */}
      {!prescriptions || prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <IconFileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No Records Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {params.q || params.profile 
                ? 'Try adjusting your search criteria'
                : 'Start by uploading your first prescription'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedPrescriptions).map(([yearMonth, items]) => (
            <div key={yearMonth}>
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <IconCalendar className="h-5 w-5 text-muted-foreground" />
                  {yearMonth}
                </h2>
              </div>
              <div className="relative pl-8 border-l-2 border-muted space-y-6">
                {items.map((prescription: Prescription & { medicines: Medicine[], family_profiles: FamilyProfile }) => (
                  <div key={prescription.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {prescription.family_profiles.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{prescription.family_profiles.name}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <IconStethoscope className="h-3 w-3" />
                                {prescription.attending_doctor || 'Unknown Doctor'}
                                {prescription.hospital_name && ` • ${prescription.hospital_name}`}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {prescription.visit_date 
                              ? new Date(prescription.visit_date).toLocaleDateString()
                              : 'No date'
                            }
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {prescription.diagnosis && (
                          <p className="text-sm mb-3">
                            <span className="font-medium">Diagnosis:</span>{' '}
                            {prescription.diagnosis}
                          </p>
                        )}

                        {prescription.medicines && prescription.medicines.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {prescription.medicines.slice(0, 4).map((medicine: Medicine) => (
                              <Badge key={medicine.id} variant="outline" className="font-normal">
                                <IconPill className="h-3 w-3 mr-1" />
                                {medicine.name}
                              </Badge>
                            ))}
                            {prescription.medicines.length > 4 && (
                              <Badge variant="secondary">
                                +{prescription.medicines.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <Link
                          href={`/dashboard/prescriptions/${prescription.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View details →
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function groupByDate(prescriptions: (Prescription & { medicines: Medicine[], family_profiles: FamilyProfile })[]): Record<string, (Prescription & { medicines: Medicine[], family_profiles: FamilyProfile })[]> {
  const grouped: Record<string, (Prescription & { medicines: Medicine[], family_profiles: FamilyProfile })[]> = {}
  
  for (const prescription of prescriptions) {
    const date = prescription.visit_date ? new Date(prescription.visit_date) : new Date(prescription.created_at)
    const yearMonth = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    
    if (!grouped[yearMonth]) {
      grouped[yearMonth] = []
    }
    grouped[yearMonth].push(prescription)
  }
  
  return grouped
}
