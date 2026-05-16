import { Navigate } from 'react-router'

import { useInstanceStore } from '@/entities/instance/model/instance-store'
import { isDisplayNameConfigured } from '@/entities/profile/model/profile'
import { useCurrentProfile } from '@/entities/profile/model/use-current-profile'
import { useAuthSession } from '@/features/auth/model/use-auth-session'
import { MessengerLayout } from '@/widgets/messenger-layout/ui/messenger-layout'

export function MessengerRootPage() {
  const selectedInstance = useInstanceStore((state) => state.selectedInstance)
  const { isLoading, session } = useAuthSession(selectedInstance)
  const { isLoading: isProfileLoading, profile } = useCurrentProfile(
    selectedInstance,
    session,
  )

  if (!selectedInstance) {
    return <Navigate to="/connect" replace />
  }

  if (isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <p className="text-sm font-bold uppercase text-muted-foreground">
          Checking session...
        </p>
      </main>
    )
  }

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  if (isProfileLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <p className="text-sm font-bold uppercase text-muted-foreground">
          Loading profile...
        </p>
      </main>
    )
  }

  if (!isDisplayNameConfigured(profile)) {
    return <Navigate to="/profile/setup" replace />
  }

  return <MessengerLayout outletContext={{ profile }} />
}
