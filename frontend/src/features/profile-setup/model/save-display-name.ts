import { getSupabaseClient } from '@/shared/api/supabase/client'
import type { ConnectedInstance } from '@/shared/types/instance'

const DISPLAY_NAME_PATTERN = /^[a-zA-Z0-9_. -]{2,32}$/

export function validateDisplayName(displayName: string) {
  const normalizedDisplayName = displayName.trim().replace(/\s+/g, ' ')

  if (!DISPLAY_NAME_PATTERN.test(normalizedDisplayName)) {
    throw new Error(
      'Use 2-32 characters: letters, numbers, spaces, underscore, dot or dash.',
    )
  }

  return normalizedDisplayName
}

export async function saveDisplayName({
  displayName,
  instance,
  userId,
}: {
  displayName: string
  instance: ConnectedInstance
  userId: string
}) {
  const supabase = getSupabaseClient(instance)
  const normalizedDisplayName = validateDisplayName(displayName)
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: normalizedDisplayName,
      display_name_set_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return normalizedDisplayName
}
