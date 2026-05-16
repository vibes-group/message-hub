# Supabase PWA Messenger Development Plan

## 1. Product Goal

Build an open-source realtime messenger as a React PWA. The application is hosted as a static/web frontend, while each community or owner can connect it to their own Supabase instance by publishing a public instance configuration file.

Users can communicate only with users authenticated against and connected to the same Supabase project/database. This keeps every hosted instance isolated and lets anyone self-host the backend or use Supabase's free hosted tier.

## 2. Core Requirements

- React frontend installable as a PWA.
- Supabase as the primary backend provider.
- Runtime connection to different Supabase instances through a public manifest URL.
- Authentication through Supabase Auth:
  - Google/Gmail OAuth login.
  - Email/password login.
  - Optional email confirmation depending on instance settings.
- Realtime messaging between users of the same Supabase instance.
- Push notifications for new messages.
- Offline-friendly UI with cached conversations/messages.
- Open-source deployment path for both frontend and Supabase backend schema.

## 3. Recommended Stack

- Frontend:
  - React + Vite + TypeScript.
  - `@supabase/supabase-js` for auth, database and realtime.
  - TanStack Query for server-state caching.
  - Zustand or Jotai for local UI state.
  - Dexie or a small IndexedDB wrapper for offline message cache.
  - `vite-plugin-pwa` for PWA manifest and service worker.
  - React Router for app routes.

- Backend per instance:
  - Supabase Auth.
  - Supabase Postgres.
  - Supabase Realtime.
  - Supabase Row Level Security.
  - Supabase Edge Functions for push notification sending.
  - Database webhooks/triggers for message notification events.

## 4. Instance Connection Model

The user enters a URL to an instance manifest file. The app fetches the manifest, validates it, stores it locally, and creates a Supabase client for that instance.

Example manifest:

```json
{
  "schemaVersion": 1,
  "provider": "supabase",
  "name": "Community Chat",
  "supabaseUrl": "https://example.supabase.co",
  "supabaseAnonKey": "public-anon-key",
  "functionsUrl": "https://example.supabase.co/functions/v1",
  "vapidPublicKey": "public-vapid-key",
  "supportUrl": "https://example.com"
}
```

Rules:

- The manifest must contain only public values.
- Never include `service_role`, database passwords, private VAPID keys, Google OAuth secrets, or any server-only credentials.
- Store selected instance metadata in localStorage or IndexedDB with a versioned schema.
- Allow switching instances, but treat each instance as a separate auth/session/cache scope.

## 5. Supabase Auth Plan

### 5.1 Email/Password

Enable email/password provider in Supabase Auth.

Frontend flows:

- Sign up with email/password.
- Sign in with email/password.
- Password reset via Supabase Auth.
- Session restore on app load.
- Sign out from the current instance.

Implementation notes:

- Use `supabase.auth.signUp({ email, password })`.
- Use `supabase.auth.signInWithPassword({ email, password })`.
- Use `supabase.auth.resetPasswordForEmail(email)`.
- Use `supabase.auth.onAuthStateChange()` to keep app session state synchronized.
- Do not store passwords in app state, localStorage, IndexedDB, logs, or analytics.

### 5.2 Google/Gmail OAuth

Google OAuth is configured inside each Supabase project. Users sign in with a Google account, including Gmail addresses.

Supabase instance owner setup:

- Create Google OAuth credentials in Google Cloud Console.
- Add the Supabase callback URL to Google OAuth redirect URIs.
- Enable Google provider in Supabase Auth.
- Add Google client ID and secret in Supabase provider settings.
- Configure allowed redirect URLs for the frontend host.

Frontend flow:

```ts
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

Callback route:

- Add `/auth/callback`.
- Let Supabase JS recover the session from URL parameters.
- Redirect user back to the selected instance's chat UI.

Important limitation:

- The frontend cannot configure Google OAuth for an instance. Each Supabase instance owner must configure their own Google provider and redirect URLs.

## 6. Database Schema

Initial tables:

```sql
profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)

conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('direct', 'group')),
  title text,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)

conversation_members (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  last_read_message_id uuid,
  primary key (conversation_id, user_id)
)

messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
)

push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

Later tables:

- `message_attachments`
- `message_reactions`
- `conversation_invites`
- `blocked_users`
- `user_devices`
- `audit_events`

## 7. Row Level Security

Enable RLS on all public tables.

Policy principles:

- Users can read their own profile and profiles of users sharing a conversation.
- Users can read conversations where they are members.
- Users can insert messages only into conversations where they are members.
- Users can update/delete only their own messages, subject to product rules.
- Users can manage only their own push subscriptions.
- Users cannot list all users globally unless the instance intentionally supports public discovery.

Security helper functions:

- `is_conversation_member(conversation_id uuid, user_id uuid)`
- `can_read_profile(profile_id uuid)`
- `can_write_message(conversation_id uuid)`

Avoid duplicating complex RLS logic in every policy; use stable SQL helper functions where appropriate.

## 8. Realtime Plan

Use Supabase Realtime for live UI updates:

- Subscribe to new `messages` rows filtered by `conversation_id`.
- Subscribe to conversation membership changes for chat list updates.
- Use Presence for online state.
- Use Broadcast for typing indicators and ephemeral events.

Implementation rules:

- Persist actual messages in Postgres.
- Treat realtime events as synchronization hints, not the only source of truth.
- On reconnect, refetch the latest conversation state.
- Deduplicate messages by ID when merging realtime and query results.
- Keep subscriptions scoped to the currently opened conversation when possible.

## 9. Push Notification Plan

PWA push requires a service worker and a server-side sender.

Frontend:

- Register service worker.
- Request notification permission only after an explicit user action.
- Call `registration.pushManager.subscribe()` with the instance `vapidPublicKey`.
- Save subscription keys in `push_subscriptions`.
- Remove subscription on logout or notification disable.

Backend:

- Add an Edge Function named `send-message-push`.
- Store private VAPID key as a Supabase secret.
- Trigger the Edge Function when a message is inserted.
- Function loads recipient subscriptions, excludes sender, and sends Web Push payloads.

Push payload should be minimal:

```json
{
  "type": "message",
  "conversationId": "uuid",
  "messageId": "uuid",
  "title": "New message",
  "body": "Open chat to read"
}
```

Do not send sensitive message content in push payloads if end-to-end encryption is planned.

## 10. Frontend Architecture

Recommended structure:

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  features/
    auth/
    instances/
    conversations/
    messages/
    notifications/
    settings/
  lib/
    supabase/
    pwa/
    indexeddb/
    validation/
  shared/
    components/
    hooks/
    styles/
    types/
```

React performance guidelines:

- Keep `App` as composition glue, not a monolithic chat implementation.
- Create one Supabase client per selected instance and memoize it by instance ID/config.
- Avoid broad global subscriptions that re-render the whole app on each message.
- Store message lists by `conversationId`.
- Use list virtualization for long conversations.
- Use TanStack Query for request deduplication and cache invalidation.
- Use primitive dependencies in effects.
- Use functional state updates for message append/merge operations.
- Lazy-load heavy routes such as settings, profile, and instance admin screens.

## 11. Offline and Local Cache

Use IndexedDB for:

- Selected instance metadata.
- Recent conversation list.
- Recent messages per conversation.
- Draft messages.
- Push subscription local status.

Rules:

- Version IndexedDB schema.
- Scope all cached data by instance ID and user ID.
- Clear current user's private cache on logout if requested.
- On reconnect, refetch server state and reconcile by message ID and timestamp.

## 12. Development Milestones

### Milestone 1: Project Bootstrap

- Create React + Vite + TypeScript project.
- Add routing, app shell, base styles, linting and formatting.
- Add PWA manifest and service worker registration.
- Add basic installability checks.

Acceptance:

- App runs locally.
- App can be installed as PWA in supported browsers.
- No Supabase integration yet.

### Milestone 2: Instance Manifest

- Add instance URL input screen.
- Fetch and validate manifest.
- Store selected instance.
- Create Supabase client from selected manifest.
- Add instance switch/logout flow.

Acceptance:

- User can connect to a Supabase project using manifest URL.
- Invalid manifests show clear errors.
- Selected instance persists after refresh.

### Milestone 3: Supabase Auth

- Implement email/password sign up.
- Implement email/password sign in.
- Implement Google/Gmail OAuth sign in.
- Implement auth callback route.
- Implement password reset.
- Implement session restore and sign out.

Acceptance:

- User can sign up and sign in with email/password.
- User can sign in with Google when the Supabase instance has Google provider configured.
- Auth state survives refresh.

### Milestone 4: Database and RLS

- Add Supabase migrations for initial schema.
- Add profile creation trigger for new users.
- Add RLS policies.
- Add seed script or local setup instructions.

Acceptance:

- Users cannot read/write conversations they do not belong to.
- User profile exists after first login.
- Basic SQL/RLS tests or manual verification pass.

### Milestone 5: Conversations and Messages

- Conversation list UI.
- Direct conversation creation.
- Group conversation creation.
- Message list.
- Send message.
- Edit/delete own message if included in MVP.

Acceptance:

- User can create/open conversations.
- User can send and read messages.
- RLS still blocks unauthorized access.

### Milestone 6: Realtime

- Subscribe to active conversation messages.
- Update conversation list on new messages.
- Add typing indicators.
- Add online presence.
- Add reconnect/refetch handling.

Acceptance:

- Two browser sessions receive messages without refresh.
- Typing and presence update live.
- Reconnect does not duplicate messages.

### Milestone 7: Push Notifications

- Add notification permission UX.
- Register push subscription.
- Store push subscriptions in Supabase.
- Add Edge Function for Web Push.
- Add DB trigger/webhook for message inserts.
- Add service worker notification click handling.

Acceptance:

- Background user receives push notification for a new message.
- Sender does not receive their own message notification.
- Notification click opens the correct conversation.

### Milestone 8: Offline Cache

- Cache recent conversations and messages in IndexedDB.
- Show cached data while loading.
- Store drafts locally.
- Reconcile after reconnect.

Acceptance:

- Refresh/offline mode shows recent chat state.
- Drafts survive refresh.
- Reconnect sync does not duplicate messages.

### Milestone 9: Deployment and Self-Hosting

- Add frontend deployment instructions.
- Add Supabase hosted setup guide.
- Add Supabase self-host setup guide.
- Add manifest hosting examples.
- Add environment/secrets checklist for Edge Functions.

Acceptance:

- A new maintainer can deploy their own instance using docs.
- Frontend can connect to that instance by manifest URL.

### Milestone 10: Hardening

- Add rate limits where possible.
- Add message length limits.
- Add basic abuse controls.
- Add error monitoring hooks.
- Add backup/export guidance.
- Review RLS policies.
- Review push privacy.

Acceptance:

- Common abuse paths are documented or mitigated.
- Security-sensitive configuration is documented.
- MVP is ready for a small public beta.

## 13. Testing Plan

- Unit tests:
  - Manifest validation.
  - Supabase client factory.
  - Message merge/deduplication helpers.
  - IndexedDB schema helpers.

- Integration tests:
  - Auth session restore.
  - Conversation creation.
  - Send message.
  - RLS access checks.

- Browser tests:
  - Login flow.
  - Instance switch flow.
  - Realtime two-session messaging.
  - PWA installability where automation supports it.
  - Push notification registration mock.

- Manual tests:
  - Google OAuth redirect on deployed host.
  - Real Web Push on desktop Chrome/Edge.
  - Mobile PWA install and notification behavior.

## 14. Security Checklist

- No private keys in frontend bundle.
- No `service_role` key in manifest.
- RLS enabled on every user data table.
- Push subscriptions scoped to authenticated user.
- OAuth redirect URLs restricted per deployment host.
- Message insert policies verify conversation membership.
- Instance manifest validation rejects unknown provider/schema versions.
- Cache is scoped by instance and user.
- Logout clears session and optionally clears local private data.

## 15. Open Decisions

- Whether to support end-to-end encryption in MVP or after MVP.
- Whether user discovery is invite-only, email-based, or public inside an instance.
- Whether direct conversations are created by email, profile search, invite link, or admin invite.
- Whether message content is allowed in push payloads.
- Whether attachments are included in MVP.
- Whether Supabase self-host is a first-class supported path from day one or documented after hosted MVP works.

## 16. Suggested MVP Scope

Build first:

- Supabase instance manifest.
- Email/password auth.
- Google/Gmail OAuth auth.
- Profiles.
- Direct conversations.
- Text messages.
- Realtime message updates.
- PWA installability.
- Basic push notifications.

Defer:

- Attachments.
- E2EE.
- Voice/video.
- Message reactions.
- Advanced moderation.
- Multi-provider Firebase support.
- Full admin dashboard.
