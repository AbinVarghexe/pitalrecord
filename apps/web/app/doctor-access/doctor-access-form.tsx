'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { IconArrowRight, IconLoader2 } from '@tabler/icons-react'
import { validateDoctorAccessKey } from '@/app/actions/access.action'

export function DoctorAccessForm() {
  const [accessKey, setAccessKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await validateDoctorAccessKey(accessKey.trim())
      
      if (result.error) {
        setError(result.error)
        return
      }

      if (result.sessionId) {
        router.push(`/doctor-access/session/${result.sessionId}`)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="access-key">Access Key</Label>
        <Input
          id="access-key"
          type="text"
          placeholder="Enter access key..."
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          className="font-mono"
          required
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !accessKey.trim()}>
        {isLoading ? (
          <>
            <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
            Validating...
          </>
        ) : (
          <>
            Access Records
            <IconArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        By accessing these records, you agree to maintain patient confidentiality
        and comply with all applicable healthcare regulations.
      </p>
    </form>
  )
}
