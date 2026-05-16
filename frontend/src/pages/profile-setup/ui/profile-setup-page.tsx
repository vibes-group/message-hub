import { useState, type FormEvent } from 'react'
import { FaIdBadge } from 'react-icons/fa'
import { Navigate, useNavigate } from 'react-router'

import { useInstanceStore } from '@/entities/instance/model/instance-store'
import {
  isDisplayNameConfigured,
} from '@/entities/profile/model/profile'
import { useCurrentProfile } from '@/entities/profile/model/use-current-profile'
import { useAuthSession } from '@/features/auth/model/use-auth-session'
import { saveDisplayName } from '@/features/profile-setup/model/save-display-name'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function ProfileSetupPage() {
  const navigate = useNavigate()
  const selectedInstance = useInstanceStore((state) => state.selectedInstance)
  const { isLoading: isSessionLoading, session } =
    useAuthSession(selectedInstance)
  const {
    error: profileError,
    isLoading: isProfileLoading,
    profile,
  } = useCurrentProfile(selectedInstance, session)
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  if (!selectedInstance) {
    return <Navigate to="/connect" replace />
  }

  if (!isSessionLoading && !session) {
    return <Navigate to="/auth" replace />
  }

  if (!isProfileLoading && isDisplayNameConfigured(profile)) {
    return <Navigate to="/chat" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedInstance || !session) {
      return
    }

    setError(null)
    setIsPending(true)

    try {
      await saveDisplayName({
        displayName,
        instance: selectedInstance,
        userId: session.user.id,
      })
      navigate('/chat', { replace: true })
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to save display name.',
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="grid min-h-svh place-items-center px-4 py-5">
      <div className="w-full max-w-md border border-border bg-background/80 p-3">
        <Card className="relative border-primary/35 bg-terminal">
          <span className="absolute -right-px -top-px size-3 border-r-2 border-t-2 border-primary" />
          <span className="absolute -bottom-px -left-px size-3 border-b-2 border-l-2 border-primary" />
          <CardHeader className="items-center gap-2 pb-4 text-center">
            <div className="grid size-16 place-items-center bg-primary text-primary-foreground">
              <FaIdBadge />
            </div>
            <CardTitle className="text-xl font-black uppercase text-foreground">
              Set operator name
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-wide">
              This name is visible to other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="display-name" className="text-xs uppercase">
                  Display name
                </Label>
                <Input
                  id="display-name"
                  autoComplete="nickname"
                  maxLength={32}
                  minLength={2}
                  placeholder="Operator 02"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                />
              </div>

              {isSessionLoading || isProfileLoading ? (
                <p className="border bg-muted p-3 text-sm text-muted-foreground">
                  Loading profile...
                </p>
              ) : null}

              {profileError ? (
                <p className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {profileError}
                </p>
              ) : null}

              {error ? (
                <p className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isPending || isSessionLoading || isProfileLoading}
              >
                {isPending ? 'Saving...' : 'Enter messenger'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
