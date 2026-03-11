'use client'

import { signInWithGoogle } from '@/lib/auth/actions'
import { Button } from '@workspace/ui/components/button'
import { useState } from 'react'

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in with Google:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Sign in with Google'}
    </Button>
  )
}
