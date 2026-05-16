import { useState } from 'react'
import { useOutletContext } from 'react-router'

import {
  conversations,
  initialMessages,
} from '@/entities/messenger/model/mock-data'
import { ChatListPanel } from '@/widgets/chat-list/ui/chat-list-panel'
import { ChatWindow } from '@/widgets/chat-window/ui/chat-window'
import type { MessengerOutletContext } from '@/widgets/messenger-layout/ui/messenger-layout'

export function ChatPage() {
  const { profile } = useOutletContext<MessengerOutletContext>()
  const [activeConversationId, setActiveConversationId] = useState('general')

  return (
    <>
      <aside className="min-h-0 border-b bg-card md:border-b-0 md:border-r">
        <ChatListPanel
          activeConversationId={activeConversationId}
          conversations={conversations}
          onSelectConversation={setActiveConversationId}
        />
      </aside>
      <section className="order-1 flex min-h-0 flex-col bg-terminal md:order-none">
        <ChatWindow
        activeConversationId={activeConversationId}
        conversations={conversations}
        initialMessages={initialMessages}
        ownDisplayName={profile.display_name ?? 'You'}
      />
      </section>
    </>
  )
}
