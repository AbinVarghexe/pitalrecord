import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { IconUsers, IconPrescription, IconKey, IconPlus, IconArrowRight } from '@tabler/icons-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch stats
  const { data: profiles } = await supabase
    .from('family_profiles')
    .select('id')
    .is('deleted_at', null)
  
  const { data: prescriptions } = await supabase
    .from('prescriptions')
    .select('id, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: activeKeys } = await supabase
    .from('doctor_access_keys')
    .select('id')
    .eq('revoked', false)
    .gte('expires_at', new Date().toISOString())

  const profileCount = profiles?.length ?? 0
  const prescriptionCount = prescriptions?.length ?? 0
  const activeKeyCount = activeKeys?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your family&apos;s medical records securely.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Profiles</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCount}</div>
            <p className="text-xs text-muted-foreground">
              {profileCount === 0 ? 'Add your first profile' : `${profileCount} profile${profileCount === 1 ? '' : 's'} created`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <IconPrescription className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptionCount}</div>
            <p className="text-xs text-muted-foreground">
              {prescriptionCount === 0 ? 'Upload your first prescription' : 'Total uploaded'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Access Keys</CardTitle>
            <IconKey className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeKeyCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeKeyCount === 0 ? 'No active keys' : 'Currently active'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/profiles/new">
                <IconPlus className="mr-2 h-4 w-4" />
                Add Family Profile
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/prescriptions/upload">
                <IconPlus className="mr-2 h-4 w-4" />
                Upload Prescription
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/access">
                <IconKey className="mr-2 h-4 w-4" />
                Generate Doctor Access Key
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to set up your account</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Badge variant={profileCount > 0 ? 'default' : 'outline'} className="mt-0.5 shrink-0">
                  {profileCount > 0 ? '✓' : '1'}
                </Badge>
                <div>
                  <p className="font-medium">Create family profiles</p>
                  <p className="text-muted-foreground">Add profiles for yourself and family members</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant={prescriptionCount > 0 ? 'default' : 'outline'} className="mt-0.5 shrink-0">
                  {prescriptionCount > 0 ? '✓' : '2'}
                </Badge>
                <div>
                  <p className="font-medium">Upload prescriptions</p>
                  <p className="text-muted-foreground">Scan and upload your medical prescriptions</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5 shrink-0">3</Badge>
                <div>
                  <p className="font-medium">Share with doctors</p>
                  <p className="text-muted-foreground">Generate temporary access keys for consultations</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Recent Prescriptions */}
      {prescriptionCount > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Prescriptions</CardTitle>
              <CardDescription>Your latest uploaded documents</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/prescriptions">
                View All <IconArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prescriptions?.map((prescription) => (
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
                      <p className="text-sm font-medium">Prescription</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(prescription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <IconArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
