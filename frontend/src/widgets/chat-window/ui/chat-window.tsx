import { type FormEvent, useMemo, useState } from 'react'
import { FaEllipsisV, FaPaperPlane, FaShieldAlt } from 'react-icons/fa'

import type {
  Conversation,
  Message,
} from '@/entities/messenger/model/mock-data'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Textarea } from '@/shared/ui/textarea'

type ChatWindowProps = {
  activeConversationId: string
  conversations: Conversation[]
  initialMessages: Message[]
  ownDisplayName: string
}

export function ChatWindow({
  activeConversationId,
  conversations,
  initialMessages,
  ownDisplayName,
}: ChatWindowProps) {
  const [messageDraft, setMessageDraft] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  )

  const activeMessages = useMemo(
    () =>
      messages.filter(
        (message) => message.conversationId === activeConversationId,
      ),
    [activeConversationId, messages],
  )

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const body = messageDraft.trim()

    if (!body) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        conversationId: activeConversationId,
        author: ownDisplayName,
        body,
        createdAt: new Intl.DateTimeFormat(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
        isOwn: true,
      },
    ])
    setMessageDraft('')
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-card px-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center border bg-muted text-sm font-black text-foreground">
            02
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-black uppercase text-primary">
              {activeConversation?.title ?? 'Secure link'}
            </h1>
            <p className="truncate text-xs font-bold uppercase text-muted-foreground">
              Secure link active // id: 0xff2a1
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon">
            <FaShieldAlt data-icon="inline-start" />
            <span className="sr-only">Encryption status</span>
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <FaEllipsisV data-icon="inline-start" />
            <span className="sr-only">Conversation menu</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-3 md:p-5">
        <div className="mx-auto border bg-card px-3 py-1 text-xs font-bold uppercase text-muted-foreground">
          SYS.LOG // 14:02:45 UTC
        </div>
        {activeMessages.map((message) => (
          <article
            key={message.id}
            className="flex flex-col gap-1 data-[own=true]:items-end"
            data-own={message.isOwn}
          >
            <p className="max-w-[86%] text-xs font-bold uppercase text-muted-foreground">
              {message.author} // {message.createdAt}
            </p>
            <div className="max-w-[86%] border bg-panel px-4 py-3 text-sm leading-relaxed text-panel-foreground data-[own=true]:border-primary data-[own=true]:bg-background">
              {message.body}
            </div>
          </article>
        ))}
        <div className="mx-auto border border-primary px-3 py-1 text-xs font-black uppercase text-primary">
          Encryption key rotated
        </div>
      </div>

      <Separator />

      <form
        className="grid grid-cols-[1fr_auto] gap-2 bg-card p-3"
        onSubmit={handleSendMessage}
      >
        <Textarea
          className="min-h-12 resize-none uppercase"
          placeholder="Enter command or message..."
          value={messageDraft}
          onChange={(event) => setMessageDraft(event.target.value)}
        />
        <Button type="submit" size="icon" className="h-full min-h-12">
          <FaPaperPlane data-icon="inline-start" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </>
  )
}
