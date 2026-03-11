'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateDoctorAccessKey } from '@/app/actions/access.action'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Badge } from '@workspace/ui/components/badge'
import { IconKey, IconCopy, IconCheck, IconLoader2, IconShieldCheck, IconClock, IconEye, IconEdit } from '@tabler/icons-react'
import type { FamilyProfile } from '@/lib/supabase/types'

const durations = [
  { value: '0.5', label: '30 minutes' },
  { value: '1', label: '1 hour' },
  { value: '2', label: '2 hours' },
]

const scopes = [
  { value: 'read', label: 'Read Only', description: 'Doctor can view records only', icon: IconEye },
  { value: 'read_write', label: 'Read & Write', description: 'Doctor can view and add records', icon: IconEdit },
]

interface AccessKeyFormProps {
  profiles: FamilyProfile[]
  preselectedProfile?: string | null
}

export function AccessKeyForm({ profiles, preselectedProfile }: AccessKeyFormProps) {
  const router = useRouter()
  const [selectedProfile, setSelectedProfile] = useState<string>(preselectedProfile || '')
  const [selectedDuration, setSelectedDuration] = useState<string>('1')
  const [selectedScope, setSelectedScope] = useState<'read' | 'read_write'>('read')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!selectedProfile) {
      setError('Please select a profile')
      return
    }

    setIsGenerating(true)
    setError(null)

    const formData = new FormData()
    formData.append('profileId', selectedProfile)
    formData.append('scope', selectedScope)
    formData.append('duration', selectedDuration)

    const result = await generateDoctorAccessKey(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.key) {
      setGeneratedKey(result.key)
      router.refresh() // Refresh to show new active key
    }
    setIsGenerating(false)
  }

  async function copyToClipboard() {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const selectedProfileName = profiles.find(p => p.id === selectedProfile)?.name

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generate Key Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconKey className="h-5 w-5" />
              Generate Access Key
            </CardTitle>
            <CardDescription>
              Create a temporary, secure access key for a doctor consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profiles.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  You need to create a family profile first.
                </p>
                <Button asChild>
                  <Link href="/dashboard/profiles/new">Create Profile</Link>
                </Button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Select Profile</Label>
                  <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a family profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Access Duration</Label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {scopes.map((scope) => (
                      <button
                        key={scope.value}
                        type="button"
                        onClick={() => setSelectedScope(scope.value as 'read' | 'read_write')}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          selectedScope === scope.value
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'hover:border-primary/50'
                        }`}
                      >
                        <scope.icon className={`h-5 w-5 mb-2 ${
                          selectedScope === scope.value ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <p className="font-medium text-sm">{scope.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{scope.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !selectedProfile}
                  className="w-full"
                >
                  {isGenerating ? (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <IconKey className="mr-2 h-4 w-4" />
                  )}
                  Generate Access Key
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShieldCheck className="h-5 w-5" />
              How It Works
            </CardTitle>
            <CardDescription>Secure, time-limited access for healthcare providers</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 rounded-full p-0 flex items-center justify-center">1</Badge>
                <div>
                  <p className="font-medium">Generate a key</p>
                  <p className="text-sm text-muted-foreground">Select a profile, duration, and access level</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 rounded-full p-0 flex items-center justify-center">2</Badge>
                <div>
                  <p className="font-medium">Share with your doctor</p>
                  <p className="text-sm text-muted-foreground">Give them the key during your consultation</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 rounded-full p-0 flex items-center justify-center">3</Badge>
                <div>
                  <p className="font-medium">Doctor accesses records</p>
                  <p className="text-sm text-muted-foreground">They enter the key at our doctor portal</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 rounded-full p-0 flex items-center justify-center">4</Badge>
                <div>
                  <p className="font-medium">Key expires automatically</p>
                  <p className="text-sm text-muted-foreground">Or revoke it anytime for immediate termination</p>
                </div>
              </li>
            </ol>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium flex items-center gap-2">
                <IconClock className="h-4 w-4" />
                Doctor Portal URL
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Share this URL with your healthcare provider:
              </p>
              <code className="block mt-2 text-sm bg-background rounded p-2 border">
                {typeof window !== 'undefined' ? window.location.origin : ''}/doctor-access
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Key Dialog */}
      <Dialog open={!!generatedKey} onOpenChange={() => setGeneratedKey(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconCheck className="h-5 w-5 text-green-600" />
              Access Key Generated
            </DialogTitle>
            <DialogDescription>
              Share this key with your doctor. It will expire in {
                durations.find(d => d.value === selectedDuration)?.label
              }.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted p-4">
              <p className="text-sm text-muted-foreground mb-2">Access Key for {selectedProfileName}</p>
              <code className="block text-sm font-mono break-all bg-background rounded p-3 border">
                {generatedKey}
              </code>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1">
                {copied ? (
                  <>
                    <IconCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IconCopy className="mr-2 h-4 w-4" />
                    Copy Key
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50 p-3 text-sm">
              <p className="font-medium text-orange-600 dark:text-orange-400">Important</p>
              <p className="text-muted-foreground mt-1">
                This is the only time you will see this key. Make sure to copy it before closing this dialog.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
