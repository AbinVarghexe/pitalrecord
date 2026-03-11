import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Separator } from '@workspace/ui/components/separator'
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconBuilding,
  IconStethoscope,
  IconPill,
  IconDownload,
  IconExternalLink,
  IconAlertCircle
} from '@tabler/icons-react'
import { DeletePrescriptionButton } from './delete-prescription-button'
import type { PrescriptionWithMedicines, FamilyProfile, Medicine } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PrescriptionPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch prescription with medicines and profile
  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      medicines (*),
      family_profiles (
        id,
        name,
        blood_group,
        allergies
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !prescription) {
    notFound()
  }

  // Get signed URL for the image
  let imageUrl: string | null = null
  if (prescription.file_url) {
    const { data: urlData } = await supabase
      .storage
      .from('prescriptions')
      .createSignedUrl(prescription.file_url, 3600) // 1 hour expiry

    imageUrl = urlData?.signedUrl || null
  }

  const profile = prescription.family_profiles as FamilyProfile

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/prescriptions">
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {prescription.hospital_name || 'Prescription'}
          </h1>
          <p className="text-muted-foreground">
            For {profile?.name} · {prescription.visit_date
              ? new Date(prescription.visit_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : new Date(prescription.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/prescriptions/${id}/edit`}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeletePrescriptionButton prescriptionId={id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Document Preview */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Document</CardTitle>
            <CardDescription>Original uploaded prescription</CardDescription>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <div className="relative">
                <div className="rounded-lg border overflow-hidden bg-muted aspect-[3/4] relative">
                  {prescription.file_url?.endsWith('.pdf') ? (
                    <iframe
                      src={imageUrl}
                      className="w-full h-full min-h-[500px]"
                      title="Prescription PDF"
                    />
                  ) : (
                    <Image
                    src={imageUrl}
                    alt="Prescription"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                      <IconExternalLink className="mr-2 h-4 w-4" />
                      Open in New Tab
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href={imageUrl} download>
                      <IconDownload className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted aspect-[3/4] flex items-center justify-center">
                <p className="text-muted-foreground">Document not available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescription Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Details</CardTitle>
                <CardDescription>Extracted prescription information</CardDescription>
              </div>
              {prescription.ai_confidence !== null && (
                <Badge
                  variant={prescription.ai_confidence > 0.8 ? 'default' : prescription.ai_confidence > 0.5 ? 'secondary' : 'outline'}
                >
                  {Math.round(prescription.ai_confidence * 100)}% AI Confidence
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconCalendar className="h-4 w-4" />
                  Visit Date
                </p>
                <p className="font-medium">
                  {prescription.visit_date
                    ? new Date(prescription.visit_date).toLocaleDateString()
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconBuilding className="h-4 w-4" />
                  Hospital/Clinic
                </p>
                <p className="font-medium">
                  {prescription.hospital_name || 'Not specified'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconStethoscope className="h-4 w-4" />
                  Attending Doctor
                </p>
                <p className="font-medium">
                  {prescription.attending_doctor ? `Dr. ${prescription.attending_doctor}` : 'Not specified'}
                </p>
              </div>
            </div>

            {prescription.diagnosis && prescription.diagnosis.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Diagnosis</p>
                  <div className="flex flex-wrap gap-2">
                    {prescription.diagnosis.map((d: string, index: number) => (
                      <Badge key={index} variant="secondary">{d}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {profile?.allergies && profile.allergies.length > 0 && (
              <>
                <Separator />
                <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50 p-3">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1 mb-2">
                    <IconAlertCircle className="h-4 w-4" />
                    Allergies
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profile.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Medicines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPill className="h-5 w-5" />
              Medicines
            </CardTitle>
            <CardDescription>Prescribed medications</CardDescription>
          </CardHeader>
          <CardContent>
            {prescription.medicines && prescription.medicines.length > 0 ? (
              <div className="space-y-4">
                {prescription.medicines.map((medicine: Medicine, index: number) => (
                  <div key={medicine.id || index} className="rounded-lg border p-4">
                    <h4 className="font-semibold">{medicine.name}</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      {medicine.dosage && (
                        <div>
                          <p className="text-muted-foreground">Dosage</p>
                          <p>{medicine.dosage}</p>
                        </div>
                      )}
                      {medicine.frequency && (
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p>{medicine.frequency}</p>
                        </div>
                      )}
                      {medicine.duration && (
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p>{medicine.duration}</p>
                        </div>
                      )}
                    </div>
                    {medicine.instructions && (
                      <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded">
                        {medicine.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No medicines extracted yet.</p>
                <p className="text-sm mt-1">Edit this prescription to add medicines manually.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
