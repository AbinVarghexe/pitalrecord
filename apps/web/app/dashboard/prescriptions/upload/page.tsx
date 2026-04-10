'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { uploadPrescription } from '@/app/actions/prescriptions.action'
import { getProfiles } from '@/app/actions/profiles.action'
import {
  ALLOWED_PRESCRIPTION_MIME_TYPES,
  MAX_PRESCRIPTION_FILE_SIZE,
} from '@/lib/validation/prescriptions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Label } from '@workspace/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { IconArrowLeft, IconLoader2, IconUpload, IconFile, IconX, IconPhoto } from '@tabler/icons-react'
import type { FamilyProfile } from '@/lib/supabase/types'

const MAX_FILE_SIZE = MAX_PRESCRIPTION_FILE_SIZE
const ALLOWED_TYPES = ALLOWED_PRESCRIPTION_MIME_TYPES

export default function UploadPrescriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedProfile = searchParams.get('profile')

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<FamilyProfile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<string>(preselectedProfile || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    async function loadProfiles() {
      const result = await getProfiles()
      if (result.data) {
        setProfiles(result.data)
        if (preselectedProfile && result.data.some(p => p.id === preselectedProfile)) {
          setSelectedProfile(preselectedProfile)
        }
      }
      setIsLoadingProfiles(false)
    }
    loadProfiles()
  }, [preselectedProfile])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.has(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, HEIC, or PDF files.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 20MB limit.'
    }
    return null
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const error = validateFile(file)
      if (error) {
        setError(error)
      } else {
        setError(null)
        setSelectedFile(file)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const error = validateFile(file)
      if (error) {
        setError(error)
      } else {
        setError(null)
        setSelectedFile(file)
      }
    }
  }

  async function handleSubmit() {
    if (!selectedProfile || !selectedFile) {
      setError('Please select a profile and upload a file.')
      return
    }

    setIsLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('profileId', selectedProfile)
    formData.append('file', selectedFile)
    
    const result = await uploadPrescription(formData)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(`/dashboard/prescriptions/${result.data?.id}`)
    }
  }

  if (isLoadingProfiles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/prescriptions">
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Prescription</h1>
            <p className="text-muted-foreground">
              Upload a new medical prescription.
            </p>
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-1">No profiles found</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-sm">
              You need to create a family profile before uploading prescriptions.
            </p>
            <Button asChild>
              <Link href="/dashboard/profiles/new">Create First Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/prescriptions">
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Prescription</h1>
          <p className="text-muted-foreground">
            Upload a new medical prescription document.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
          <CardDescription>
            Select a profile and upload the prescription image or PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="profile">Family Profile *</Label>
            <Select 
              value={selectedProfile} 
              onValueChange={setSelectedProfile}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a profile" />
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
            <Label>Prescription Document *</Label>
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
                ${selectedFile ? 'bg-muted/50' : ''}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.heic,.pdf"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedFile.type === 'application/pdf' ? (
                      <IconFile className="h-6 w-6 text-primary" />
                    ) : (
                      <IconPhoto className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                  >
                    <IconX className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <IconUpload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Drop your file here or click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPEG, PNG, HEIC, and PDF (max 20MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">What happens next?</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Your document will be securely uploaded and encrypted</li>
              <li>• Our AI will extract medical information automatically</li>
              <li>• You can review and edit the extracted data</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" asChild disabled={isLoading}>
              <Link href="/dashboard/prescriptions">Cancel</Link>
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !selectedProfile || !selectedFile}
            >
              {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Prescription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
