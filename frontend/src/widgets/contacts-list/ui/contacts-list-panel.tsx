import type { Contact } from '@/entities/messenger/model/mock-data'
import { cn } from '@/shared/lib/utils'
import { PanelHeader } from '@/widgets/messenger-layout/ui/panel-header'

export function ContactsListPanel({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="flex flex-col">
      <PanelHeader title="Contacts" />
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center gap-3 border-b p-3">
          <div className="grid size-11 shrink-0 place-items-center border bg-muted text-sm font-black">
            {contact.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black uppercase">
              {contact.name}
            </p>
            <p className="truncate text-xs font-bold uppercase text-muted-foreground">
              {contact.status}
            </p>
          </div>
          <span
            className={cn(
              'size-3 border',
              contact.status === 'Active now' ? 'bg-primary' : 'bg-muted',
            )}
          />
        </div>
      ))}
    </div>
  )
}
