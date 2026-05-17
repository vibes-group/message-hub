# MH Messenger

React PWA клиент. Подключается к Supabase-инстансу через manifest URL.

## Dev

```bash
npm install
npm run dev
```

`public/example.instance.json` — плейсхолдер-инстанс для UI без живого Supabase:

```
http://127.0.0.1:5173/example.instance.json
```

Реальный auth/realtime требует Supabase-проекта с миграциями из `supabase/migrations`.
