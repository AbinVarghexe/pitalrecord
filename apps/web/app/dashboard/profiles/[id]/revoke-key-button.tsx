'use client'

import { useState } from 'react'
import { revokeDoctorAccessKey } from '@/app/actions/access.action'
import { Button } from '@workspace/ui/components/button'
import { IconX, IconLoader2 } from '@tabler/icons-react'

interface RevokeKeyButtonProps {
  keyId: string
}

export function RevokeKeyButton({ keyId }: RevokeKeyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleRevoke() {
    if (!confirm('Are you sure you want to revoke this access key? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    await revokeDoctorAccessKey(keyId)
    setIsLoading(false)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRevoke}
      disabled={isLoading}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      {isLoading ? (
        <IconLoader2 className="h-4 w-4 animate-spin" />
      ) : (
        <IconX className="h-4 w-4" />
      )}
      <span className="ml-1">Revoke</span>
    </Button>
  )
}
