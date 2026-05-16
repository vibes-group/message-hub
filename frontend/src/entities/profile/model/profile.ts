export type UserProfile = {
  id: string
  display_name: string | null
  display_name_set_at: string | null
  avatar_url: string | null
}

export function isDisplayNameConfigured(
  profile: UserProfile | null,
): profile is UserProfile {
  return Boolean(profile?.display_name?.trim() && profile.display_name_set_at)
}
