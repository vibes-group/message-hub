import { useInstanceStore } from '@/entities/instance/model/instance-store'
import { SettingsPanel } from '@/widgets/settings-panel/ui/settings-panel'

export function SettingsPage() {
  const selectedInstance = useInstanceStore((state) => state.selectedInstance)
  const clearSelectedInstance = useInstanceStore(
    (state) => state.clearSelectedInstance,
  )

  return (
    <>
      <aside className="min-h-0 border-b bg-card md:border-b-0 md:border-r">
        <SettingsPanel
          instanceHost={
            selectedInstance ? new URL(selectedInstance.supabaseUrl).host : ''
          }
          instanceName={selectedInstance?.name ?? ''}
          onSwitchInstance={clearSelectedInstance}
        />
      </aside>
      <section className="order-1 flex min-h-0 flex-col bg-terminal md:order-none">
        <div className="flex flex-1 flex-col border-b bg-card p-4">
          <h1 className="text-base font-black uppercase text-primary">
            Settings
          </h1>
          <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
            Instance, notifications and local device controls
          </p>
        </div>
        <div className="grid flex-1 place-items-center p-6 text-center">
          <div className="max-w-md border bg-panel p-5">
            <p className="text-sm font-black uppercase text-foreground">
              Active configuration
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Server switching is intentionally inside Settings. Push notification
              preferences and local cache controls will live here as they are
              implemented.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
