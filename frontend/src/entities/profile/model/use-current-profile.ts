import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import { getSupabaseClient } from '@/shared/api/supabase/client'
import type { ConnectedInstance } from '@/shared/types/instance'
import type { UserProfile } from '@/entities/profile/model/profile'

type CurrentProfileState = {
  error: string | null
  isLoading: boolean
  profile: UserProfile | null
}

export function useCurrentProfile(
  instance: ConnectedInstance | null,
  session: Session | null,
) {
  const [state, setState] = useState<CurrentProfileState>({
    error: null,
    isLoading: true,
    profile: null,
  })

  useEffect(() => {
    if (!instance || !session) {
      return
    }

    let isMounted = true
    const supabase = getSupabaseClient(instance)

    supabase
      .from('profiles')
      .select('id, display_name, display_name_set_at, avatar_url')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted) {
          return
        }

        if (error) {
          setState({
            error: error.message,
            isLoading: false,
            profile: null,
          })
          return
        }

        setState({
          error: null,
          isLoading: false,
          profile: data,
        })
      })

    return () => {
      isMounted = false
    }
  }, [instance, session])

  if (!instance || !session) {
    return { error: null, isLoading: false, profile: null }
  }

  return state
}
