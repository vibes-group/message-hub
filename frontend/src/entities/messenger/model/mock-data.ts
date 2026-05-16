export type Conversation = {
  id: string
  title: string
  lastMessage: string
  meta: string
  unreadCount: number
}

export type Contact = {
  id: string
  name: string
  status: string
  initials: string
}

export type Message = {
  id: string
  conversationId: string
  author: string
  body: string
  createdAt: string
  isOwn: boolean
}

export const conversations: Conversation[] = [
  {
    id: 'general',
    title: 'OPERATOR_02',
    lastMessage: 'Uplink established. Awaiting payload...',
    meta: '14:02',
    unreadCount: 2,
  },
  {
    id: 'alpha',
    title: 'NODE_ALPHA',
    lastMessage: 'Status: all systems nominal.',
    meta: '10:42',
    unreadCount: 0,
  },
  {
    id: 'sector',
    title: 'SECTOR_TEAM',
    lastMessage: 'Reviewing telemetry from Sector 7 subnet.',
    meta: 'Yesterday',
    unreadCount: 0,
  },
]

export const contacts: Contact[] = [
  { id: 'aiden', name: 'Aiden Cross', status: 'Active now', initials: 'AC' },
  { id: 'alyssa', name: 'Alyssa Reed', status: 'Last seen 2h ago', initials: 'AR' },
  { id: 'brix', name: 'Brix Vance', status: 'Active now', initials: 'BV' },
  { id: 'corbin', name: 'Corbin Dallas', status: 'Idle', initials: 'CD' },
]

export const initialMessages: Message[] = [
  {
    id: '1',
    conversationId: 'general',
    author: 'OPERATOR_02',
    body: 'Confirming receipt of encrypted data packets. Initial decryption shows zero parity errors. Advise on next phase requirements.',
    createdAt: '14:02',
    isOwn: false,
  },
  {
    id: '2',
    conversationId: 'general',
    author: 'SYSTEM_ADMIN',
    body: 'Excellent. Proceed with Layer-3 handshake. Initiate bypass on Sector 7 firewall nodes. We need immediate access to the core logs.',
    createdAt: '14:03',
    isOwn: true,
  },
  {
    id: '3',
    conversationId: 'general',
    author: 'OPERATOR_02',
    body: 'Handshake sequence initiated. Accessing bypass protocols now. Uplink established. Awaiting payload parameters...',
    createdAt: '14:06',
    isOwn: false,
  },
]
