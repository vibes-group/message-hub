import { Button } from '@/shared/ui/button'
import { PanelHeader } from '@/widgets/messenger-layout/ui/panel-header'

type SettingsPanelProps = {
  instanceHost: string
  instanceName: string
  onSwitchInstance: () => void
}

export function SettingsPanel({
  instanceHost,
  instanceName,
  onSwitchInstance,
}: SettingsPanelProps) {
  return (
    <div className="flex flex-col">
      <PanelHeader title="Settings" />
      <div className="flex flex-col gap-3 p-3">
        <div className="border bg-muted p-3">
          <p className="text-xs font-bold uppercase text-muted-foreground">
            Active instance
          </p>
          <p className="mt-1 truncate text-sm font-black uppercase">
            {instanceName}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {instanceHost}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onSwitchInstance}>
          Switch instance
        </Button>
        <Button type="button" variant="ghost">
          Notification settings
        </Button>
      </div>
    </div>
  )
}
