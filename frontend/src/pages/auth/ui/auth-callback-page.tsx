import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'

import { getSupabaseClient } from '@/shared/api/supabase/client'
import { useInstanceStore } from '@/entities/instance/model/instance-store'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const selectedInstance = useInstanceStore((state) => state.selectedInstance)

  useEffect(() => {
    if (!selectedInstance) {
      return
    }

    const supabase = getSupabaseClient(selectedInstance)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        navigate('/profile/setup', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, selectedInstance])

  if (!selectedInstance) {
    return <Navigate to="/connect" replace />
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Finishing sign in...</p>
    </main>
  )
}
