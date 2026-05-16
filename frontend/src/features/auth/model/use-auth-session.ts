import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import { getSupabaseClient } from '@/shared/api/supabase/client'
import type { ConnectedInstance } from '@/shared/types/instance'

type AuthSessionState = {
  isLoading: boolean
  session: Session | null
}

export function useAuthSession(instance: ConnectedInstance | null) {
  const [state, setState] = useState<AuthSessionState>({
    isLoading: true,
    session: null,
  })

  useEffect(() => {
    if (!instance) {
      return
    }

    let isMounted = true
    const supabase = getSupabaseClient(instance)

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setState({ isLoading: false, session: data.session })
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ isLoading: false, session })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [instance])

  if (!instance) {
    return { isLoading: false, session: null }
  }

  return state
}
