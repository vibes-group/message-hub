import { FaCog, FaCommentAlt, FaUsers } from 'react-icons/fa'
import { NavLink, Outlet } from 'react-router'

import type { UserProfile } from '@/entities/profile/model/profile'
import { cn } from '@/shared/lib/utils'

export type MessengerOutletContext = {
  profile: UserProfile
}

const navigationItems = [
  { to: '/chat', label: 'Chats', icon: FaCommentAlt },
  { to: '/contacts', label: 'Contacts', icon: FaUsers },
  { to: '/settings', label: 'Settings', icon: FaCog },
]

export function MessengerLayout({
  outletContext,
}: {
  outletContext: MessengerOutletContext
}) {
  return (
    <main className="mx-auto grid min-h-svh w-full max-w-7xl grid-rows-[1fr_auto] border-x bg-background md:grid-cols-[72px_320px_minmax(0,1fr)] md:grid-rows-1">
      <nav className="order-2 grid grid-cols-3 border-t bg-card md:order-none md:grid-cols-1 md:grid-rows-[72px_repeat(3,76px)_1fr_72px] md:border-r md:border-t-0">
        <div className="hidden place-items-center border-b text-lg font-black text-primary md:grid">
          MSG
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-16 flex-col items-center justify-center gap-1 border-r text-xs font-black uppercase text-muted-foreground transition-colors last:border-r-0 md:border-b md:border-r-0',
                  isActive && 'bg-primary text-primary-foreground',
                )
              }
            >
              <Icon data-icon="inline-start" />
              {item.label}
            </NavLink>
          )
        })}
        <div className="hidden md:block" />
        <div className="hidden place-items-center border-t md:grid">
          <div className="grid size-8 place-items-center border bg-muted text-xs font-bold text-primary">
            02
          </div>
        </div>
      </nav>

      <Outlet context={outletContext} />
    </main>
  )
}
