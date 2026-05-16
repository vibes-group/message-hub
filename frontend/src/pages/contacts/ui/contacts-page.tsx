import { contacts } from '@/entities/messenger/model/mock-data'
import { ContactsListPanel } from '@/widgets/contacts-list/ui/contacts-list-panel'

export function ContactsPage() {
  return (
    <>
      <aside className="min-h-0 border-b bg-card md:border-b-0 md:border-r">
        <ContactsListPanel contacts={contacts} />
      </aside>
      <section className="order-1 flex min-h-0 flex-col bg-terminal md:order-none">
        <div className="flex flex-1 flex-col border-b bg-card p-4">
          <h1 className="text-base font-black uppercase text-primary">
            Contacts
          </h1>
          <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
            Verified operators in active instance
          </p>
        </div>
        <div className="grid flex-1 place-items-center p-6 text-center">
          <div className="max-w-md border bg-panel p-5">
            <p className="text-sm font-black uppercase text-foreground">
              Contact directory
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a contact from the left panel. Direct messaging will be wired
              to Supabase profiles and conversations in the next data milestone.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
