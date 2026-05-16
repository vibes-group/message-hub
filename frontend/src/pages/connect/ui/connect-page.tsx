import { useState, type FormEvent } from 'react'
import { FaPlug } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { ZodError } from 'zod'

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
import { loadInstanceManifest } from '@/features/instance-connect/model/load-instance-manifest'
import { useInstanceStore } from '@/entities/instance/model/instance-store'

export function ConnectInstancePage() {
  const navigate = useNavigate()
  const setSelectedInstance = useInstanceStore(
    (state) => state.setSelectedInstance,
  )
  const [manifestUrl, setManifestUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const instance = await loadInstanceManifest(manifestUrl.trim())
      setSelectedInstance(instance)
      navigate('/auth')
    } catch (caughtError) {
      if (caughtError instanceof ZodError) {
        setError('Manifest format is invalid.')
      } else if (caughtError instanceof Error) {
        setError(caughtError.message)
      } else {
        setError('Unable to load this instance manifest.')
      }
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
            <FaPlug />
          </div>
          <CardTitle className="text-xl font-black uppercase">
            Connect instance
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-wide">
            Register a public Supabase manifest URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manifest-url" className="text-xs uppercase">
                Manifest URL
              </Label>
              <Input
                id="manifest-url"
                inputMode="url"
                placeholder="https://example.com/messenger.instance.json"
                value={manifestUrl}
                onChange={(event) => setManifestUrl(event.target.value)}
                required
              />
            </div>

            {error ? (
              <p className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Connecting...' : 'Initialize uplink'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </main>
  )
}
