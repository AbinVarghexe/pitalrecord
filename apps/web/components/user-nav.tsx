'use client'

import { signOut } from '@/lib/auth/actions'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@workspace/ui/components/button'

export function UserNav() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">
        {user.email || user.user_metadata?.full_name || 'User'}
      </span>
      {user.user_metadata?.avatar_url && (
        <img
          src={user.user_metadata.avatar_url}
          alt="Profile"
          className="h-8 w-8 rounded-full"
        />
      )}
      <Button variant="outline" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  )
}
