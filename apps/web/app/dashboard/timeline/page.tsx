import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { IconTimeline, IconSearch, IconCalendar, IconPill, IconStethoscope, IconFileText } from '@tabler/icons-react'
import Link from 'next/link'
import { TimelineSearch } from './timeline-search'
import type { Prescription, Medicine, FamilyProfile } from '@/lib/supabase/types'

function matchesSearchTerm(value: string | null | undefined, query: string) {
  return (value || '').toLowerCase().includes(query.toLowerCase())
}

export const metadata: Metadata = {
  title: 'Medical Timeline - PitalRecord',
  description: 'View and search your medical history',
}

interface SearchParams { q?: string; profile?: string; from?: string; to?: string }
interface PageProps { searchParams: Promise<SearchParams> }

export default async function TimelinePage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profiles } = await supabase
    .from('family_profiles').select('*').eq('user_id', user.id).order('name')

  let query = supabase
    .from('prescriptions')
    .select('*, medicines(*), family_profiles!inner(id, name, user_id)')
    .eq('family_profiles.user_id', user.id)
    .order('visit_date', { ascending: false })

  if (params.profile) query = query.eq('profile_id', params.profile)
  if (params.from)    query = query.gte('visit_date', params.from)
  if (params.to)      query = query.lte('visit_date', params.to)
  if (params.q) {
    query = query.or(
      `attending_doctor.ilike.%${params.q}%,hospital_name.ilike.%${params.q}%,raw_text.ilike.%${params.q}%`
    )
  }
  const { data: prescriptions } = await query
  const filteredPrescriptions =
    params.q && prescriptions
      ? prescriptions.filter((prescription) => {
          const normalizedQuery = params.q!.toLowerCase()
          const attendingDoctorMatch = matchesSearchTerm(prescription.attending_doctor, normalizedQuery)
          const hospitalMatch = matchesSearchTerm(prescription.hospital_name, normalizedQuery)
          const rawTextMatch = matchesSearchTerm(prescription.raw_text, normalizedQuery)
          const diagnosisMatch = (prescription.diagnosis || []).some((d: string) =>
            d.toLowerCase().includes(normalizedQuery)
          )
          const medicineMatch = (prescription.medicines || []).some((m: Medicine) =>
            m.name.toLowerCase().includes(normalizedQuery)
          )
          return (
            attendingDoctorMatch ||
            hospitalMatch ||
            rawTextMatch ||
            diagnosisMatch ||
            medicineMatch
          )
        })
      : prescriptions
  const grouped = groupByDate(filteredPrescriptions || [])

  return (
    <div className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto">
      {/* ── Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">History</span>
        </div>
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight leading-none flex items-center gap-3">
          <IconTimeline className="h-9 w-9 text-blue-600" />
          Medical <span className="font-serif italic font-medium ml-2">Timeline</span>
        </h1>
        <div className="w-12 h-0.5 rounded-full bg-blue-500 opacity-70" />
        <p className="text-[13px] font-medium text-slate-400">View and search through your complete medical history.</p>
      </div>

      {/* ── Search & Filter */}
      <TimelineSearch profiles={profiles || []} searchParams={params} />

      {/* ── Results badge */}
      {(params.q || params.profile || params.from || params.to) && (
        <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
          <IconSearch className="h-3.5 w-3.5" />
          Found {filteredPrescriptions?.length || 0} records
          {params.q && <Badge variant="secondary" className="rounded-full text-[10px]">Search: {params.q}</Badge>}
          {params.profile && profiles && (
            <Badge variant="secondary" className="rounded-full text-[10px]">
              Profile: {profiles.find(p => p.id === params.profile)?.name}
            </Badge>
          )}
        </div>
      )}

      {/* ── Timeline */}
      {!filteredPrescriptions || filteredPrescriptions.length === 0 ? (
        <Card className="bg-white/60 border-slate-200/40 rounded-[2rem]">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-5">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
              <IconFileText className="h-9 w-9 text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-slate-900">No Records Found</h3>
              <p className="text-[12px] text-slate-400 font-medium mt-1 max-w-xs">
                {params.q || params.profile ? 'Try adjusting your search criteria' : 'Start by uploading your first prescription'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([yearMonth, items]) => (
            <div key={yearMonth}>
              {/* Month Header */}
              <div className="sticky top-0 z-10 bg-[#fcfbf8]/90 backdrop-blur py-2 mb-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <IconCalendar className="h-4 w-4" />
                  {yearMonth}
                </h2>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-7 border-l border-blue-100 space-y-5">
                {items.map((prescription: Prescription & { medicines: Medicine[], family_profiles: FamilyProfile }) => (
                  <div key={prescription.id} className="relative group">
                    <div className="absolute -left-7.5 top-4 h-3 w-3 rounded-full bg-blue-500 border-2 border-[#fcfbf8] shadow-sm" />
                    <Card className="bg-white border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 rounded-xl">
                              <AvatarFallback className="rounded-xl bg-blue-50 text-blue-600 text-xs font-bold">
                                {prescription.family_profiles.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm text-slate-900">{prescription.family_profiles.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <IconStethoscope className="h-3 w-3" />
                                {prescription.attending_doctor || 'Unknown Doctor'}
                                {prescription.hospital_name && ` · ${prescription.hospital_name}`}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {prescription.visit_date
                              ? new Date(prescription.visit_date).toLocaleDateString()
                              : 'No date'}
                          </span>
                        </div>

                        {prescription.diagnosis && (
                          <p className="text-sm text-slate-700 mb-3">
                            <span className="font-semibold">Diagnosis: </span>{prescription.diagnosis}
                          </p>
                        )}

                        {prescription.medicines && prescription.medicines.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {prescription.medicines.slice(0, 4).map((m: Medicine) => (
                              <Badge key={m.id} variant="outline" className="rounded-full text-[10px] font-medium gap-1 border-slate-200">
                                <IconPill className="h-3 w-3" /> {m.name}
                              </Badge>
                            ))}
                            {prescription.medicines.length > 4 && (
                              <Badge variant="secondary" className="rounded-full text-[10px]">
                                +{prescription.medicines.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <Link href={`/dashboard/prescriptions/${prescription.id}`}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">
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
    if (!grouped[yearMonth]) grouped[yearMonth] = []
    grouped[yearMonth].push(prescription)
  }
  return grouped
}
