import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { IconLoader2, IconKey } from '@tabler/icons-react'
import { AccessKeyForm } from './access-key-form'
import { ActiveAccessKeys } from './active-access-keys'

export const metadata: Metadata = {
  title: 'Doctor Access - PitalRecord',
  description: 'Generate temporary access keys for healthcare providers',
}

interface PageProps {
  searchParams: Promise<{ profile?: string }>
}

export default async function AccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profiles } = await supabase
    .from('family_profiles').select('*')
    .eq('user_id', user.id).order('name')

  return (
    <div className="p-8 md:p-12 space-y-10 max-w-4xl mx-auto">
      {/* ── Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">Secure Access</span>
        </div>
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight leading-none flex items-center gap-3">
          <IconKey className="h-9 w-9 text-blue-600" />
          Doctor <span className="font-serif italic font-medium ml-2">Access</span>
        </h1>
        <div className="w-12 h-0.5 rounded-full bg-blue-500 opacity-70" />
        <p className="text-[13px] font-medium text-slate-400 leading-relaxed">
          Generate temporary access keys for healthcare providers to view patient records.
        </p>
      </div>

      {/* ── Access Key Form */}
      <AccessKeyForm profiles={profiles || []} preselectedProfile={params.profile} />

      {/* ── Active Keys */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-10">
          <IconLoader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      }>
        <ActiveAccessKeys profiles={profiles || []} />
      </Suspense>
    </div>
  )
}
