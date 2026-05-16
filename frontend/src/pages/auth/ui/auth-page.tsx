import { useState, type FormEvent } from 'react'
import { FaGoogle, FaSignInAlt } from 'react-icons/fa'
import { Navigate, useNavigate } from 'react-router'

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
import { getSupabaseClient } from '@/shared/api/supabase/client'
import { useInstanceStore } from '@/entities/instance/model/instance-store'
import { useAuthSession } from '@/features/auth/model/use-auth-session'

type AuthMode = 'sign-in' | 'sign-up'

export function AuthPage() {
  const navigate = useNavigate()
  const selectedInstance = useInstanceStore((state) => state.selectedInstance)
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const { isLoading, session } = useAuthSession(selectedInstance)

  if (!selectedInstance) {
    return <Navigate to="/connect" replace />
  }

  if (!isLoading && session) {
    return <Navigate to="/profile/setup" replace />
  }

  const supabase = getSupabaseClient(selectedInstance)

  async function handlePasswordAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsPending(true)

    const result =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })

    setIsPending(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (result.data.session) {
      navigate('/profile/setup')
      return
    }

    if (mode === 'sign-up') {
      setPassword('')
      setNotice(
        'Check your email and confirm registration before signing in.',
      )
      setMode('sign-in')
      return
    }

    setNotice('Sign in did not create a session. Please try again.')
  }

  async function handleGoogleAuth() {
    setError(null)
    setNotice(null)
    setIsPending(true)

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
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
            <FaSignInAlt />
          </div>
          <CardTitle className="text-xl font-black uppercase text-foreground">
            {mode === 'sign-in' ? 'Welcome back' : 'Create access'}
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-wide">
            Accessing {selectedInstance.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isPending}
            className="w-full"
          >
            <FaGoogle data-icon="inline-start" />
            Sign in with Google
          </Button>

          <div className="flex items-center gap-3 text-xs font-bold uppercase text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            Manual entry
            <span className="h-px flex-1 bg-border" />
          </div>

          <form className="flex flex-col gap-3" onSubmit={handlePasswordAuth}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-xs uppercase">
                Operator email
              </Label>
              <Input
                id="email"
                autoComplete="email"
                inputMode="email"
                type="email"
                placeholder="operator@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-xs uppercase">
                Secure key
              </Label>
              <Input
                id="password"
                autoComplete={
                  mode === 'sign-in' ? 'current-password' : 'new-password'
                }
                minLength={8}
                placeholder="********"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? (
              <p className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {notice ? (
              <p className="border bg-accent p-3 text-sm text-accent-foreground">
                {notice}
              </p>
            ) : null}

            <Button type="submit" disabled={isPending}>
              {mode === 'sign-in' ? 'Initialize uplink' : 'Request access'}
            </Button>
          </form>

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setMode((currentMode) =>
                currentMode === 'sign-in' ? 'sign-up' : 'sign-in',
              )
            }
          >
            {mode === 'sign-in'
              ? 'Need access? Create account'
              : 'Access exists? Sign in'}
          </Button>
        </CardContent>
      </Card>
      </div>
    </main>
  )
}
