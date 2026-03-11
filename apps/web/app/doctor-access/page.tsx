import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { IconKey, IconShieldCheck, IconClock } from '@tabler/icons-react'
import { DoctorAccessForm } from './doctor-access-form'

export const metadata: Metadata = {
  title: 'Doctor Access Portal - PitalRecord',
  description: 'Secure temporary access to patient records',
}

export default function DoctorAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
              <IconKey className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Doctor Access Portal</h1>
            <p className="text-muted-foreground mt-2">
              Enter your temporary access key to view patient records
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Access Patient Records</CardTitle>
              <CardDescription>
                Enter the access key provided by the patient or their family member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorAccessForm />
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <IconShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Access</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All access is logged and monitored for patient safety
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <IconClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Time-Limited</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Access keys expire automatically for security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
