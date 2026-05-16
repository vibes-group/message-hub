import { FaSearch } from 'react-icons/fa'

import { Button } from '@/shared/ui/button'

export function PanelHeader({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-3">
      <p className="text-xs font-black uppercase text-primary">Messenger</p>
      <h2 className="truncate text-sm font-black uppercase text-foreground">
        {title}
      </h2>
      <Button type="button" variant="outline" size="icon">
        <FaSearch data-icon="inline-start" />
        <span className="sr-only">Search</span>
      </Button>
    </header>
  )
}
