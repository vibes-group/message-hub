import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { ConnectedInstance } from '@/shared/types/instance'

const clientCache = new Map<string, SupabaseClient>()

export function getSupabaseClient(instance: ConnectedInstance) {
  const cacheKey = `${instance.supabaseUrl}:${instance.supabaseAnonKey}`
  const cachedClient = clientCache.get(cacheKey)

  if (cachedClient) {
    return cachedClient
  }

  const client = createClient(instance.supabaseUrl, instance.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: `mh:${new URL(instance.supabaseUrl).host}:auth`,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  clientCache.set(cacheKey, client)

  return client
}
