import { GoogleSignInButton } from '@/components/google-sign-in-button'
import { UserNav } from '@/components/user-nav'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-svh flex-col p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">PitalRecord</h1>
        {user && <UserNav />}
      </header>

      <div className="flex max-w-2xl min-w-0 flex-col gap-6">
        {!user ? (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome to PitalRecord</h2>
              <p className="text-muted-foreground mb-4">
                Sign in with Google to get started. No email verification required!
              </p>
              <GoogleSignInButton />
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              (Press <kbd>d</kbd> to toggle dark mode)
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Welcome back, {user.user_metadata?.full_name || user.email}!
              </h2>
              <p className="text-muted-foreground mb-4">
                You&apos;re successfully authenticated with Supabase.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">User Info:</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <span className="font-medium">Email:</span> {user.email}
                  </li>
                  <li>
                    <span className="font-medium">Provider:</span> {user.app_metadata.provider}
                  </li>
                  <li>
                    <span className="font-medium">User ID:</span>{' '}
                    <code className="text-xs">{user.id}</code>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              (Press <kbd>d</kbd> to toggle dark mode)
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
