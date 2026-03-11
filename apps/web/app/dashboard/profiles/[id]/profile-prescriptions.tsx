import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { IconPrescription, IconArrowRight } from '@tabler/icons-react'
import type { Prescription } from '@/lib/supabase/types'

interface ProfilePrescriptionsProps {
  profileId: string
}

export async function ProfilePrescriptions({ profileId }: ProfilePrescriptionsProps) {
  const supabase = await createClient()
  
  const { data: prescriptions, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load prescriptions
      </div>
    )
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prescriptions uploaded yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {prescriptions.map((prescription: Prescription) => (
        <Link
          key={prescription.id}
          href={`/dashboard/prescriptions/${prescription.id}`}
          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
              <IconPrescription className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {prescription.hospital_name || 'Prescription'}
              </p>
              <p className="text-xs text-muted-foreground">
                {prescription.visit_date 
                  ? new Date(prescription.visit_date).toLocaleDateString()
                  : new Date(prescription.created_at).toLocaleDateString()}
                {prescription.attending_doctor && ` · Dr. ${prescription.attending_doctor}`}
              </p>
            </div>
          </div>
          <IconArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
