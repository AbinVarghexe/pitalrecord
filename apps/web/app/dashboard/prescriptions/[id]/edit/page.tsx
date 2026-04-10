import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { reviewPrescription } from '@/app/actions/prescriptions.action'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import type { Medicine } from '@/lib/supabase/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPrescriptionPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .select('*, medicines(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !prescription) {
    notFound()
  }

  async function submitAction(formData: FormData) {
    'use server'

    const diagnosisRaw = (formData.get('diagnosis') as string) || ''
    const medicinesRaw = (formData.get('medicines') as string) || ''

    const parsedMedicines = medicinesRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, dosage, frequency, duration, instructions] = line.split('|')
        return {
          name: (name || '').trim(),
          dosage: dosage?.trim() || null,
          frequency: frequency?.trim() || null,
          duration: duration?.trim() || null,
          instructions: instructions?.trim() || null,
        }
      })

    await reviewPrescription(id, {
      visitDate: (formData.get('visit_date') as string) || null,
      hospitalName: (formData.get('hospital_name') as string) || null,
      attendingDoctor: (formData.get('attending_doctor') as string) || null,
      diagnosis: diagnosisRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      followUpDate: (formData.get('follow_up_date') as string) || null,
      medicines: parsedMedicines,
    })
  }

  const medicinesText = (prescription.medicines || [])
    .map((medicine: Medicine) =>
      [
        medicine.name ?? '',
        medicine.dosage ?? '',
        medicine.frequency ?? '',
        medicine.duration ?? '',
        medicine.instructions ?? '',
      ].join('|')
    )
    .join('\n')

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Prescription</h1>
          <p className="text-muted-foreground">
            Confirm extracted AI data and save structured record.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/prescriptions/${id}`}>Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Data Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={submitAction} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visit_date">Visit Date</Label>
                <Input
                  id="visit_date"
                  name="visit_date"
                  type="date"
                  defaultValue={prescription.visit_date || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="follow_up_date">Follow-up Date</Label>
                <Input
                  id="follow_up_date"
                  name="follow_up_date"
                  type="date"
                  defaultValue={prescription.follow_up_date || ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital_name">Hospital / Clinic</Label>
              <Input
                id="hospital_name"
                name="hospital_name"
                defaultValue={prescription.hospital_name || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attending_doctor">Attending Doctor</Label>
              <Input
                id="attending_doctor"
                name="attending_doctor"
                defaultValue={prescription.attending_doctor || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis (comma separated)</Label>
              <Input
                id="diagnosis"
                name="diagnosis"
                defaultValue={(prescription.diagnosis || []).join(', ')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicines">
                Medicines (one per line: name|dosage|frequency|duration|instructions)
              </Label>
              <Textarea
                id="medicines"
                name="medicines"
                rows={8}
                defaultValue={medicinesText}
              />
            </div>

            <Button type="submit">Save Reviewed Data</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
