import { FaPlus } from 'react-icons/fa'

import type { Conversation } from '@/entities/messenger/model/mock-data'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PanelHeader } from '@/widgets/messenger-layout/ui/panel-header'

type ChatListPanelProps = {
  activeConversationId: string
  conversations: Conversation[]
  onSelectConversation: (conversationId: string) => void
}

export function ChatListPanel({
  activeConversationId,
  conversations,
  onSelectConversation,
}: ChatListPanelProps) {
  return (
    <div className="flex flex-col">
      <PanelHeader title="Secure_channels" />
      <div className="border-b p-3">
        <Input placeholder="Filter nodes..." type="search" />
      </div>
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          type="button"
          className="border-b p-3 text-left transition-colors hover:bg-accent data-[active=true]:border-l-4 data-[active=true]:border-l-primary data-[active=true]:bg-muted"
          data-active={conversation.id === activeConversationId}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-black uppercase text-foreground">
              {conversation.title}
            </span>
            <span className="text-xs font-bold uppercase text-muted-foreground">
              {conversation.meta}
            </span>
          </span>
          <span className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-xs text-muted-foreground">
              {conversation.lastMessage}
            </span>
            {conversation.unreadCount > 0 ? (
              <Badge>{conversation.unreadCount}</Badge>
            ) : null}
          </span>
        </button>
      ))}
      <div className="p-3">
        <Button type="button" variant="outline" className="w-full">
          <FaPlus data-icon="inline-start" />
          New secure channel
        </Button>
      </div>
    </div>
  )
}
