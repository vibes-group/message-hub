import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

const AuthCallbackPage = lazy(() =>
  import('@/pages/auth/ui/auth-callback-page').then((module) => ({
    default: module.AuthCallbackPage,
  })),
)
const AuthPage = lazy(() =>
  import('@/pages/auth/ui/auth-page').then((module) => ({
    default: module.AuthPage,
  })),
)
const ChatPage = lazy(() =>
  import('@/pages/chat/ui/chat-page').then((module) => ({
    default: module.ChatPage,
  })),
)
const ConnectInstancePage = lazy(() =>
  import('@/pages/connect/ui/connect-page').then((module) => ({
    default: module.ConnectInstancePage,
  })),
)
const ContactsPage = lazy(() =>
  import('@/pages/contacts/ui/contacts-page').then((module) => ({
    default: module.ContactsPage,
  })),
)
const MessengerRootPage = lazy(() =>
  import('@/pages/messenger/ui/messenger-root-page').then((module) => ({
    default: module.MessengerRootPage,
  })),
)
const ProfileSetupPage = lazy(() =>
  import('@/pages/profile-setup/ui/profile-setup-page').then((module) => ({
    default: module.ProfileSetupPage,
  })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings/ui/settings-page').then((module) => ({
    default: module.SettingsPage,
  })),
)

function RouteFallback() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Loading...</p>
    </main>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/connect" replace />} />
        <Route path="/connect" element={<ConnectInstancePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/profile/setup" element={<ProfileSetupPage />} />
        <Route element={<MessengerRootPage />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/connect" replace />} />
      </Routes>
    </Suspense>
  )
}
