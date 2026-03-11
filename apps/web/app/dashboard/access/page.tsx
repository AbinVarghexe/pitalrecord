import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
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
  if (!user) {
    redirect('/login')
  }

  // Fetch profiles
  const { data: profiles } = await supabase
    .from('family_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Access</h1>
        <p className="text-muted-foreground">
          Generate temporary access keys for healthcare providers to view patient records.
        </p>
      </div>

      <AccessKeyForm profiles={profiles || []} preselectedProfile={params.profile} />

      <Suspense fallback={
        <div className="flex items-center justify-center py-8">
          <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }>
        <ActiveAccessKeys profiles={profiles || []} />
      </Suspense>
    </div>
  )
}
