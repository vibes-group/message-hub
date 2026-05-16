# MH Messenger

Open-source realtime messenger prototype built as a React PWA. The client connects to a Supabase-backed messenger instance through a public manifest URL.

## Stack

- React + Vite + TypeScript
- React Router via `react-router`
- Tailwind CSS v4 with `@tailwindcss/vite`
- shadcn/ui-compatible local components
- `react-icons`
- Supabase JS
- TanStack Query
- Zustand
- Dexie
- Vite PWA plugin

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Local Demo Flow

The app includes `public/example.instance.json` so the early UI flow can be tested without a real Supabase project:

```text
http://127.0.0.1:5173/example.instance.json
```

This manifest uses placeholder Supabase values. Real auth and realtime calls require a real Supabase project configured with the SQL migrations in `supabase/migrations`.

## Project Plan

The development roadmap is in `docs/supabase-pwa-messenger-plan.md`.
